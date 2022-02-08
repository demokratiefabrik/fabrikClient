/** DEMOKRATIFABRIK RUNTIME VARIABLES */
import { watch, ref, readonly } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
// import useLibraryComposable from 'src/utils/library';
import library  from 'src/utils/library';
import useEmitter from 'src/utils/emitter';
import useAssemblyComposable from './assembly.composable';
import useRouterComposable from './router.composable';
import useAuthComposable from './auth.composable';
import useMonitorComposable from './monitor.composable';
import constants from 'src/utils/constants';
import { useQuasar } from 'quasar';
// const { setVerticalScrollPosition } = scroll;
// import { dom } from 'quasar';
// const { offset } = dom;
import { useStore } from 'vuex';
import { INotificationBanner } from 'src/models/layout';
import useStoreComposable from './store.composable';

const { removeItem } = library;
const headerOffset = ref<number>(150); // default header is minimized within assembly sections
const setHeaderOffset = (offset: number) => (headerOffset.value = offset);

export interface INotificationConfig {
  settimer?: boolean;
  nobuttons?: boolean;
}

// APP State
const appExitState = ref<boolean>(false);
const emitter = useEmitter();

const { setStageID, setAssemblyIdentifier, assemblyIdentifier, stageID } =
useStoreComposable();

// Notifications
const notificationBanner = ref<INotificationBanner | undefined>(undefined);
const loadingGifStack = ref<string[]>([]);

let output: null | any = null;

export default function useAppComposable() {
  const setup = () => {
    console.log('DEBUG: APP COMPOSABLE - START');


    const { initialize: assemblyInitialize, syncUserAssembly } =
      useAssemblyComposable('app.comp');
    const {
      authorized,
      logoutState,
      logout,
      is_in_testing_phase,
      initialize: authInitialize,
    } = useAuthComposable();
    const { monitorLog, initialize: monitorInitialize } =
      useMonitorComposable();
    const { setLastRoute, instanceNr } = useRouterComposable();
    const store = useStore();
    const $q = useQuasar();
    const currentRoute = useRoute();
    // const { getOffsetTop } = library;
    const { t } = useI18n();
    const exitApp = () => (appExitState.value = true);

    /* LOADING GIF: give a label to facilitate debugging... 
    -------------------------
  */

    const showLoadingGif = (label) => {
      // const extlabel = `${label}${timestamp()}`
      loadingGifStack.value.push(label);
      emitter.emit('loadingGifStackChange', loadingGifStack.value);
      setTimeout(() => {
        // disable loadingGif after five seconds... (if not already removed)
        emitter.emit('loadingGifStackChange', loadingGifStack.value);
        loadingGifStack.value = removeItem(loadingGifStack.value, label);
      }, 5000);
    };

    const hideLoadingGif = (label) => {
      // const extlabel = `${label}${timestamp()}`
      loadingGifStack.value = removeItem(loadingGifStack.value, label);
      emitter.emit('loadingGifStackChange', loadingGifStack.value);
    };

    /** Remove all loadingGifs (used in case of errors) */
    const clearLoadingGif = () => {
      loadingGifStack.value = [];
    };


    /* NOTIFICATIONS 
  -------------------------*/
    const showNotification = (banner: INotificationBanner): void => {
      if (banner.settimer) {
        setTimeout(() => {
          notificationBanner.value = undefined;
          emitter.emit('notificationBannerChange', notificationBanner.value);
        }, 5000);
      }
      if (banner.type === 'error') {
        clearLoadingGif();
      }
      notificationBanner.value = banner;
      emitter.emit('notificationBannerChange', notificationBanner.value);
    };

    const showAuthorizationError = (
      config: INotificationConfig | null = null
    ) => {
      const banner = {
        type: 'error',
        icon: 'mdi-key-outline',
        title: t('app.error.authorization_error_title'),
        body: t('app.error.authorization_error_body'),
        buttons: ['home'],
        settimer: config?.settimer ? true : false,
      };

      monitorLog(constants.MONITOR_ERROR_AUTHORIZATION, banner);
      showNotification(banner);
    };

    const showServiceError = (
      config: INotificationConfig | undefined = undefined
    ) => {
      const banner = {
        type: 'error',
        icon: 'mdi-alarm-light-outline',
        title: t('app.error.service_error_title'),
        body: t('app.error.service_error_body'),
        buttons: config?.nobuttons ? ['hide'] : ['reload'],
        settimer: config?.settimer ? true : false,
      };

      monitorLog(constants.MONITOR_ERROR_SERVICE, banner);
      showNotification(banner);
    };

    const showNetworkError = (config: INotificationConfig | null = null) => {
      const banner = {
        type: 'error',
        icon: 'mdi-alarm-light-outline',
        title: t('app.error.network_error_title'),
        body: t('app.error.network_error_body'),
        buttons: ['reload', 'hide'],
        settimer: config?.settimer ? true : false,
      };

      monitorLog(constants.MONITOR_ERROR_NETWORK, banner);
      showNotification(banner);
    };

    const showAuthorizationInvalidToken = (
      config: INotificationConfig | null = null
    ) => {
      const banner = {
        type: 'error',
        icon: 'mdi-key-outline',
        title: t('auth.authentication_invalid_warning_title'),
        body: t('auth.authentication_invalid_warning_body'),
        buttons: ['auth', 'home'],
        settimer: config?.settimer ? true : false,
      };
      monitorLog(constants.MONITOR_ERROR_INVALID_TOKEN, banner);
      showNotification(banner);
      //       setBrokenSession()
      logout(null, {}, true);
    };

    const showTooManyRequestsError = (
      config: INotificationConfig | null = null
    ) => {
      const banner = {
        type: 'error',
        icon: 'mdi-car-multiple',
        title: t('app.error.toomanyrequests_error_title'),
        body: t('app.error.toomanyrequests_error_body'),
        settimer: config?.settimer ? true : false,
      };
      monitorLog(constants.MONITOR_ERROR_TOO_MANY_REQUESTS, banner);
      showNotification(banner);
    };

    const showAuthenticationWarning = (
      config: INotificationConfig | null = null
    ) => {
      const banner = {
        type: 'warning',
        icon: 'mdi-emoticon-cool-outline',
        title: t('auth.authentication_warning_title'),
        body: t('auth.authentication_warning_body'),
        buttons: ['auth', 'home'],
        settimer: config?.settimer ? true : false,
      };

      monitorLog(constants.MONITOR_WARNING_AUTHENTICATION, banner);
      showNotification(banner);
    };

    const showAuthenticationError = (
      config: INotificationConfig | null = null
    ) => {
      const banner = {
        type: 'error',
        icon: 'mdi-alarm-light-outline',
        title: t('auth.authentication_error_title'),
        body: t('auth.authentication_error_body'),
        settimer: config?.settimer ? true : false,
      };

      monitorLog(constants.MONITOR_ERROR_AUTHENTICATION, banner);
      showNotification(banner);
    };

    const apireset = (full: boolean) => {
      // TESTING: reset user data of the day or the full assembly session...
      if (is_in_testing_phase.value) {
        store.dispatch('appstore/monitorReset', { notifyBackend: true, full });
        setTimeout(() => {
          logout();
        }, 10);
      }
    };

    // const appExitState = () => {
    //     return appExitState.value
    // },

    const initialize = () => {
      console.log('DEBUG: INITIALIZE APP.COMPO');
      // FIRST: install plugins
      // installedAssemblyPlugins
      // assemblyComposable.installAssemblyPlugin('CIR')

      authInitialize();
      // START MONITOR ENGINE
      monitorInitialize();
      // START ASSEMBLY ENGINE
      assemblyInitialize();
      // LISTENING ON ERRORS
      emitter.on('showNetworkError', () => {
        showNetworkError();
      });
      emitter.on(
        'showServiceError',
        (options: undefined | INotificationConfig = undefined) => {
          showServiceError(options);
        }
      );
      emitter.on('showAuthorizationError', () => {
        showAuthorizationError();
      });
      emitter.on('showTooManyRequestsError', () => {
        showTooManyRequestsError();
      });
      emitter.on('showAuthenticationWarning', () => {
        showAuthenticationWarning();
      });
      // emitter.on('showServiceError', () => {
      //   showServiceError();
      // });

      emitter.on('receiveBackendFeedback', async (data: any) => {
        // RECEIVE MESSAGES FROM FROMBACKEND
        console.log('RESPONSE MONITORED');

        // Shortcuts
        if (!data.ok) {
          return null;
        }
        if (logoutState.value) {
          console.log(
            'LOGOUT PROCESS IS GOING ON: DO NOT PROCESS NEW INCOMING DATA.'
          );
          return;
        }

        // Errors
        if (data.response.errors?.length) {
          data.response.errors.forEach((error) => {
            console.error(error.message, error.event);
          });
          const message = 'Die Datenübermittlung ist beeinträchtigt.';
          $q.notify({ type: 'nFabrikWarning', message });
        }

        // Warnings
        if (data.response.warnings?.length) {
          const displayedWarning: string[] = [];
          data.response.warnings.forEach((warning) => {
            // show only one warning at the time...
            const warnignLabel = warning.event?.eventString;
            if (!warnignLabel || displayedWarning.includes(warnignLabel)) {
              return;
            }
            displayedWarning.push(warnignLabel);
            let message = warning.message;
            if (message in constants.MONITOR_WARNING_MESSAGES) {
              message = constants.MONITOR_WARNING_MESSAGES[message];
            }
            $q.notify({ type: 'nFabrikWarning', message });
          });
        }

        // // Update transmitted Data...
        if (authorized.value && !logoutState.value) {
          // Write newest data to the store!
          store.dispatch('appstore/updateStore', { data: data.response });
          // see if there are new notifications...
          store.dispatch('profilestore/checkToUpdateNotifications');
        }
      });

      /* Reset Notifications when routing...Ensure that all (error) messages disappear, when route changes.. */
      watch(currentRoute, () => {
        console.log('WATCHER in CURRENT ROUTE (APP)', 'syncAssembliesSync');
        notificationBanner.value = undefined;
        setLastRoute(currentRoute);
        // currentRoute.fullPath

        // TODO: should we log each route?
        // store.dispatch('assemblystore/monitor_route_changes', { to, from })

        if (currentRoute.params?.assemblyIdentifier) {
          // UPDATE CURRENT ASSEMBLY...
          // TODO: redirect to Home, when assembly is invalid
          if (
            currentRoute.params?.assemblyIdentifier != assemblyIdentifier.value
          ) {
            setAssemblyIdentifier(
              currentRoute?.params?.assemblyIdentifier as string | null
            );
            syncUserAssembly();
          }

          // UPDATE STAGES...
          // TODO: redirect to asembly home, when stage is invalid
          if (
            currentRoute.params?.stageID !== null &&
            currentRoute.params?.stageID !== undefined &&
            currentRoute.params?.stageID !== `${stageID.value}`
          ) {
            setStageID(parseInt(currentRoute.params.stageID as string));
            emitter.emit('showLoading');
          }
        }
      });
    };
    

    return {
      appExitState: readonly(appExitState),
      headerOffset: readonly(headerOffset),
      instanceNr: readonly(instanceNr),
      // scrollToAnchorIfNecessary,
      // scrollToAnchor,
      showAuthenticationError,
      showServiceError,
      showAuthenticationWarning,
      showNetworkError,
      showTooManyRequestsError,
      showAuthorizationInvalidToken,
      showAuthorizationError,
      exitApp,
      apireset,
      initialize,
      setHeaderOffset,
      hideLoadingGif,
      showLoadingGif,
    };
  };

  if (output === null) {
    output = setup();
  }

  return output;
}

// RESET LAYOUT
//   computed: {
//     ready() {
//       // Can be overwritten by child components.
//       this.$emitter.emit('hideLoading')
//       return true;
//     },
//     this.$emitter.on('hideNotificationBanners', data => {
//       this.$refs?.maincontent?.hideNotificationBanner();
//     })
//     // to enforce reload of page container!
//     this.$root.reload = () => { this.componentKey += 1 }
//     this.$root.initialized = false

// EXIT APP
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
