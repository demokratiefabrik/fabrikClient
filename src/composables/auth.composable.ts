/** DEMOKRATIFABRIK RUNTIME VARIABLES */
import { ref, readonly, getCurrentInstance } from 'vue'
import Constants from 'src/utils/constants'
import usePKCEComposable from 'src/plugins/VueOAuth2PKCE/pkce.composable';

const pkce = usePKCEComposable();

const brokenSession = ref<boolean>(false);
const logoutState = ref<boolean>(false);

// export default {
export default function useAuthComposable() {
  // setup() {

  const internalInstance = getCurrentInstance(); 
  const i18n = internalInstance?.appContext.config.globalProperties.$i18n;
  const store = internalInstance?.appContext.config.globalProperties.store;

  // Session / PROFILE METHODS
  const setBrokenSession = (state: boolean) => (brokenSession.value = state);
  const setLogoutState = (state: boolean) => (logoutState.value = state);
  const username = (profile) => profile ? profile.U : 'Anonymous';;

  const logout = async (eventString: string | null = null, extra = {}, silent=false) => {

      console.log(
        extra,
        eventString,
        '$root.logout call => fire monitor buffer with logout entry. SILENT:',
        silent
      ),
        await store.dispatch('monitorFire', {
          eventString: Constants.MONITOR_LOGOUT,
          data: {},
          onlyWhenTokenValid: true,
        });

      setLogoutState(false);

      console.log(
        'await monitorFire ended => call oauth logout function. SILENT:',
        silent
      );
      
      pkce.logout(silent);
  }

  const username_derivation = (profile, shortversion = false, thirdPerson = true) => {
    if (!profile) {return '';}
    
    const altitude = profile.ALT;
    const fullname = profile.FN;
    const canton = profile.CA;

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

  // const items = computed(() => store.state.items);
  return {
    brokenSession: readonly(brokenSession),
    logoutState: readonly(logoutState),
    setBrokenSession,
    setLogoutState,
    username_derivation,
    username,
    logout,
    refresh_token_if_required: pkce.refresh_token_if_required,
    authorized: pkce.authorized,
    jwt: pkce.jwt,
    payload: pkce.payload,
    userid: pkce.userid
  };
  // },
}
