import api from 'src/utils/api';
import useEmitter from 'src/utils/emitter';
import { date } from 'quasar';
import { IAssemblyTupleByApi } from 'src/models/assembly';
const { getDateDiff } = date;
const emitter = useEmitter();

export const clearUserData = ({ dispatch }) => {
  /* resets the counter to zero */

  dispatch('monitorExit');
  dispatch('profilestore/deleteProfile', null, { root: true });
  dispatch('contenttreestore/deleteContentStore', null, { root: true });
  // dispatch('peerreviewstore/deletePeerreviewStore',  null,  { root: true });
  dispatch('assemblystore/deleteAssemblyStore', null, { root: true });
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

export const monitorReset = ({ commit }, {notifyBackend, full}) => {
  /* resets the counter to zero */
  if (notifyBackend) {
    api.apireset(full)
  }
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
    emitter.emit('receiveBackendFeedback', data);
  });
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
  const diff = getDateDiff(now, state.monitor_date, 'seconds');
  const configInterval =
    parseInt(process.env.ENV_APISERVER_MONITOR_INTERVAL_SECONDS as string) * 2;
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
  console.log('DEBUG... UPDATE STORE.', data)

  
  if ('assemblies' in data) {
    Object.keys(data.assemblies).map((assemblyIdentifier) => {
      const container = data.assemblies[assemblyIdentifier];
      if ('assembly' in container) {
        const assemblyTupleByApi = container.assembly as IAssemblyTupleByApi;
        commit(
          'assemblystore/storeAssemblyObject',
          {
            assemblyIdentifier,
            assemblyTupleByApi
          },
          { root: true }
        );
      }
      if ('progression' in container) {
        const progression = container.progression;
        commit(
          'assemblystore/storeAssemblyProgression',
          {
            assemblyIdentifier,
            progression,
          },
          { root: true }
        );
      }
    });

    if ('stages' in data) {
      Object.keys(data.stages).map((stageID) => {
        const container = data.stages[stageID];
        if ('stage' in container) {
          const stage = container.stage;
          commit(
            'assemblystore/storeStageObject',
            { stageID, stage },
            { root: true }
          );
        }
        if ('progression' in container) {
          const progression = container.progression;
          commit(
            'assemblystore/storeStageProgression',
            {
              stageID,
              progression,
            },
            { root: true }
          );
        }
      });
    }

    if ('contents' in data) {
      console.log('RETRIEVED MODIFIED CONTENTS', data.contents);
      dispatch(
        'contenttreestore/update_contents',
        {
          modifiedContents: data.contents,
        },
        { root: true }
      );
    }

    if ('peerreviews' in data) {
      console.log('RETRIEVED MODIFIED PEERREVIEWS', data.peerreviews);
      dispatch(
        'peerreviewstore/updatePeerreviewTuples',
        {
          modifiedPeerreviews: data.peerreviews,
        },
        { root: true }
      );
    }

    if ('notifications' in data) {
      console.log('RETRIEVED NOTIFICATIONS', data.peerreviews);
      commit(
        'profilestore/update_notifications',
        {
          notifications: data.notifications,
        },
        { root: true }
      );
    }
  }
};
