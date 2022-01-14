/** DEMOKRATIFABRIK RUNTIME VARIABLES */
import { ref, readonly, getCurrentInstance, computed } from 'vue';
import Constants from 'src/utils/constants';
import usePKCEComposable, { IPayload } from 'src/plugins/VueOAuth2PKCE/pkce.composable';
import { useStore } from 'vuex';
import useEmitter from 'src/utils/emitter';
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
  console.log('DEBUG: AUTH COMPOSABLE - START');

  // Session / PROFILE METHODS
  const setLogoutState = (state: boolean) => (logoutState.value = state);
  const username = (profile) => (profile ? profile.U : 'Anonymous');

  const initialize = async (): Promise<void> => {

    console.log('*** INIT OAUTH ***')
    try {
      return await pkce.initialize()
    } catch (error) {
      console.log('error in oauth initialization...', error)
      switch ((error as any).message) {
        case 'ErrorInvalidGrant':
          emitter.emit('showAuthorizationInvalidToken')
          break;
        default:
          console.error(error)
          emitter.emit('showServiceError', { nobuttons: true })
          break;
      }
      // end mounting...
    }
  }

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

  const markEmailAsAvailable = (): void => {
    emailIsAvailable.value = true
  };
  
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

  // set userEmail<boolean> = true, if email has been added recently...
  const editedPayload = pkce.payload.value as IPayload

    
  const payload = computed(() => {
    const payload = pkce.payload.value as IPayload
    if (emailIsAvailable.value){
      editedPayload.userEmail = true;
    }
    return payload
  });


  // console.log('DEBUG @@ auth composable end')
  return {
    logoutState: readonly(logoutState),
    authorized: readonly(pkce.authorized),
    jwt: readonly(pkce.jwt),
    payload: readonly(payload),
    userid: readonly(pkce.userid),
    setLogoutState,
    getUsernameDerivation,
    username,
    markEmailAsAvailable,
    initialize,
    logout,
    login: pkce.login,
    refresh_token_if_required: pkce.refresh_token_if_required,
  };
}
