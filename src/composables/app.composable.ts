/** DEMOKRATIFABRIK RUNTIME VARIABLES */
import { watch, ref, readonly } from 'vue';
import { RouteRecordRaw, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import useLibraryComposable from 'src/utils/library'
import useEmitter from 'src/utils/emitter';

const {removeItem} = useLibraryComposable()
export interface INotificationConfig {
  settimer?: boolean;
  nobuttons?: boolean;
}
export interface INotificationBanner {
  type: string;
  // 'error' | 'warning';
  title: string;
  body: string;
  icon: string;
  buttons?: string[];
  settimer?: boolean;
  redirectRoute?: RouteRecordRaw;
}

// APP State
const stageID = ref<number | null>(null);
const assemblyIdentifier = ref<string | null>(null);
const appExitState = ref<boolean>(false);
const emitter = useEmitter()
// Layout
const headerOffset = ref<number>(150); // default header is minimized within assembly sections
const setHeaderOffset = (offset: number) => (headerOffset.value = offset);
// Notifications
const notificationBanner = ref<INotificationBanner | null>(null);
const loadingGifStack = ref<string[]>([]);

export default function useAppComposable() {
  // console.log('DEBUG: APP COMPOSABLE - START');

  const { t } = useI18n();
  const currentRoute = useRoute()
  const exitApp = () => (appExitState.value = true);
  const setStageID = (id: number | null) => (stageID.value = id);
  const setAssemblyIdentifier = (identifier: string | null) =>
    (assemblyIdentifier.value = identifier);


  /* LOADING GIF: give a label to facilitate debugging... 
    -------------------------
  */
  const showLoadingGif = (label) => {    
    // const extlabel = `${label}${timestamp()}`
    loadingGifStack.value.push(label)
    emitter.emit('loadingGifStackChange', loadingGifStack.value)
    setTimeout(() => {
      // disable loadingGif after five seconds... (if not already removed)
      emitter.emit('loadingGifStackChange', loadingGifStack.value)
      loadingGifStack.value = removeItem(loadingGifStack.value, label)
    }, 5000);
  }

  const hideLoadingGif = (label) => {    
    // const extlabel = `${label}${timestamp()}`
    loadingGifStack.value = removeItem(loadingGifStack.value, label)
    emitter.emit('loadingGifStackChange', loadingGifStack.value)
  }
  
  /** Remove all loadingGifs (used in case of errors) */
  const clearLoadingGif = () => {
    loadingGifStack.value = []
  }

  /* NOTIFICATIONS 
  -------------------------*/
  const showNotification = (banner: INotificationBanner): void => {
    if (banner.settimer) {
      setTimeout(() => {
        notificationBanner.value = null        
        emitter.emit('notificationBannerChange', notificationBanner.value)
      }, 5000);
    }
    if (banner.type === 'error') {
      clearLoadingGif()
    }
    notificationBanner.value = banner;
    emitter.emit('notificationBannerChange', notificationBanner.value)
  }

  /* Ensure that all (error) messages disappear, when route changes.. */
  watch(currentRoute, () => {
    console.log('route change in API')
    notificationBanner.value = null        
  })

  const showAuthorizationError = (
    config: INotificationConfig | null = null
  ) => {
    // this.$root.monitorLog(constants.MONITOR_ERROR_AUTHORIZATION, data)
    const banner = {
      type: 'error',
      icon: 'mdi-key-outline',
      title: t('app.error.authorization_error_title'),
      body: t('app.error.authorization_error_body'),
      buttons: ['home'],
      settimer: config?.settimer ? true : false,
    };

    showNotification(banner)
  };

  const showServiceError = (config: INotificationConfig | null = null) => {
    const banner = {
      type: 'error',
      icon: 'mdi-alarm-light-outline',
      title: t('app.error.service_error_title'),
      body: t('app.error.service_error_body'),
      buttons: config?.nobuttons ? ['hide'] : ['reload'],
      settimer: config?.settimer ? true : false,
    };

    showNotification(banner)
  };

  const showNetworkError = (config: INotificationConfig | null = null) => {
    // this.$root.monitorLog(constants.MONITOR_ERROR_TOO_MANY_REQUESTS, data)
    const banner = {
      type: 'error',
      icon: 'mdi-alarm-light-outline',
      title: t('app.error.network_error_title'),
      body: t('app.error.network_error_body'),
      buttons: ['reload', 'hide'],
      settimer: config?.settimer ? true : false,
    };

    showNotification(banner)
  };

  const showAuthorizationInvalidToken = (
    config: INotificationConfig | null = null
  ) => {
    //       this.$root.monitorLog(constants.MONITOR_ERROR_INVALID_TOKEN, data)
    //       setBrokenSession()
    //       console.log('SILENT LOGOUT,,,')
    //       this.authComposable.logout(null, {}, true);
    const banner = {
      type: 'error',
      icon: 'mdi-key-outline',
      title: t('auth.authentication_invalid_warning_title'),
      body: t('auth.authentication_invalid_warning_body'),
      buttons: ['auth', 'home'],
      settimer: config?.settimer ? true : false,
    };

    showNotification(banner)
  };

  const showTooManyRequestsError = (
    config: INotificationConfig | null = null
  ) => {
    // this.$root.monitorLog(constants.MONITOR_ERROR_TOO_MANY_REQUESTS, data)
    const banner = {
      type: 'error',
      icon: 'mdi-car-multiple',
      title: t('app.error.toomanyrequests_error_title'),
      body: t('app.error.toomanyrequests_error_body'),
      settimer: config?.settimer ? true : false,
    };

    showNotification(banner)
  };

  const showAuthenticationWarning = (
    config: INotificationConfig | null = null
  ) => {
    // this.$root.monitorLog(constants.MONITOR_WARNING_AUTHENTICATION, data)
    const banner = {
      type: 'warning',
      icon: 'mdi-emoticon-cool-outline',
      title: t('auth.authentication_warning_title'),
      body: t('auth.authentication_warning_body'),
      buttons: ['auth', 'home'], 
      settimer: config?.settimer ? true : false,
    };

    showNotification(banner)
  };

  const showAuthenticationError = (
    config: INotificationConfig | null = null
  ) => {
    // this.$root.monitorLog(constants.MONITOR_ERROR_AUTHENTICATION, data)
    const banner = {
      type: 'error',
      icon: 'mdi-alarm-light-outline',
      title: t('auth.authentication_error_title'),
      body: t('auth.authentication_error_body'),
      settimer: config?.settimer ? true : false,
    };

    showNotification(banner)
  };


  const initialize = () => {
    emitter.on('showNetworkError', () => {
      // TODO: monitorLog Once
      showNetworkError();      
    });
    
    emitter.on('showServiceError', () => {
      // TODO: monitorLog Once
      showServiceError();      
    });
    
    emitter.on('showAuthorizationError', () => {
      // TODO: monitorLog Once
      showAuthorizationError();      
    });
    
    emitter.on('showTooManyRequestsError', () => {
      // TODO: monitorLog Once
      showTooManyRequestsError();      
    });
    
    emitter.on('showAuthenticationWarning', () => {
      // TODO: monitorLog Once
      showAuthenticationWarning();      
    });
    
    emitter.on('showServiceError', () => {
      // TODO: monitorLog Once
      showServiceError();      
    });
  }

  return {
    stageID: readonly(stageID),
    assemblyIdentifier: readonly(assemblyIdentifier),
    appExitState: readonly(appExitState),
    headerOffset: readonly(headerOffset),
    showAuthenticationError,
    showServiceError,
    showAuthenticationWarning,
    showNetworkError,
    showTooManyRequestsError,
    showAuthorizationInvalidToken,
    showAuthorizationError,
    exitApp,
    initialize,
    setStageID,
    setAssemblyIdentifier,
    setHeaderOffset,
    hideLoadingGif,
    showLoadingGif
  };
}

// import { scroll } from 'quasar';
// const { setScrollPosition } = scroll;
// import { dom } from 'quasar'
// const { offset } = dom

//   data() {
//     return {
//       appInitialized: false,
//       componentKey: 0,
//     };
//   },

//   computed: {
//     ready() {
//       // Can be overwritten by child components.
//       this.$emitter.emit('hideLoading')
//       return true;
//     },
//     appExitState: function () {
//       return this.appComposable.appExitState.value
//     },

//     onPageLeave: function handler(event) {
//       // ON PAGE LEAVE
//       console.log('Shutdown Demokratiefabrik')
//       // Might invalidate the token.
//       // this.$root.monitorFire(constants.MONITOR_EXIT)
//       appComposable.exitApp()
//     },
//   },

//   created: function () {
//     // GlOBAL Page Unmount Listener
//     window.addEventListener('beforeunload', this.onPageLeave)
//     // Catch globally all show and hide TextLoading events
//     this.$emitter.on('reload', () => {
//       this.$root.reload();
//     });

//     this.$emitter.on('PublicProfileLoaded', () => {
//       // SYNC USER PROFILE
//       // console.log("on PublicProfileLoaded")
//       // is email already set: if not => redirect to userprofile...
//       this.$store.dispatch('profilestore/setUsernameDerivate', {
//         usernameDerivate: this.usernameDerivate()
//       })
//     })
//     this.$emitter.on('hideNotificationBanners', data => {
//       this.$refs?.maincontent?.hideNotificationBanner();
//     })

//     // oAuth2PKCE Hooks
//     this.oauthEmitter.on('AfterTokenChanged', data => {
//       // NOTIFY EVERYONE, THAT TOKEN HAS CHANGED NOW!
//       if (data as localAccessTokenPartial) {
//         this.storeOauthAcls({ oauthAcls: this.oauth?.payload?.roles })
//       } else {
//         console.log('reset oauth acls...')
//         this.storeOauthAcls({})
//       }
//     })

//     this.outhEmitter.on('AfterLogout', () => {
//       console.log('CLEAR DATA AND REDIRECT TO LOGUT PAGE')
//       this.$root.clearUserData()
//       this.$router.push({ name: 'logout' })
//     })

//     this.outhEmitter.on('AfterLogin', () => {

//       // reset monitor routine (and push first action)
//       appComposable.setLogoutState(false)
//       this.$store.dispatch('monitorSetup',)
//       this.$root.monitorLog(constants.MONITOR_LOGIN)

//       // CHECK FOR REDIRECTION URL in local storage (During Login)
//       const destination_route = JSON.parse(localStorage.getItem('oauth2authcodepkce-destination'));
//       if (destination_route) {
//         localStorage.removeItem('oauth2authcodepkce-destination');
//         this.$router.push(destination_route);
//       } else {
//         this.$router.push({ name: 'home' });
//       }

//       // send context data
//       const data = { extra: this.$q.platform.is };
//       data.screenW = screen.width
//       this.$root.monitorLog(constants.MONITOR_CONTEXT, data);

//       // Clear data of last session...
//       this.$root.clearSession()
//     })

//     // Random Seed => for random allocation of things (i.e. artificial moderator avatars)
//     this.touchRandomSeed()

//     // to enforce reload of page container!
//     this.$root.reload = () => { this.componentKey += 1 }
//     this.$root.initialized = false

//     // MONITOR ACTIVITIES OF USERS (periodically and on demand)
//     this.$store.dispatch('monitorSetup')

//     this.$root.getAssemblyHomeRoute = (assembly) => {
//       // console.log("get assembly route ", assembly)
//       if (!assembly) {
//         return ({
//           name: 'home',
//         })

//       }
//       return ({
//         name: assembly.type,
//         params: { assemblyIdentifier: assembly.identifier }
//       })
//     }

//     this.$root.getAssemblyManageRoute = (assembly) => {
//       return ({
//         name: 'assembly_manage',
//         params: {
//           assemblyIdentifier: assembly.identifier
//         }
//       })
//     }

//     this.$root.gotoAssemblyManage = (assembly) => {
//       var route = this.$root.getAssemblyManageRoute(assembly);
//       this.$pushR(route)
//     }

//     this.$root.gotoAssemblyHome = (assembly) => {

//       var route = this.$root.getAssemblyHomeRoute(assembly);
//       this.$pushR(route)
//     }

//     this.$root.scrollToAnchor = (anchor, duration = 300, lag = 0) => {
//       const dom = document.getElementsByName(anchor);
//       const ele = dom?.item(0);
//       const scrollFnc = () => {
//         this.fixedSelectedItem = anchor;
//         const elOffset = this.$getOffsetTop(ele) - this.appComposable.headerOffset;
//         setScrollPosition(window, elOffset, duration);
//         setTimeout(() => (this.fixedSelectedItem = null), duration);
//       }
//       if (lag) {
//         setTimeout(scrollFnc, lag);
//       } else {
//         scrollFnc()
//       }
//     },

//       this.$root.scrollToAnchorIfNecessary = (anchor, duration = 300, lag = 0) => {
//         const dom = document.getElementsByName(anchor);
//         const ele = dom?.item(0);

//         // Offset on screen
//         if (offset(ele).top < 50) {
//           this.$root.scrollToAnchor(anchor, duration = 300, lag = 0);
//         }
//       },

//       // this.authComposable.logout = async (eventString = null, extra = {}, silent=false) => {
//       //   console.log('authComposable.logout call => fire monitor buffer with logout entry. SILENT:', silent),

//       //   await this.$store.dispatch('monitorFire', {
//       //     eventString: constants.MONITOR_LOGOUT,
//       //     data: {},
//       //     onlyWhenTokenValid: true
//       //   })

//       //   appComposable.setLogoutState()

//       //   console.log('await monitorFire ended => call oauth logout function. SILENT:', silent)
//       //   this.oauth.logout(silent)
//       // }

//     this.$root.monitorLog = async (eventString = null, data = {}) => {
//       if (!this.oauth.authorized) {
//         return (null)
//       }

//       const current = this.$router.currentRoute;
//       if (eventString === constants.MONITOR_ROUTE_CHANGE) {
//         data.extra = { 'name': current.name }
//       }
//       data = { name: current.name, ...current.params, ...data }
//       if (this.appComposable.assemblyIdentifier.value && !data.assemblyIdentifier) {
//         data.assemblyIdentifier = this.appComposable.assemblyIdentifier.value
//       }
//       this.$store.dispatch('monitorLog', {
//         eventString,
//         data
//       })
//     }

//     this.$root.monitorFire = async (eventString = null, extra = {}, onlyWhenTokenValid = false) => {
//       if (!this.oauth.authorized) {
//         return (null)
//       }

//       const router = useRouter()
//       const current = router.currentRoute;
//       const data = { name: current.name, ...current.params, ...extra }
//       if (this.appComposable.assemblyIdentifier.value && !data.assemblyIdentifier) {
//         data.assemblyIdentifier = this.appComposable.assemblyIdentifier.value
//       }

//       await this.$store.dispatch('monitorFire', {
//         eventString,
//         data,
//         onlyWhenTokenValid
//       })
//     }

//     /**
//      * Clear all the data, that we want to reset for every participation session
//      */
//     this.$root.clearSession = () => {
//       appComposable.setStageID(null)
//       appComposable.setAssemblyIdentifier(null)
//     }

//     /**
//      * Clear all the data, that is linked to a certain user. => performed at logout
//      */
//     this.$root.clearUserData = () => {
//       this.$root.clearSession()
//       this.clearUserData()
//     }

//     // console.log("--- end of app.js created")
//   },

//   mounted:

//     // INITIALIZE TOKEN
//     console.log('*** OAUTH INITIALIZATION ***')
//     this.appInitialized = await this.oauth.refresh_token_if_required()

//     console.log('*** START MONITOR ENGINE ***')
//     // Start periodic monitorLog Raiser
//     // keep this interval low (much lower than the intervall number specified in env. files)
//     // (e.g. 1 Min.)
//     let intervall = parseInt(process.env.ENV_APISERVER_MONITOR_INTERVAL_SECONDS);
//     if (!intervall) { intervall = 60 }
//     this.$root.$monitorTimer = setInterval(() => {
//       if (this.appComposable.assemblyIdentifier.value && this.oauth.userid) {
//         this.$store.dispatch('assemblystore/syncAssembly', {
//           oauthUserID: this.oauth.userid,
//           assemblyIdentifier: this.appComposable.assemblyIdentifier.value
//         })
//       }
//       this.$root.monitorFire()
//     }, intervall * 1000)

//     // In case of oauth error. Dont load data from resource server...
//     if (this.appInitialized) {

//       console.log('*** SYNC LOCAL DATA ***')
//       console.log('...publicIndex')
//       this.$store.dispatch('publicindexstore/syncPublicIndex')

//       if (this.oauth.userid) {
//         console.log('...profile')
//         const fetchProfile = await this.$store.dispatch('profilestore/syncProfile', {
//           oauthUserID: this.oauth.userid,
//           oauthUserEmail: this.oauth.payload?.userEmail
//         })

//         // Monitor User Context
//         console.log('FETCHED PROFILE?')
//         if (fetchProfile) {
//           this.$root.monitorLog(constants.MONITOR_ROUTE_CHANGE)
//           console.log('FETCHED PROFILE!', constants.MONITOR_CONTEXT)

//         }
//       }
//     }

// TODO: destroy all eventbus listeners!!! Right?
// this.$root.$off('openLeftDrawer', this.openLeftDrawerCallback)
