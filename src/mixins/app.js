import { mapGetters, mapActions } from 'vuex'
import { LayoutEventBus } from "src/utils/eventbus"
import { oAuthEventBus } from "src/plugins/VueOAuth2PKCE/eventbus"
import constants from 'src/utils/constants'
import { runtimeStore, runtimeMutations } from "src/store/runtime.store"
import { scroll } from "quasar";
const { setScrollPosition } = scroll;
// const { setBrand } = colors
import { dom } from 'quasar'
const { offset } = dom

export default {

  data() {
    return {
      appInitialized: false,
      componentKey: 0,
      username_derivate: ''
    };
  },

  watch: {
    // if route changes, hide TextLoading
    $route(to, from) {

      // check permission
      if (to.meta.assemblyAcl) {
        const role = `${to.meta.assemblyAcl}@${to.params.assemblyIdentifier}`
        if (!to.params.assemblyIdentifier || !this.oauth.payload.roles.includes(role)) {
          // Not allowed....
          if (!to.params.assemblyIdentifier) {
            console.error("WRONGLY CONFIUGRED ROUTE: assemblyACL option requires and Identifier in the route params")
          }

          console.error("NOT AUTHORIZED....", to, this.oauth.payload.roles, this.oauth.payload.roles.includes(role), role)
          this.$router.push({ name: "home" });
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
      LayoutEventBus.$emit('hideLoading')
      return true;
    },

    appExitState: function () {
      return runtimeStore.appExitState
    },

    ...mapGetters({
      ongoing_assemblies: "publicindexstore/ongoing_assemblies",
      isUserAssemblyManager: "publicindexstore/storeOisUserAssemblyManagerauthAcls",
      // lightProfileColor: "publicindexstore/lightProfileColor",
      // profileColor: "publicprofilestore/profileColor",
    })

  },

  methods: {

    showAuthorizationError(data) {
      // this.$root.monitorLog(constants.MONITOR_ERROR_AUTHORIZATION, data)
      let msg_title = this.$i18n.t("app.error.authorization_error_title");
      let msg_body = this.$i18n.t("app.error.authorization_error_body");
      let icon = "mdi-key-outline";
      let type = "error";
      let buttons = ['reload', 'hide'];
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
      console.log("Shutdown Demokratiefabrik")
      // Might invalidate the token.
      // this.$root.monitorFire(constants.MONITOR_EXIT)
      runtimeMutations.exitApp()
    },

    ...mapActions({
      touchRandomSeed: "publicprofilestore/touchRandomSeed",
      storeOauthAcls: "publicprofilestore/storeOauthAcls",
      clearUserData: "clearUserData",
    })
  },

  created: function () {

    // GlOBAL Page Unmount Listener
    window.addEventListener('beforeunload', this.onPageLeave)

    // Catch globally all show and hide TextLoading events
    LayoutEventBus.$on("reload", () => {
      this.$root.reload();
    });
    LayoutEventBus.$on("showServiceError", (data) => {
      let msg_title = this.$i18n.t("app.error.service_error_title");
      let msg_body = this.$i18n.t("app.error.service_error_body");
      let icon = "mdi-alarm-light-outline";
      let settimer = data?.settimer ? data.settimer : false;
      let buttons = data?.nobuttons ? ['hide'] : ["reload"];
      let type = "error";
      this.$refs?.maincontent?.showNotificationBanner(
        type,
        msg_title,
        msg_body,
        icon,
        settimer,
        buttons
      )
    })
    LayoutEventBus.$once("showNetworkError", (data) => {
      this.$root.monitorLog(constants.MONITOR_ERROR_NETWORK, data)
    })
    LayoutEventBus.$on("showNetworkError", (data) => {
      let msg_title = this.$i18n.t("app.error.network_error_title");
      let msg_body = this.$i18n.t("app.error.network_error_body");
      let icon = "mdi-alarm-light-outline";
      let type = "error";
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
    LayoutEventBus.$on("showAuthorizationError", (data) => {
      this.showAuthorizationError(data)
    });
    LayoutEventBus.$on("showAuthorizationInvalidToken", (data) => {
      this.$root.monitorLog(constants.MONITOR_ERROR_INVALID_TOKEN, data)
      runtimeMutations.setBrokenSession()
      let msg_title = this.$i18n.t("auth.authentication_invalid_warning_title");
      let msg_body = this.$i18n.t("auth.authentication_invalid_warning_body");
      let icon = "mdi-key-outline";
      let type = "error";
      let settimer = data?.settimer ? data.settimer : false;
      let buttons = ['auth'];

      this.$refs?.maincontent?.showNotificationBanner(
        type,
        msg_title,
        msg_body,
        icon,
        settimer,
        buttons
      )
    })
    LayoutEventBus.$on("showTooManyRequestsError", (data) => {
      this.$root.monitorLog(constants.MONITOR_ERROR_TOO_MANY_REQUESTS, data)
      let msg_title = this.$i18n.t("app.error.toomanyrequests_error_title");
      let msg_body = this.$i18n.t("app.error.toomanyrequests_error_body");
      let icon = "mdi-car-multiple";
      let type = "error";
      this.$refs?.maincontent?.showNotificationBanner(
        type,
        msg_title,
        msg_body,
        icon
      );
    });
    LayoutEventBus.$on("showAuthenticationWarning", (data) => {
      this.$root.monitorLog(constants.MONITOR_WARNING_AUTHENTICATION, data)
      let type = "warning";
      let icon = "mdi-emoticon-cool-outline";
      let msg_title = this.$i18n.t("auth.authentication_warning_title");
      let msg_body = this.$i18n.t("auth.authentication_warning_body");
      this.$refs?.maincontent?.showNotificationBanner(
        type,
        msg_title,
        msg_body,
        icon,
        false,
        ["auth", "home"]
      );
    });
    LayoutEventBus.$on("showAuthenticationError", (data) => {
      this.$root.monitorLog(constants.MONITOR_ERROR_AUTHENTICATION, data)
      let type = "error";
      let icon = "mdi-alarm-light-outline";
      let msg_title = this.$i18n.t("auth.authentication_error_title");
      let msg_body = this.$i18n.t("auth.authentication_error_body");
      this.$refs?.maincontent?.showNotificationBanner(
        type,
        msg_title,
        msg_body,
        icon
      )
    })

    LayoutEventBus.$on("PublicProfileLoaded", () => {
      // SYNC USER PROFILE
      // console.log("on PublicProfileLoaded")
      // is email already set: if not => redirect to userprofile...
      this.$store.dispatch("publicprofilestore/setUsernameDerivate", {
        usernameDerivate: this.usernameDerivate()
      })
    })
    LayoutEventBus.$on("hideNotificationBanners", data => {
      this.$refs?.maincontent?.hideNotificationBanner();
    })


    // oAuth2PKCE Hooks
    oAuthEventBus.$on('AfterTokenChanged', data => {
      // NOTIFY EVERYONE, THAT TOKEN HAS CHANGED NOW!
      if (data) {
        this.storeOauthAcls({ oauthAcls: this.oauth?.payload?.roles })
      } else {
        console.log("reset oauth acls...")
        this.storeOauthAcls({})
      }
    })

    oAuthEventBus.$on("AfterLogout", () => {
      console.log("CLEAR DATA AND REDIRECT TO LOGUT PAGE")
      this.$root.clearUserData()
      this.$router.push({ name: "logout" })
    })

    oAuthEventBus.$on('AfterLogin', () => {

      // reset monitor routine (and push first action)
      runtimeMutations.setLogoutState(false)
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
        const elOffset = this.$getOffsetTop(ele) - this.$root.headerOffset;
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

      this.$root.logout = async (eventString = null, extra = {}) => {
        console.log("$root.logout call => fire monitor buffer with logout entry")

        await this.$store.dispatch('monitorFire', {
          eventString: constants.MONITOR_LOGOUT,
          data: {},
          onlyWhenTokenValid: true
        })

        runtimeMutations.setLogoutState()

        console.log("await monitorFire ended => call oauth logout function.  ")
        this.oauth.logout()
      }


    this.$root.username = (profile) => {
      return profile ? profile.U : "Anonymous";
    }

    this.$root.username_derivation = (profile, shortversion, thirdPerson = true) => {
      if (!profile) {
        return "";
      }
      const altitude = profile.ALT;
      const fullname = profile.FN;
      const canton = profile.CA;

      if (thirdPerson) {
        return this.$i18n.t(`auth.name_derivation_3rd_party${shortversion ? '_short' : ''}`, {
          fullname: fullname,
          canton: canton,
          altitude: altitude,
        });
      } else {
        return this.$i18n.t(`auth.name_derivation`, {
          fullname: fullname,
          canton: canton,
          altitude: altitude,
        });
      }

    }

    this.$root.monitorLog = async (eventString = null, data = {}) => {
      if (!this.oauth.authorized) {
        return (null)
      }

      const route = this.$router.currentRouteObject()
      if (eventString === constants.MONITOR_ROUTE_CHANGE) {
        data.extra = { 'name': route.name }
      }
      data = { name: route.name, ...route.params, ...data }
      if (runtimeStore.assemblyIdentifier && !data.assemblyIdentifier) {
        data.assemblyIdentifier = runtimeStore.assemblyIdentifier
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
      if (runtimeStore.assemblyIdentifier && !data.assemblyIdentifier) {
        data.assemblyIdentifier = runtimeStore.assemblyIdentifier
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
      runtimeMutations.setStageID(null)
      runtimeMutations.setAssemblyIdentifier(null)
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
    console.log("*** INIT OAUTH ***")
    try {
      await this.oauth.initialize()
    } catch (error) {
      console.log("error in oauth initialization...", error)
      switch (error.message) {
        case 'ErrorInvalidGrant':
          LayoutEventBus.$emit('showAuthorizationInvalidToken')
          break;
        default:
          LayoutEventBus.$emit('showServiceError', { nobuttons: true })
          break;
      }
      // end mounting...
      return;
    }

    // INITIALIZE TOKEN 
    console.log("*** OAUTH INITIALIZATION ***")
    this.appInitialized = await this.oauth.refresh_token_if_required()

    console.log("*** START MONITOR ENGINE ***")
    // Start periodic monitorLog Raiser
    // keep this interval low (much lower than the intervall number specified in env. files) 
    // (e.g. 1 Min.)
    let intervall = parseInt(process.env.ENV_APISERVER_MONITOR_INTERVAL_SECONDS);
    if (!intervall) { intervall = 60 }
    this.$root.$monitorTimer = setInterval(() => {
      if (runtimeStore.assemblyIdentifier && this.oauth.userid) {
        this.$store.dispatch("assemblystore/syncAssembly", {
          oauthUserID: this.oauth.userid,
          assemblyIdentifier: runtimeStore.assemblyIdentifier
        })
      }
      this.$root.monitorFire()
    }, intervall * 1000)



    // In case of oauth error. Dont load data from resource server...
    if (this.appInitialized) {

      console.log("*** SYNC LOCAL DATA ***")
      console.log("...publicIndex")
      this.$store.dispatch('publicindexstore/syncPublicIndex')

      if (this.oauth.userid) {
        console.log("...profile")
        const fetchProfile = await this.$store.dispatch("publicprofilestore/syncProfile", {
          oauthUserID: this.oauth.userid,
          oauthUserEmail: this.oauth.payload?.userEmail
        })

        // Monitor User Context
        console.log("FETCHED PROFILE?")
        if (fetchProfile) {
          this.$root.monitorLog(constants.MONITOR_ROUTE_CHANGE)
          console.log("FETCHED PROFILE!", constants.MONITOR_CONTEXT)

        }
      }
    }

    // END
    console.log("*** APP MOUNTED ***")
  },

  beforeDestroy() {

    // TODO: destroy all eventbus listeners!!!
    // Don't forget to turn the listener off before your component is destroyed
    // this.$root.$off('openLeftDrawer', this.openLeftDrawerCallback)
  }
}
