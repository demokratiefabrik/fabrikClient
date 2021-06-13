/// POLYFILL (IE11 for oAuth2 PKCE Module)
// Note: does not work anymore when outsourced in seperate files..
; (function (window) {
  if (typeof window.TextEncoder !== 'function') {
    const TextEncodingPolyfill = require('text-encoding');
    window.TextEncoder = TextEncodingPolyfill.TextEncoder;
    window.TextDecoder = TextEncodingPolyfill.TextDecoder;
  }
  if (typeof window.crypto === 'undefined') {
    const { webcrypto } = require('webcrypto-shim')
  }
  if (typeof window.fetch === 'undefined') {
    const { fetch } = require('whatwg-fetch');
  }
}(window));

// import('./polyfills')
const { OAuth2AuthCodePKCE } = require('@bity/oauth2-auth-code-pkce')
import { oAuthEventBus } from './eventbus'
import { mapActions } from "vuex";
import { LayoutEventBus } from "src/utils/eventbus"

export default {

  install(Vue, pkce_config) {

    Vue.prototype.pkce = new OAuth2AuthCodePKCE(pkce_config)

    Vue.prototype.login = function (destination_route = null) {
      // save destiantion route to localstorage
      localStorage.setItem('oauth2authcodepkce-destination', JSON.stringify(destination_route));
      Vue.prototype.pkce.fetchAuthorizationCode()
    }

    Vue.prototype.refresh_token = async function () {

      // console.log("@@@ START TOKEN REFRESH")
      Vue.prototype.setOngoingTokenRefresh(true)
      try {
        await Vue.prototype.pkce.exchangeRefreshTokenForAccessToken()
      } catch (error) {
        switch (error.message) {
          case 'ErrorInvalidGrant':
            console.log("Error while refreshing token #83", error)
            LayoutEventBus.$emit('showAuthorizationInvalidToken')
            break;
          default:
            console.log("Error while refreshing token #84", error)
            LayoutEventBus.$emit('showServiceError', { nobuttons: true })
            break;
        }
      }
      // TOKEN REFRESH ENDS: Notify the computed properties
      const jwt = Vue.prototype.pkce.state?.accessToken?.value
      oAuthEventBus.$emit('TokenChanges', jwt)
      oAuthEventBus.$emit('AfterTokenChanged', jwt)
      Vue.prototype.setOngoingTokenRefresh(false)
    }

    // WAIT FOR ONGOING TOKEN REQUESTS! (wait maximal 5 seconds!)
    Vue.prototype.ensureNoRefreshTokenIsOngoing = async function () {
      let iter = 0
      const maxSeconds = 4
      return new Promise(function (resolve, reject) {
        (function waitForOngoingTokenRefresh() {
          const val = Vue.prototype.getOngoingTokenRefresh()
          if (!val) {
            return resolve();
          }

          // console.log("ISNT IT FALSE?", !val)
          iter++;
          if (iter >= maxSeconds * 10) {
            console.log("(infinity loop)")
            Vue.prototype.setOngoingTokenRefresh(false)
            return reject("infinity loop");
          }
          console.log('.')
          setTimeout(waitForOngoingTokenRefresh, 100);
        })()
      })
    }

    Vue.prototype.getOngoingTokenRefresh = function () {
      // return Vue.prototype.$ongoingTokenRefresh
      const val = localStorage.getItem('oauth2authcodepkce-ongoingrefresh')
      // console.log("whats the stage? ", val)
      return val == "1"
    }

    Vue.prototype.setOngoingTokenRefresh = function (value) {
      // Vue.prototype.$ongoingTokenRefresh = value
      return localStorage.setItem('oauth2authcodepkce-ongoingrefresh', value ? 1 : 0)
      console.log(" ongoing SHALL BE ", value)
    }

    // Component Mixin
    Vue.prototype.oauth = new Vue({

      data() {
        return {
          jwt: null
        }
      },

      computed: {

        authorized: function () {
          if (!this.jwt) {
            // THis should not be required, however, you never know;-)
            this.jwt = Vue.prototype.pkce?.state?.accessToken?.value
          }
          const authorized = this.jwt && Vue.prototype.pkce.isAuthorized()
          return (!!authorized)
        },

        ongoing: function () {
          // During oauth setup: if its not yet clear, if user is logged in (i.e. login process is ongoing)
          return (this.authorized === null || this.authorized === undefined)
        },

        payload: function () {
          if (!this.authorized) { return (null) }
          return JSON.parse(window.atob(this.jwt.split('.')[1]))
        },

        userid: function () {
          return this.payload?.sub
        }
      },

      methods: {
        ...mapActions({
          storeOauthAcls: "publicprofilestore/storeOauthAcls"
        }),

        expiredJWT: function () {
          if (!this.payload) {
            return;
          }

          console.log("EXPIRES IN ", Math.round(this.payload.exp - (new Date().getTime() / 1000), 1) / 60, ' minutes.')
          return this.payload.exp < (new Date().getTime() / 1000 + 5)
        },

        /* Refresh token already before a invalid request has been issued */
        refresh_token_if_required: async function () {
          if (!Vue.prototype.pkce.isAuthorized()) {
            return true;
          }

          if (await this.expiredJWT()) {
            if (Vue.prototype.getOngoingTokenRefresh()) {
              await Vue.prototype.ensureNoRefreshTokenIsOngoing().catch(error => { return false })
            } else {
              Vue.prototype.setOngoingTokenRefresh(true)
            }
            if (this.expiredJWT()) {
              await Vue.prototype.refresh_token()
            }
            Vue.prototype.setOngoingTokenRefresh(false)
          }

          return true
        },

        async logout() {
          console.log("$$$ LOGOUT IN PLUGIN")
          Vue.prototype.pkce.reset();
          console.assert(!Vue.prototype.pkce.isAuthorized())
          console.log(Vue.prototype.pkce.state)
          Vue.prototype.pkce.setState({});
          // Second trial....
          console.log(Vue.prototype.pkce.state)
          this.jwt = null
          // oAuthEventBus.$emit('TokenChanges', null)
          // oAuthEventBus.$emit('AfterTokenChanged', null)

          // wait few seconds...before deleting everything...
          setTimeout(() => {
            // Run it twice: dont know why this is required... but sometimes...
            console.log(Vue.prototype.pkce.state, "oauth.logout performed => emit events")
            Vue.prototype.pkce.reset();
            Vue.prototype.pkce.setState({});
            this.jwt = null
            // oAuthEventBus.$emit('TokenChanges', null)
            oAuthEventBus.$emit('AfterTokenChanged', null)
            oAuthEventBus.$emit('AfterLogout')
          }, 10)
        },


        initialize: async function () {

          // During Startup
          oAuthEventBus.$on('TokenChanges', jwt => {
            this.jwt = jwt
            // const refresh = Vue.prototype.pkce.state.refreshToken.value
            // console.log("............NEW NEW REFRESH TOKEN: ", !!refresh, refresh.substring(refresh.length - 5))
          })

          const hasAuthCode = await Vue.prototype.pkce.isReturningFromAuthServer()
            .catch((potentialError) => {
              if (potentialError) {
                console.log(potentialError, "#4385");
                Promise.reject(potentialError)
              }
              console.log("catch without potentialError?", potentialError)
            })

          // const token = Vue.prototype.pkce.isAuthorized() ? await Vue.prototype.pkce.getAccessToken() : null

          let token = null
          try {
            token = await Vue.prototype.pkce.getAccessToken()
            token = token?.token?.value
          } catch (error) {
            console.log("Not logged in, right?", error)
          }

          oAuthEventBus.$emit('TokenChanges', token)
          oAuthEventBus.$emit('AfterTokenChanged', token)
          if (hasAuthCode) {
            oAuthEventBus.$emit('AfterLogin')
          }

          // DEBUG
          // this.expiredJWT()
        }
      }
    })
  }
}
