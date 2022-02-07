/** DEMOKRATIFABRIK RUNTIME VARIABLES */
import { ref, readonly, computed } from 'vue';
import Constants from 'src/utils/constants';
import usePKCEComposable from 'src/plugins/VueOAuth2PKCE/pkce.composable';
import { useStore } from 'vuex';
import useEmitter from 'src/utils/emitter';
import { useRouter, useRoute } from 'vue-router';
import useOAuthEmitter from 'src/plugins/VueOAuth2PKCE/oauthEmitter';
import useRouterComposable from './router.composable';
import useMonitorComposable from './monitor.composable';
import constants from 'src/utils/constants';
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';

const pkce = usePKCEComposable();
const logoutState = ref<boolean>(false);
const _emailIsAvailable = ref<boolean>(false);
const emitter = useEmitter();
const oauthEmitter = useOAuthEmitter();

let output: null | any = null;

export default function useAuthComposable() {
  const setup = () => {
    console.log('DEBUG: useAuthComposable::SETUP');

    const router = useRouter();
    const currentRoute = useRoute();
    const { pushR, gotoHome } = useRouterComposable();
    const monitorComposable = useMonitorComposable();
    const store = useStore();
    const { t } = useI18n();
    // -------

    const initialize = async (): Promise<void> => {
      console.log('*** INIT OAUTH ***');

      oauthEmitter.on('AfterLogin', () => {
        loadProfile();
        afterLogin();
      });
      oauthEmitter.on('RecycleLogin', () => {
        loadProfile();
      });

      addRoutePermisionWatcher();
      const response = await pkce.initialize();
      return response;
    };
    // oauthAcls
    const afterLogin = () => {
      // console.log('AFTER LOGIN, OAUTH EMITTER')

      // Notify Backend
      store.dispatch('appstore/monitorSetup');
      monitorComposable.monitorLog(constants.MONITOR_LOGIN);
      monitorComposable.monitorContextData();

      // CHECK FOR REDIRECTION URL in local storage (During Login)
      const desitionationRouteJson = localStorage.getItem(
        'oauth2authcodepkce-destination'
      );
      if (desitionationRouteJson) {
        const destination_route = JSON.parse(desitionationRouteJson);
        if (destination_route) {
          localStorage.removeItem('oauth2authcodepkce-destination');
          pushR(destination_route);
          return;
        }
      }
      gotoHome();
      setLogoutState(false);
    };
    // -------

    // PKCE METHODS
    // ------------------------
    const setLogoutState = (state: boolean) => (logoutState.value = state);
    const logout = async (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _eventString: string | null = null,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _extra = {},
      silent = false
    ) => {
      console.log(
        'await monitorFire ended => call oauth logout function. SILENT:',
        silent
      );

      setLogoutState(true);

      await store.dispatch('appstore/monitorFire', {
        eventString: Constants.MONITOR_LOGOUT,
        data: {},
        onlyWhenTokenValid: true,
      });

      // clear user data...
      store.dispatch('appstore/clearUserData');

      // logout pkce
      pkce.logout(silent);
    };

    const loginToCurrentPage = (): void => {
      const destination_route = {
        name: currentRoute.name,
        params: currentRoute.params,
      };
      pkce.login(destination_route);
    };

    // const payload = computed(() => {
    //   // set userEmail<boolean> = true, if email has been added shortly
    //   const payload = pkce.payload.value as IPayload;
    //   if (emailIsAvailable.value) {
    //     payload.userEmail = true;
    //   }
    //   return payload;
    // });

    const currentUsernameDerivation = computed(() => {
      return getUsernameDerivation(profile);
    });

    const currentUsername = computed(() => {
      return getUsername(profile);
    });

    const is_in_testing_phase = computed(
      () => store.getters['profilestore/is_in_testing_phase']
    );

    /* Page Permission */
    const checkPagePermission = (currentRoute): void => {
      // allow for all general pages.
      if (!currentRoute.meta.assemblyAcl) {
        return;
      }

      // enforce Array format
      if (!Array.isArray(currentRoute.meta.assemblyAcl)) {
        currentRoute.meta.assemblyAcl = [currentRoute.meta.assemblyAcl];
      }

      // Wrongly configured....
      if (!currentRoute.params.assemblyIdentifier) {
        console.error('assemblyIdentifier is missing in the route params');
        throw new Error('MISCONFIGURATION');
      }

      // All other pages require login
      if (!pkce.payload.value) {
        // NOt logged in
        throw new Error('LOGIN_REQUIRED');
      }

      // find first permission that is allowed.
      const allowed = currentRoute.meta.assemblyAcl.find((assemblyAcl) => {
        const role = `${assemblyAcl}@${currentRoute.params.assemblyIdentifier}`;
        return pkce.payload.value.roles.includes(role);
      });
      if (!allowed) {
        router.push({ name: 'home' });
        throw new Error('AUTHORIZATION_FAILED');
      }
    };

    const addRoutePermisionWatcher = async () => {
      // try {
      watch(
        () => currentRoute,
        (currentRoute) => {
          // Add Watcher for Authorization Check (client-side)
          try {
            checkPagePermission(currentRoute);
          } catch (error) {
            router.push({ name: 'home' });

            // Show error message...
            switch ((error as any).message) {
              case 'ErrorInvalidGrant':
                oauthEmitter.emit('showAuthorizationInvalidToken');
                break;
              default:
                console.error(error);
                emitter.emit('showServiceError', { nobuttons: true });
                break;
            }
          }
        },
        { deep: true }
      );
    };

    // -------
    // PROFILE METHODS
    // ------------------------
    const profile = computed(() => {
      return store.state.profilestore.profile.user;
    });

    const getUsername = (profile) => (profile ? profile.U : 'Anonymous');
    const getUsernameDerivation = (
      profile,
      shortversion = false,
      thirdPerson = true
    ) => {
      if (!profile) {
        return '';
      }

      const altitude = profile.ALT;
      const fullname = profile.FN;
      const canton = profile.CA;

      if (thirdPerson) {
        return t(
          `auth.name_derivation_3rd_party${shortversion ? '_short' : ''}`,
          {
            fullname: fullname,
            canton: canton,
            altitude: altitude,
          }
        );
      } else {
        return t('auth.name_derivation', {
          fullname: fullname,
          canton: canton,
          altitude: altitude,
        });
      }
    };

    const markIndicatedEmail = (): void => {
      _emailIsAvailable.value = true;
    };

    const emailIsAvailable = computed(() => {
      return _emailIsAvailable.value || !!pkce.payload.value.userEmail;
    });

    pkce.payload.value;

    const loadProfile = async () => {
      store.dispatch('profilestore/touchRandomSeed');

      // SYNC USER PROFILE
      if (pkce.userid.value) {
        store.dispatch('profilestore/keepInSyncProfile', {
          oauthUserID: pkce.userid.value,
          // oauthUserEmail: payload.value.userEmail,
        });
      }
    };

    return {
      initialize,

      // PKCE
      logoutState: readonly(logoutState),
      setLogoutState,
      logout,
      loginToCurrentPage,
      checkPagePermission,
      refresh_token_if_required: pkce.refresh_token_if_required,
      authorized: readonly(pkce.authorized),
      jwt: readonly(pkce.jwt),
      payload: pkce.payload,
      userid: readonly(pkce.userid),

      // PROFILE
      profile,
      getUsernameDerivation,
      currentUsernameDerivation,
      currentUsername,
      getUsername,
      is_in_testing_phase,
      emailIsAvailable,
      markIndicatedEmail,
    };
  };

  if (output === null) {
    output = setup();
  }

  return output;
}

//   if (output.value === null) {
//     output.value = setup();
//   }

//   return output.value;
// }
