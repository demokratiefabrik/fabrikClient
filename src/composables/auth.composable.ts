/** DEMOKRATIFABRIK RUNTIME VARIABLES */
import { ref, readonly, getCurrentInstance, computed } from 'vue';
import Constants from 'src/utils/constants';
import usePKCEComposable, {
  IPayload,
} from 'src/plugins/VueOAuth2PKCE/pkce.composable';
import { useStore } from 'vuex';
import useEmitter from 'src/utils/emitter';
import { useRouter, useRoute } from 'vue-router';
// import { useRoute} from 'vue-router';
// import useRouterComposable from './router.composable';

// import useOAuthEmitter from 'src/plugins/VueOAuth2PKCE/oauthEmitter';

// import {useStore} from 'vuex';
//   // const store = useStore()
//   // await store.dispatch('appstore/monitorFire', {

const pkce = usePKCEComposable();
const logoutState = ref<boolean>(false);
const emailIsAvailable = ref<boolean>(false);
const emitter = useEmitter();

// const oauthEmitter = useOAuthEmitter();
// import {
//   useRouter,
// } from 'vue-router';

// export default {
export default function useAuthComposable() {
  // console.log('DEBUG: AUTH COMPOSABLE - START');
  const router = useRouter();
  const currentRoute = useRoute();

  // Session / PROFILE METHODS
  const setLogoutState = (state: boolean) => (logoutState.value = state);
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
    const internalInstance = getCurrentInstance();
    const i18n = internalInstance?.appContext.config.globalProperties.$i18n;

    if (thirdPerson) {
      return i18n.t(
        `auth.name_derivation_3rd_party${shortversion ? '_short' : ''}`,
        {
          fullname: fullname,
          canton: canton,
          altitude: altitude,
        }
      );
    } else {
      return i18n.t('auth.name_derivation', {
        fullname: fullname,
        canton: canton,
        altitude: altitude,
      });
    }
  };

  // const currentUsername = computed(() => {
  //   return getUsername()
  // });

  const initialize = async (): Promise<void> => {
    console.log('*** INIT OAUTH ***');
    try {
      return await pkce.initialize();
    } catch (error) {
      console.log('error in oauth initialization...', error);
      switch ((error as any).message) {
        case 'ErrorInvalidGrant':
          emitter.emit('showAuthorizationInvalidToken');
          break;
        default:
          console.error(error);
          emitter.emit('showServiceError', { nobuttons: true });
          break;
      }
      // end mounting...
    }
  };
  // # SETUP WATCHER
  // WATCH ROUTER => Check Permissions

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

    setLogoutState(false);

    const store = useStore();
    await store.dispatch('appstore/monitorFire', {
      eventString: Constants.MONITOR_LOGOUT,
      data: {},
      onlyWhenTokenValid: true,
    });

    pkce.logout(silent);
  };

  const loginToCurrentPage = (): void => {
    const destination_route = { name: currentRoute.name, params: currentRoute.params };      
    pkce.login(destination_route);
  };

  const markEmailAsAvailable = (): void => {
    emailIsAvailable.value = true;
  };

  const payload = computed(() => {
    // set userEmail<boolean> = true, if email has been added shortly
    const payload = pkce.payload.value as IPayload;
    if (emailIsAvailable.value) {
      payload.userEmail = true;
    }
    return payload;
  });

  /* Page Permission */
  const checkPagePermission = (currentRoute): void => {
    // check permission: allow for all general pages.
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
      router.push({ name: 'home' });
      throw new Error("Oops! You don't seem to have access to that page.");
    }

    // find first permission that is allowed.
    const allowed = currentRoute.meta.assemblyAcl.find((assemblyAcl) => {
      const role = `${assemblyAcl}@${currentRoute.params.assemblyIdentifier}`;
      return payload.value.roles.includes(role);
    });
    if (!allowed) {
      router.push({ name: 'home' });
      throw new Error("Oops! You don't seem to have access to that page.");
    }
  };

  // console.log('DEBUG @@ auth composable end')
  return {
    initialize,

    // TODO: needed?
    logoutState: readonly(logoutState),
    setLogoutState,
    logout,
    loginToCurrentPage,

    checkPagePermission,
    getUsernameDerivation,
    getUsername,
    // currentUsername,
    // currentUsernameDerivation,
    markEmailAsAvailable,
    // login: pkce.login,

    // PKCE
    refresh_token_if_required: pkce.refresh_token_if_required,
    authorized: readonly(pkce.authorized),
    jwt: readonly(pkce.jwt),
    payload: readonly(payload),
    userid: readonly(pkce.userid),

  };
}
