/** DEMOKRATIFABRIK RUNTIME VARIABLES */
import { ref, readonly, getCurrentInstance } from 'vue'

const stageID = ref<number | null>(null);
const assemblyIdentifier = ref<string | null>(null);
const appExitState = ref<boolean>(false);
const brokenSession = ref<boolean>(false);
const logoutState = ref<boolean>(false);
const headerOffset = ref<number>(150);

// export default {
export default function useAppComposable() {
  // setup() {

  const internalInstance = getCurrentInstance(); 
  const i18n = internalInstance?.appContext.config.globalProperties.$i18n;

  const exitApp = () => (appExitState.value = true);
  const setStageID = (id: number | null) => (stageID.value = id);
  const setAssemblyIdentifier = (identifier: string | null) =>
    (assemblyIdentifier.value = identifier);

  // Layout
  // TODO: is this still used?
  const setHeaderOffset = (offset: number) => (headerOffset.value = offset);

  // Session / PROFILE METHODS
  const setBrokenSession = (state: boolean) => (brokenSession.value = state);
  const setLogoutState = (state: boolean) => (logoutState.value = state);
  const username = (profile) => profile ? profile.U : 'Anonymous';;

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
    stageID: readonly(stageID),
    assemblyIdentifier: readonly(assemblyIdentifier),
    appExitState: readonly(appExitState),
    brokenSession: readonly(brokenSession),
    logoutState: readonly(logoutState),
    headerOffset: readonly(headerOffset),
    exitApp,
    setStageID,
    setBrokenSession,
    setAssemblyIdentifier,
    setLogoutState,
    username_derivation,
    username,
    setHeaderOffset
  };
  // },
}
