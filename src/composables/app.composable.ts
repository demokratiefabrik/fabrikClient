/** DEMOKRATIFABRIK RUNTIME VARIABLES */
import { watch, ref, readonly } from 'vue';
import { RouteRecordRaw, LocationAsRelativeRaw, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import useLibraryComposable from 'src/utils/library';
import useEmitter from 'src/utils/emitter';
import useAssemblyComposable from './assembly.composable';
import useRouterComposable from './router.composable';
import useAuthComposable from './auth.composable';
import useMonitorComposable from './monitor.composable';
import constants from 'src/utils/constants';
import { scroll, useQuasar } from 'quasar';
const { setVerticalScrollPosition } = scroll;
import { dom } from 'quasar';
import { useStore } from 'vuex';
const { offset } = dom;

const { removeItem } = useLibraryComposable();
const headerOffset = ref<number>(150); // default header is minimized within assembly sections
const setHeaderOffset = (offset: number) => (headerOffset.value = offset);
const fixedSelectedItem = ref<HTMLElement | null>(null); // Fixed Element (TODO: describe better what this is for!)

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
  redirectRoute?: RouteRecordRaw | LocationAsRelativeRaw;
}

// APP State
const stageID = ref<number | null>(null);
const appExitState = ref<boolean>(false);
const emitter = useEmitter();

// Notifications
const notificationBanner = ref<INotificationBanner | null>(null);
const loadingGifStack = ref<string[]>([]);

export default function useAppComposable() {
  // console.log('DEBUG: APP COMPOSABLE - START');

  const assemblyComposable = useAssemblyComposable();
  const authComposable = useAuthComposable();
  const monitorComposable = useMonitorComposable();
  const routerComposable = useRouterComposable();
  const currentRoute = useRoute();
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

  /* SCROLLING */
  // ----------------------
  const getOffsetTop = (element) => {
    let offsetTop = 0;
    while (element) {
      offsetTop += element.offsetTop;
      element = element.offsetParent;
    }
    return offsetTop;
  };

  const scrollToAnchor = (anchor, duration = 300, lag = 0) => {
    const dom = document.getElementsByName(anchor);
    const ele = dom?.item(0);
    const scrollFnc = () => {
      fixedSelectedItem.value = anchor;
      const elOffset = getOffsetTop(ele) - headerOffset.value;
      setVerticalScrollPosition(window, elOffset, duration);
      setTimeout(() => (fixedSelectedItem.value = null), duration);
    };
    if (lag) {
      setTimeout(scrollFnc, lag);
    } else {
      scrollFnc();
    }
  };
  const scrollToAnchorIfNecessary = (anchor, duration = 300, lag = 0) => {
    const dom = document.getElementsByName(anchor);
    const ele = dom?.item(0);
    if (offset(ele).top < 50) {
      scrollToAnchor(anchor, duration, lag);
    }
  };
  /* Scroll To #Anchor */
  // NOT USED
  // const anchor = (anchor: string) => {
  //   // scroll to element
  //   const el = document.querySelector(`a[name=${anchor}]`);
  //   el && el.scrollIntoView();

  //   // account for fixed header
  //   const headerHeight = 200;
  //   const scrolledY = window.scrollY;
  //   if (scrolledY) {
  //     window.scroll(0, scrolledY - headerHeight);
  //   }
  // };

  /* NOTIFICATIONS 
  -------------------------*/
  const showNotification = (banner: INotificationBanner): void => {
    if (banner.settimer) {
      setTimeout(() => {
        notificationBanner.value = null;
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

    monitorComposable.monitorLog(constants.MONITOR_ERROR_AUTHORIZATION, banner);
    showNotification(banner);
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

    monitorComposable.monitorLog(constants.MONITOR_ERROR_SERVICE, banner);
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

    monitorComposable.monitorLog(constants.MONITOR_ERROR_NETWORK, banner);
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
    monitorComposable.monitorLog(constants.MONITOR_ERROR_INVALID_TOKEN, banner);
    showNotification(banner);
    //       setBrokenSession()
    authComposable.logout(null, {}, true);
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
    monitorComposable.monitorLog(
      constants.MONITOR_ERROR_TOO_MANY_REQUESTS,
      banner
    );
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

    monitorComposable.monitorLog(
      constants.MONITOR_WARNING_AUTHENTICATION,
      banner
    );
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

    monitorComposable.monitorLog(
      constants.MONITOR_ERROR_AUTHENTICATION,
      banner
    );
    showNotification(banner);
  };

  // const appExitState = () => {
  //     return appExitState.value
  // },

  const initialize = () => {
    authComposable.initialize();
    // START MONITOR ENGINE
    monitorComposable.initialize();
    // START ASSEMBLY ENGINE
    assemblyComposable.initialize();
    // LISTENING ON ERRORS
    emitter.on('showNetworkError', () => {
      showNetworkError();
    });
    emitter.on('showServiceError', () => {
      showServiceError();
    });
    emitter.on('showAuthorizationError', () => {
      showAuthorizationError();
    });
    emitter.on('showTooManyRequestsError', () => {
      showTooManyRequestsError();
    });
    emitter.on('showAuthenticationWarning', () => {
      showAuthenticationWarning();
    });
    emitter.on('showServiceError', () => {
      showServiceError();
    });

    emitter.on('receiveBackendFeedback', async (data: any) => {
      // RECEIVE MESSAGES FROM FROMBACKEND
      console.log('RESPONSE MONITORED');

      // Shortcuts
      const $q = useQuasar();
      if (!data.ok) {
        return null;
      }
      const { logoutState, authorized } = useAuthComposable();
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
        const store = useStore();
        // Write newest data to the store!
        store.dispatch('appstore/updateStore', { data: data.response });
        // see if there are new notifications...
        store.dispatch('profilestore/checkToUpdateNotifications');
      }
    });

    /* Reset Notifications when routing...Ensure that all (error) messages disappear, when route changes.. */
    watch(currentRoute, () => {
      notificationBanner.value = null;
    });
  };

  return {
    stageID: readonly(stageID),
    appExitState: readonly(appExitState),
    headerOffset: readonly(headerOffset),
    scrollToAnchorIfNecessary,
    scrollToAnchor,
    showAuthenticationError,
    showServiceError,
    showAuthenticationWarning,
    showNetworkError,
    showTooManyRequestsError,
    showAuthorizationInvalidToken,
    showAuthorizationError,
    exitApp,
    initialize,
    setHeaderOffset,
    hideLoadingGif,
    showLoadingGif,
    instanceNr: routerComposable.instanceNr,
  };
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
