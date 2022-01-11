import { useQuasar } from 'quasar';
import { boot } from 'quasar/wrappers';
import useAuthComposable from 'src/composables/auth.composable';
import constants from 'src/utils/constants';
import useEmitter from 'src/utils/emitter';
import { useStore } from 'vuex';

const emitter = useEmitter();

// Anonther Boot Hook. For subscribing to events
export default boot(async ({ app }) => {
  console.log('BOOOT EVENTS', app);

  // SUBSCRIBER

  // RECEIVE MESSAGES FROM FROMBACKEND
  // TODO: write type for data
  emitter.on('receiveBackendFeedback', async (data: any) => {
    if (!data.ok) {
      return null;
    }
    console.log('RESPONSE MONITORED');
    // const appCompensable = useAppComposable();
    const { logoutState, authorized } = await useAuthComposable();
    if (logoutState) {
      console.log(
        'LOGOUT PROCESS IS GOING ON: DO NOT PROCESS NEW INCOMING DATA.'
      );
      return;
    }

    // // Some of the events could not be stored into the DB
    const $q = useQuasar()   
    if (data.response.errors?.length) {
      data.response.errors.forEach((error) => {
        console.error(error.message, error.event);
      });
      // A monitor action resolved in an error.
      const message = 'Die Datenübermittlung ist beeinträchtigt.';
      $q.notify({ type: 'nFabrikWarning', message });
    }

    if (data.response.warnings?.length) {
      const displayedWarning = ['nonsense'];
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
    if (authorized && !logoutState) {
      const store = useStore()
      // Write newest data to the store!
      store.dispatch('appstore/updateStore', { data: data.response })
      // see if there are new notifications...
      store.dispatch('profilestore/checkToUpdateNotifications')
    }

  });
});
