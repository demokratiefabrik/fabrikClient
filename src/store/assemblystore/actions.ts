import useEmitter from 'src/utils/emitter';
const emitter = useEmitter();
import api from 'src/utils/api';
// import useAppComposable from 'src/composables/app.composable';
// import useAssemblyComposable from 'src/composables/assembly.composable';

export const syncAssembly = (
  { state, dispatch },
  { oauthUserID, assemblyIdentifier }
) => {
  console.log(` sync assembly ${assemblyIdentifier}`);
  if (!state.assemblydata[assemblyIdentifier]) {
    // no cached version exists: load the data from resource server...
    dispatch('retrieveAssembly', { assemblyIdentifier: assemblyIdentifier });
    // console.log(' not yet fetched...')
    return null;
  }

  // wrong user? and renew cache all x- minutes!
  const wrongUser =
    oauthUserID != state.assemblydata[assemblyIdentifier].access_sub;
  const expired =
    !state.assemblydata[assemblyIdentifier] ||
    api.expiredCacheDate(state.assemblydata[assemblyIdentifier].access_date);
  // console.log()
  if (expired || wrongUser) {
    console.log(
      ' Assembly not in sync  or wrong user...',
      expired,
      state.assemblydata[assemblyIdentifier].access_date
    );
    dispatch('retrieveAssembly', { assemblyIdentifier: assemblyIdentifier });
    return null;
  }

  // console.log("AssemblyLoaded: Assembly retrieved from localStorage")

  emitter.emit('AssemblyLoaded');
  return null;
};

export const deleteAssemblyStore = ({ commit }) => {
  commit('deleteAssemblyStore');
};

export const retrieveAssembly = ({ commit }, { assemblyIdentifier }) => {
  if (!assemblyIdentifier) {
    return null;
  }

  // console.log('Retrieve assembly from resource server')
  api
    .retrieveAssembly(assemblyIdentifier)
    .then((response) => {
      const data = response.data;
      console.assert(data);
      commit('storeAssembly', { assemblyIdentifier, data });
      console.log(
        'EVENT: AssemblyLoaded: Assembly retrieved from Resource Server'
      );
      emitter.emit('AssemblyLoaded');
    })
    .catch((error) => {
      console.warn(error);
      // Error Handling is done in Axios Interceptor
      console.warn('Request Error');
    });
};

export const addOrUpdateStage = ({ commit }, { assemblyIdentifier, stage }) => {
  // const appComposable = useAppComposable();
  // const {assemblyIdentifier} = useAssemblyComposable();
  console.log('stage: ', stage, assemblyIdentifier);
  api
    .addOrUpdateStage(assemblyIdentifier, stage)
    .then((response) => {
      console.log(response.data);
      const data = response.data;

      // Store result
      console.assert(!!data.assembly);
      console.assert(!!data.stages);

      // UPDATE ASSEMBLY DATA and STAGE DATA
      // storeAssembly(state, { assemblyIdentifier, data }) => {
      // commit('storeAssembly', { assemblyIdentifier, data })
      commit('storeAssemblyStage', { assemblyIdentifier, data });

      // ADD Stage Relations
      // if (stage.id) {
      // if (data.stages) {
      //   Object.values(data.stages).forEach((stage) => {
      //     console.assert(stage)
      //     console.log(stage)
      //     commit('updateStageContent', { stage })
      //   });
      // }
    })
    .catch((error) => {
      console.warn(error);
      // Error Handling is done in Axios Interceptor
      console.warn('Request Error');
    });
};

export const updateAssembly = ({ commit }, { assembly }) => {
  // const {assemblyIdentifier} = useAppComposable()
  // const assemblyIdentifier = appComposable.assemblyIdentifier.value
  // console.log('assembly: ', assembly)
  const assemblyIdentifier: string = assembly.identifier;
  api
    .updateAssembly(assemblyIdentifier, assembly)
    .then((response) => {
      console.log(response.data);
      const data = response.data;

      // Store result
      console.assert(!!data.assembly);
      commit('storeAssemblyObject', {
        assemblyIdentifier,
        assembly: data.assembly,
      });
    })
    .catch((error) => {
      console.warn(error);
      // Error Handling is done in Axios Interceptor
      console.warn('Request Error');
    });
};

export const addMilestone = ({ getters, commit }, { stageID, label, weight, key }) => {
  console.assert(weight);
  console.assert(label);
  if (!key) {
    key = 'default';
  }
  console.log('ADD MILESTONE', label, ' WEIGHT:', weight, ' KEY:', key);

  const day = getters.assemblyProgression?.number_of_day_sessions;
  // const {stageID} = useAssemblyComposable();
  // const stageID = stageID.value;
  // console.assert(stageID.value);

  const milestones = getters.stageMilestones;
  console.assert(milestones !== null);
  if (milestones) {
    const already = milestones.find(
      (milestone) => milestone.label === label && milestone.key === key
    );
    if (already) {
      // milestone has been already archieved before
      return false;
    }
  }

  // INSERT NEW MILESTONE
  commit('addMilestone', { label, weight, key, day, stageID });
  // abel, weight, day, stage
  return true;
};

export const incrementAssemblyActivityCounter = (
  { commit },
  { assemblyIdentifier, counterName }
) => {
  console.assert(
    ['number_of_proposals_today', 'number_of_comments_today'].includes(
      counterName
    )
  );
  // const { assemblyIdentifier } = useAssemblyComposable();
  commit('incrementAssemblyActivityCounter', {
    assemblyIdentifier,
    counterName,
  });
};

export const updateFocusedContent = ({ commit }, { stageID, contentID }) => {
  console.assert(stageID);
  console.assert(contentID);
  commit('updateFocusedContent', { stageID, contentID });
};

export const storeStageProgressionAlertFlag = (
  { commit },
  { stageID, alerted }
) => {
  console.assert(stageID);
  commit('storeStageProgressionAlertFlag', { stageID, alerted });
};

export const storeStageProgressionCompleted = (
  { commit },
  { stageID, completed }
) => {
  console.assert(stageID);
  commit('storeStageProgressionCompleted', { stageID, completed });
};
