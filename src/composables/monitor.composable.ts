import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import constants from 'src/utils/constants';
import useAssemblyComposable from './assembly.composable';
import usePKCEComposable from 'src/plugins/VueOAuth2PKCE/pkce.composable';
import { useQuasar } from 'quasar';

export default function useMonitorComposable() {
  console.log('DEBUG: useMonitorComposable::SETUP')
  const currentRoute = useRoute();
  const store = useStore();
  const assemblyComposable = useAssemblyComposable('monitor.comp');
  const { authorized } = usePKCEComposable();
  const $q = useQuasar();
  // ---------

  const initialize = () => {
    // Start periodic monitorLog Trigger
    // keep this interval low (much lower than the intervall number specified in env. files)
    // (e.g. 1 Min.)
    // console.log('*** START MONITOR ENGINE ***')
    const intervallString: string = process.env
      .ENV_APISERVER_MONITOR_INTERVAL_SECONDS
      ? process.env.ENV_APISERVER_MONITOR_INTERVAL_SECONDS
      : '60';
    const intervall = parseInt(intervallString);
    setInterval(() => {
      monitorFire();
    }, intervall * 1000);
  };

  // ---------
  const monitorLog = async (
    eventString: string | null = null,
    data: Record<string, unknown> = {}
  ) => {
    if (!authorized) {
      return null;
    }
    if (eventString === constants.MONITOR_ROUTE_CHANGE) {
      data.extra = { name: currentRoute.name };
    }
    data = { name: currentRoute.name, ...currentRoute.params, ...data };
    if (
      assemblyComposable.assemblyIdentifier.value &&
      !data.assemblyIdentifier
    ) {
      data.assemblyIdentifier = assemblyComposable.assemblyIdentifier.value;
    }
    store.dispatch('appstore/monitorLog', {
      eventString,
      data,
    });
  };

  const monitorFire = async (
    eventString: string | null = null,
    extra = {},
    onlyWhenTokenValid = false
  ) => {
    if (!authorized.value) {
      return null;
    }

    const data: Record<string, unknown> = {
      name: currentRoute.name,
      ...currentRoute.params,
      ...extra,
    };
    if (
      assemblyComposable.assemblyIdentifier.value &&
      !data.assemblyIdentifier
    ) {
      data.assemblyIdentifier = assemblyComposable.assemblyIdentifier.value;
    }
    await store.dispatch('appstore/monitorFire', {
      eventString,
      data,
      onlyWhenTokenValid,
    });
  };

  const monitorContextData = () => {
    //send context data
    const data: Record<string, unknown> = { extra: $q.platform.is };
    data.screenW = screen.width;
    monitorLog(constants.MONITOR_CONTEXT, data);
  };

  return {
    initialize,
    monitorLog,
    monitorFire,
    monitorContextData,
  };
}
