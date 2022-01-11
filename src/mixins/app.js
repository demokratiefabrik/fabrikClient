/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// import emitter from 'src/utils/emitter'
import { mapGetters, mapActions } from 'vuex'
// import { LayoutEventBus } from 'src/utils/eventbus'
import { useOAuthEmitter } from 'src/plugins/VueOAuth2PKCE/oauthEmitter'
import constants from 'src/utils/constants'
import useAppComposable from 'src/composables/app.composable'
import useAuthComposable from 'src/composables/auth.composable'
import { scroll } from 'quasar';
const { setScrollPosition } = scroll;
import { dom } from 'quasar'
const { offset } = dom


export default {

  async setup() {
    const appComposable = useAppComposable()
    const authComposable = await useAuthComposable()
    oauthEmitter = useOAuthEmitter()
    return {oauthEmitter, appComposable, authComposable}
  },

  data() {
    return {
      appInitialized: false,
      componentKey: 0,
      username_derivate: ''
    };
  },

  watch: {
    // if route changes, hide TextLoading
    // from param removed
    $route(to) {

      // check permission
      if (to.meta.assemblyAcl) {
        if (!Array.isArray(to.meta.assemblyAcl)){
          to.meta.assemblyAcl = [to.meta.assemblyAcl]
        }

        // Not allowed....
        if (!to.params.assemblyIdentifier) {
          console.error('WRONGLY CONFIUGRED ROUTE: assemblyACL option requires and Identifier in the route params')
          this.$router.push({ name: 'home' });
          throw new Error("Oops! You don't seem to have access to that page.");
        }
        
        // find first permission that is allowed.
        const allowed = to.meta.assemblyAcl.find(assemblyAcl => {
          const role = `${assemblyAcl}@${to.params.assemblyIdentifier}`
          // console.log("ROLE", role, this.oauth.payload.roles.includes(role), this.oauth.payload.roles, "llllllllllllllllllllllllllll")
          return this.oauth.payload.roles.includes(role);
        })
        
        if (!allowed) {
          this.$router.push({ name: 'home' });
          throw new Error("Oops! You don't seem to have access to that page.");
        }
      }

      // Monitor ROute change
      this.$root.monitorLog(constants.MONITOR_ROUTE_CHANGE)
    },
  },

  computed: {

    ready() {
      // Can be overwritten by child components.
      this.emitter.emit('hideLoading')
      return true;
    },

    appExitState: function () {
      return this.appComposable.appExitState.value
    },

    ...mapGetters({
      ongoing_assemblies: 'publicindexstore/ongoing_assemblies',
      isUserAssemblyManager: 'publicindexstore/storeOisUserAssemblyManagerauthAcls',
      // lightProfileColor: "publicindexstore/lightProfileColor",
      // profileColor: "profilestore/profileColor",
    })

  },

  methods: {

    showAuthorizationError(data) {
      // this.$root.monitorLog(constants.MONITOR_ERROR_AUTHORIZATION, data)
      let msg_title = this.$t('app.error.authorization_error_title');
      let msg_body = this.$t('app.error.authorization_error_body');
      let icon = 'mdi-key-outline';
      let type = 'error';
      let buttons = ['home'];
      // let buttons = ['reload', 'hide'];
      this.$refs?.maincontent?.showNotificationBanner(
        type,
        msg_title,
        msg_body,
        icon,
        false,
        buttons
      );
    },

    onPageLeave: function handler(event) {
      // ON PAGE LEAVE
      console.log('Shutdown Demokratiefabrik')
      // Might invalidate the token.
      // this.$root.monitorFire(constants.MONITOR_EXIT)
      appComposable.exitApp()
    },

    ...mapActions({
      touchRandomSeed: 'profilestore/touchRandomSeed',
      storeOauthAcls: 'profilestore/storeOauthAcls',
      clearUserData: 'clearUserData',
    })
  },

  created: function () {

    // GlOBAL Page Unmount Listener
    window.addEventListener('beforeunload', this.onPageLeave)

    // Catch globally all show and hide TextLoading events
    this.emitter.on('reload', () => {
      this.$root.reload();
    });
    this.emitter.on('showServiceError', (data) => {
      let msg_title = this.$t('app.error.service_error_title');
      let msg_body = this.$t('app.error.service_error_body');
      let icon = 'mdi-alarm-light-outline';
      let settimer = data?.settimer ? data.settimer : false;
      let buttons = data?.nobuttons ? ['hide'] : ['reload'];
      let type = 'error';
      this.$refs?.maincontent?.showNotificationBanner(
        type,
        msg_title,
        msg_body,
        icon,
        settimer,
        buttons
      )
    })
    this.emitter.once('showNetworkError', (data) => {
      this.$root.monitorLog(constants.MONITOR_ERROR_NETWORK, data)
    })
    this.emitter.on('showNetworkError', (data) => {
      let msg_title = this.$t('app.error.network_error_title');
      let msg_body = this.$t('app.error.network_error_body');
      let icon = 'mdi-alarm-light-outline';
      let type = 'error';
      let buttons = ['reload', 'hide'];
      this.$refs?.maincontent?.showNotificationBanner(
        type,
        msg_title,
        msg_body,
        icon,
        null,
        buttons
      )
    })
    this.emitter.on('showAuthorizationError', (data) => {
      this.showAuthorizationError(data)
    });
    this.emitter.on('showAuthorizationInvalidToken', (data) => {


      this.$root.monitorLog(constants.MONITOR_ERROR_INVALID_TOKEN, data)
      authComposable.setBrokenSession()
      console.log('SILENT LOGOUT,,,')
      this.authComposable.logout(null, {}, true);

      let msg_title = this.$t('auth.authentication_invalid_warning_title');
      let msg_body = this.$t('auth.authentication_invalid_warning_body');
      let icon = 'mdi-key-outline';
      let type = 'error';
      let settimer = data?.settimer ? data.settimer : false;
      let buttons = ['auth', 'home'];

      this.$refs?.maincontent?.showNotificationBanner(
        type,
        msg_title,
        msg_body,
        icon,
        settimer,
        buttons
      )
    })
    this.emitter.on('showTooManyRequestsError', (data) => {
      this.$root.monitorLog(constants.MONITOR_ERROR_TOO_MANY_REQUESTS, data)
      let msg_title = this.$t('app.error.toomanyrequests_error_title');
      let msg_body = this.$t('app.error.toomanyrequests_error_body');
      let icon = 'mdi-car-multiple';
      let type = 'error';
      this.$refs?.maincontent?.showNotificationBanner(
        type,
        msg_title,
        msg_body,
        icon
      );
    });
    this.emitter.on('showAuthenticationWarning', (data) => {
      this.$root.monitorLog(constants.MONITOR_WARNING_AUTHENTICATION, data)
      let type = 'warning';
      let icon = 'mdi-emoticon-cool-outline';
      let msg_title = this.$t('auth.authentication_warning_title');
      let msg_body = this.$t('auth.authentication_warning_body');
      this.$refs?.maincontent?.showNotificationBanner(
        type,
        msg_title,
        msg_body,
        icon,
        false,
        ['auth', 'home']
      );
    });
    this.emitter.on('showAuthenticationError', (data) => {
      this.$root.monitorLog(constants.MONITOR_ERROR_AUTHENTICATION, data)
      let type = 'error';
      let icon = 'mdi-alarm-light-outline';
      let msg_title = this.$t('auth.authentication_error_title');
      let msg_body = this.$t('auth.authentication_error_body');
      this.$refs?.maincontent?.showNotificationBanner(
        type,
        msg_title,
        msg_body,
        icon
      )
    })

    this.emitter.on('PublicProfileLoaded', () => {
      // SYNC USER PROFILE
      // console.log("on PublicProfileLoaded")
      // is email already set: if not => redirect to userprofile...
      this.$store.dispatch('profilestore/setUsernameDerivate', {
        usernameDerivate: this.usernameDerivate()
      })
    })
    this.emitter.on('hideNotificationBanners', data => {
      this.$refs?.maincontent?.hideNotificationBanner();
    })


    // oAuth2PKCE Hooks
    this.oauthEmitter.on('AfterTokenChanged', data => {
      // NOTIFY EVERYONE, THAT TOKEN HAS CHANGED NOW!
      if (data) {
        this.storeOauthAcls({ oauthAcls: this.oauth?.payload?.roles })
      } else {
        console.log('reset oauth acls...')
        this.storeOauthAcls({})
      }
    })

    this.outhEmitter.on('AfterLogout', () => {
      console.log('CLEAR DATA AND REDIRECT TO LOGUT PAGE')
      this.$root.clearUserData()
      this.$router.push({ name: 'logout' })
    })

    this.outhEmitter.on('AfterLogin', () => {

      // reset monitor routine (and push first action)
      appComposable.setLogoutState(false)
      this.$store.dispatch('monitorSetup',)
      this.$root.monitorLog(constants.MONITOR_LOGIN)

      // CHECK FOR REDIRECTION URL in local storage (During Login)
      const destination_route = JSON.parse(localStorage.getItem('oauth2authcodepkce-destination'));
      if (destination_route) {
        localStorage.removeItem('oauth2authcodepkce-destination');
        this.$router.push(destination_route);
      } else {
        this.$router.push({ name: 'home' });
      }

      // send context data
      const data = { extra: this.$q.platform.is };
      data.screenW = screen.width
      this.$root.monitorLog(constants.MONITOR_CONTEXT, data);

      // Clear data of last session...
      this.$root.clearSession()
    })

    // Random Seed => for random allocation of things (i.e. artificial moderator avatars)
    this.touchRandomSeed()

    // to enforce reload of page container!
    this.$root.reload = () => { this.componentKey += 1 }
    this.$root.initialized = false

    // MONITOR ACTIVITIES OF USERS (periodically and on demand)
    this.$store.dispatch('monitorSetup')

    this.$root.getAssemblyHomeRoute = (assembly) => {
      // console.log("get assembly route ", assembly)
      if (!assembly) {
        return ({
          name: 'home',
        })

      }
      return ({
        name: assembly.type,
        params: { assemblyIdentifier: assembly.identifier }
      })
    }

    this.$root.getAssemblyManageRoute = (assembly) => {
      return ({
        name: 'assembly_manage',
        params: {
          assemblyIdentifier: assembly.identifier
        }
      })
    }

    this.$root.gotoAssemblyManage = (assembly) => {
      var route = this.$root.getAssemblyManageRoute(assembly);
      this.$router.pushR(route)
    }

    this.$root.gotoAssemblyHome = (assembly) => {

      var route = this.$root.getAssemblyHomeRoute(assembly);
      this.$router.pushR(route)
    }

    this.$root.scrollToAnchor = (anchor, duration = 300, lag = 0) => {
      const dom = document.getElementsByName(anchor);
      const ele = dom?.item(0);
      const scrollFnc = () => {
        this.fixedSelectedItem = anchor;
        const elOffset = this.$getOffsetTop(ele) - this.appComposable.headerOffset;
        setScrollPosition(window, elOffset, duration);
        setTimeout(() => (this.fixedSelectedItem = null), duration);
      }
      if (lag) {
        setTimeout(scrollFnc, lag);
      } else {
        scrollFnc()
      }
    },

      this.$root.scrollToAnchorIfNecessary = (anchor, duration = 300, lag = 0) => {
        const dom = document.getElementsByName(anchor);
        const ele = dom?.item(0);

        // Offset on screen
        if (offset(ele).top < 50) {
          this.$root.scrollToAnchor(anchor, duration = 300, lag = 0);
        }
      },

      // this.authComposable.logout = async (eventString = null, extra = {}, silent=false) => {
      //   console.log('authComposable.logout call => fire monitor buffer with logout entry. SILENT:', silent), 

      //   await this.$store.dispatch('monitorFire', {
      //     eventString: constants.MONITOR_LOGOUT,
      //     data: {},
      //     onlyWhenTokenValid: true
      //   })

      //   appComposable.setLogoutState()

      //   console.log('await monitorFire ended => call oauth logout function. SILENT:', silent)
      //   this.oauth.logout(silent)
      // }


    this.$root.monitorLog = async (eventString = null, data = {}) => {
      if (!this.oauth.authorized) {
        return (null)
      }

      const route = this.$router.currentRouteObject()
      if (eventString === constants.MONITOR_ROUTE_CHANGE) {
        data.extra = { 'name': route.name }
      }
      data = { name: route.name, ...route.params, ...data }
      if (this.appComposable.assemblyIdentifier.value && !data.assemblyIdentifier) {
        data.assemblyIdentifier = this.appComposable.assemblyIdentifier.value
      }
      this.$store.dispatch('monitorLog', {
        eventString,
        data
      })
    }

    this.$root.monitorFire = async (eventString = null, extra = {}, onlyWhenTokenValid = false) => {
      if (!this.oauth.authorized) {
        return (null)
      }
      const route = this.$router.currentRouteObject()
      const data = { name: route.name, ...route.params, ...extra }
      if (this.appComposable.assemblyIdentifier.value && !data.assemblyIdentifier) {
        data.assemblyIdentifier = this.appComposable.assemblyIdentifier.value
      }

      await this.$store.dispatch('monitorFire', {
        eventString,
        data,
        onlyWhenTokenValid
      })
    }

    /**
     * Clear all the data, that we want to reset for every participation session
     */
    this.$root.clearSession = () => {
      appComposable.setStageID(null)
      appComposable.setAssemblyIdentifier(null)
    }

    /**
     * Clear all the data, that is linked to a certain user. => performed at logout
     */
    this.$root.clearUserData = () => {
      this.$root.clearSession()
      this.clearUserData()
    }

    // console.log("--- end of app.js created")
  },

  mounted: async function () {
    console.log('*** INIT OAUTH ***')
    try {
      await this.oauth.initialize()
    } catch (error) {
      console.log('error in oauth initialization...', error)
      switch (error.message) {
        case 'ErrorInvalidGrant':
          this.emmit.$emit('showAuthorizationInvalidToken')
          break;
        default:
          this.emitter.emit('showServiceError', { nobuttons: true })
          break;
      }
      // end mounting...
      return;
    }

    // INITIALIZE TOKEN 
    console.log('*** OAUTH INITIALIZATION ***')
    this.appInitialized = await this.oauth.refresh_token_if_required()

    console.log('*** START MONITOR ENGINE ***')
    // Start periodic monitorLog Raiser
    // keep this interval low (much lower than the intervall number specified in env. files) 
    // (e.g. 1 Min.)
    let intervall = parseInt(process.env.ENV_APISERVER_MONITOR_INTERVAL_SECONDS);
    if (!intervall) { intervall = 60 }
    this.$root.$monitorTimer = setInterval(() => {
      if (this.appComposable.assemblyIdentifier.value && this.oauth.userid) {
        this.$store.dispatch('assemblystore/syncAssembly', {
          oauthUserID: this.oauth.userid,
          assemblyIdentifier: this.appComposable.assemblyIdentifier.value
        })
      }
      this.$root.monitorFire()
    }, intervall * 1000)



    // In case of oauth error. Dont load data from resource server...
    if (this.appInitialized) {

      console.log('*** SYNC LOCAL DATA ***')
      console.log('...publicIndex')
      this.$store.dispatch('publicindexstore/syncPublicIndex')

      if (this.oauth.userid) {
        console.log('...profile')
        const fetchProfile = await this.$store.dispatch('profilestore/syncProfile', {
          oauthUserID: this.oauth.userid,
          oauthUserEmail: this.oauth.payload?.userEmail
        })

        // Monitor User Context
        console.log('FETCHED PROFILE?')
        if (fetchProfile) {
          this.$root.monitorLog(constants.MONITOR_ROUTE_CHANGE)
          console.log('FETCHED PROFILE!', constants.MONITOR_CONTEXT)

        }
      }
    }

    // END
    console.log('*** APP MOUNTED ***')
  },

  beforeDestroy() {

    // TODO: destroy all eventbus listeners!!!
    // Don't forget to turn the listener off before your component is destroyed
    // this.$root.$off('openLeftDrawer', this.openLeftDrawerCallback)
  }
}
