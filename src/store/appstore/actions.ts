import api from 'src/utils/api';
import useEmitter from 'src/utils/emitter';
import { date } from 'quasar'
const { getDateDiff } = date
const emitter = useEmitter()

export const clearUserData = ({ dispatch, commit }) => {
  /* resets the counter to zero */
  dispatch('monitorExit');
  dispatch('profilestore/deletePublicProfile', { commit });
  dispatch('contentstore/deleteContentStore', { commit });
  console.log('delete peerreviews...');
  dispatch('peerreviewstore/deletePeerreviewStore', { commit });
  dispatch('assemblystore/deleteAssemblyStore', { commit });
};

export const monitorSetup = ({ commit }) => {
  /* resets the counter to zero */
  commit('monitorSetup');
  console.log('/setup ');
};

export const monitorExit = ({ commit }) => {
  /* resets the counter to zero */
  commit('monitor_reset', {});
  const now = null;
  commit('monitor_update_date', { now });
};

export const monitorReset = ({ commit }) => {
  /* resets the counter to zero */
  console.log('API Monitored. => Clear Buffer');
  commit('monitor_reset', {});
};

/** Fire events - in any cases */
export const monitorFire = (
  { state, commit },
  { eventString, data, onlyWhenTokenValid }
) => {

  // add newest event to the event buffer
  if (eventString) {
    // empty event is possible => only send buffered events to api (if time is ready)
    commit('monitor_add', { eventString, data });
  }

  if (!state.monitor_buffer || state.monitor_buffer.length == 0) {
    return null;
  }

  // update last-update date;-)
  const now = new Date();
  commit('monitor_update_date', { now });
  const previous_buffer = [...state.monitor_buffer];
  commit('monitor_reset', { now });
  api.monitorActivities(previous_buffer, onlyWhenTokenValid).then((data) => {
    emitter.emit('receiveBackendFeedback', data)
  })
};

/* monitor request in any case.. */
export const monitorLog = (
  { state, dispatch, commit },
  { eventString, data }
) => {
  // console.log(".", eventString)

  // add newest event to the event buffer
  if (eventString) {
    // Does exactly the same log already exists in the buffer?
    // let existingLogs = !!state.monitor_buffer?.length
    // const datavals = Object.entries(data)
    // existingLogs = existingLogs && !state.monitor_buffer.find(x => x.eventString === eventString && !datavals.find((k, v) => x.data[k] !== v))
    // if (!existingLogs) {
    //   // console.log("Log ignored, because already in the buffer")
    // } else {
    commit('monitor_add', { eventString, data });
    // }
  }
  if (!state.monitor_buffer || state.monitor_buffer.length == 0) {
    return null;
  }

  // Check if intervall is passed => so buffer events are fiired!
  // console.log("/t")
  const now = Date.now();
  const diff = getDateDiff(now, state.monitor_date, 'seconds')
  const configInterval = parseInt(process.env.ENV_APISERVER_MONITOR_INTERVAL_SECONDS as string) * 2
  if (diff < configInterval) {
    return null;
  }

  // manually fiire the monitor log
  data = {};
  eventString = null;
  dispatch('monitorFire', { eventString, data });
};

/* monitor request in any case.. */
export const updateStore = ({ dispatch, commit }, { data }) => {
  // console.log(".", data)

  if ('assemblies' in data) {
    Object.keys(data.assemblies).map((assemblyIdentifier) => {
      const container = data.assemblies[assemblyIdentifier];
      if ('assembly' in container) {
        const assembly = container.assembly;
        commit('assemblystore/storeAssemblyObject', {
          assemblyIdentifier,
          assembly,
        });
      }
      if ('progression' in container) {
        const progression = container.progression;
        commit('assemblystore/storeAssemblyProgression', {
          assemblyIdentifier,
          progression,
        });
      }
    });

    if ('stages' in data) {
      Object.keys(data.stages).map((stageID) => {
        const container = data.stages[stageID];
        if ('stage' in container) {
          const stage = container.stage;
          commit('assemblystore/storeStageObject', { stageID, stage });
        }
        if ('progression' in container) {
          const progression = container.progression;
          commit('assemblystore/storeStageProgression', {
            stageID,
            progression,
          });
        }
      });
    }

    if ('contents' in data) {
      console.log('RETRIEVED MODIFIED CONTENTS', data.contents);
      dispatch('contentstore/update_contents', {
        modifiedContents: data.contents,
      });
    }

    if ('peerreviews' in data) {
      console.log('RETRIEVED MODIFIED PEERREVIEWS', data.peerreviews);
      dispatch('peerreviewstore/updatePeerreviewTuples', {
        modifiedPeerreviews: data.peerreviews,
      });
    }

    if ('notifications' in data) {
      console.log('RETRIEVED NOTIFICATIONS', data.peerreviews);
      commit('profilestore/update_notifications', {
        notifications: data.notifications,
      });
    }
  }
};
