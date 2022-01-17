/** DEMOKRATIFABRIK RUNTIME VARIABLES */
// import { watch, ref, readonly } from 'vue';
import { useRoute} from 'vue-router';
// import { useI18n } from 'vue-i18n';
// import useLibraryComposable from 'src/utils/library'
// import useEmitter from 'src/utils/emitter';
import { useStore } from 'vuex';
import constants from 'src/utils/constants';
import useAssemblyComposable from './assembly.composable';
import usePKCEComposable from 'src/plugins/VueOAuth2PKCE/pkce.composable';


export default function useMonitorComposable() {

  const currentRoute = useRoute()
  // const router = useRoute()
  const store = useStore()
  const assemblyComposable = useAssemblyComposable()
  const { authorized } = usePKCEComposable()


    const monitorLog = async (eventString: string | null = null, data: Record<string, unknown> = {}) => {
      if (!authorized) {
        return (null)
      }
      if (eventString === constants.MONITOR_ROUTE_CHANGE) {
        data.extra = { 'name': currentRoute.name }
      }
      data = { name: currentRoute.name, ...currentRoute.params, ...data }
      if (assemblyComposable.assemblyIdentifier.value && !data.assemblyIdentifier) {
        data.assemblyIdentifier = assemblyComposable.assemblyIdentifier.value
      }
      store.dispatch('monitorLog', {
        eventString,
        data
      })
    }

    const monitorFire = async (eventString: string | null = null, extra = {}, onlyWhenTokenValid = false) => {
      if (!authorized) {
        return (null)
      }
      const data: Record<string, unknown> = { name: currentRoute.name, ...currentRoute.params, ...extra }
      if (assemblyComposable.assemblyIdentifier.value && !data.assemblyIdentifier) {
        data.assemblyIdentifier = assemblyComposable.assemblyIdentifier.value
      }
      await store.dispatch('monitorFire', {
        eventString,
        data,
        onlyWhenTokenValid
      })
    }

  return {
    monitorLog,
    monitorFire
  };
}