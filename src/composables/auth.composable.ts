/** DEMOKRATIFABRIK RUNTIME VARIABLES */
import { ref, readonly, getCurrentInstance } from 'vue';
import Constants from 'src/utils/constants';
import usePKCEComposable from 'src/plugins/VueOAuth2PKCE/pkce.composable';
import { useStore } from 'vuex';
// import {useStore} from 'vuex';
//   // const store = useStore()
//   // await store.dispatch('appstore/monitorFire', {

const pkce = usePKCEComposable();
const logoutState = ref<boolean>(false);

// export default {
export default async function useAuthComposable() {
  console.log('DEBUG: AUTH COMPOSABLE - START');

  // Session / PROFILE METHODS
  const setLogoutState = (state: boolean) => (logoutState.value = state);
  const username = (profile) => (profile ? profile.U : 'Anonymous');

  const logout = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    eventString: string | null = null,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    extra = {},
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

  console.log('auth c. end')
  return {
    logoutState: readonly(logoutState),
    authorized: readonly(pkce.authorized),
    jwt: readonly(pkce.jwt),
    payload: readonly(pkce.payload),
    userid: readonly(pkce.userid),
    setLogoutState,
    getUsernameDerivation,
    username,
    logout,
    login: pkce.login,
    refresh_token_if_required: pkce.refresh_token_if_required,
  };
}
