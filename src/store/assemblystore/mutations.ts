/**
 * Store full assembly Response (with configuration and stuff)
 */

import { IAssemblyTuple, IAssemblyTupleByApi } from 'src/models/assembly';

type IData = {
  assemblyIdentifier: string; 
  data: IAssemblyTupleByApi
}
export const storeAssembly = (state, { assemblyIdentifier, data }: IData ) => {
  state.stages = Object.assign({},  state.stages, data.stages);
  const stageKeys = Object.keys(data.stages);

  const copy = data as any;
  delete copy.stages
  const assemblyTuple = copy as IAssemblyTuple
  
  assemblyTuple.stage_keys = stageKeys.map(Number);
  state.assemblydata[assemblyIdentifier] = assemblyTuple as IAssemblyTuple;
};

export const storeAssemblyStage = (state, { assemblyIdentifier, data }) => {
  // Set Data
  state.stages = data.stages;
  // Set associations
  const deepCopy = JSON.parse(JSON.stringify(data.stages));
  const stageKeys = Object.keys(deepCopy);
  state.assemblydata[assemblyIdentifier].stages = stageKeys;
};

export const storeAssemblyObject = (
  state,
  { assemblyIdentifier, assembly }
) => {
  // console.log(`Store assembly ${assemblyIdentifier} object`)
  if (!state.assemblydata[assemblyIdentifier]) {
    // happens when logout
    return null;
  }
  state.assemblydata[assemblyIdentifier].assembly = assembly;
};

export const storeAssemblyProgression = (
  state,
  { assemblyIdentifier, progression }
) => {
  // console.log(`Store assembly ${assemblyIdentifier} progressions`)
  if (!state.assemblydata[assemblyIdentifier]) {
    // happens when logout
    return null;
  }
  state.assemblydata[assemblyIdentifier].progression = progression;
};

export const storeStageObject = (state, { stageID, stage }) => {
  // console.log(`Store stage ${stageID} object`)
  if (!state.stages[stageID]) {
    // happens when logout
    return null;
  }
  state.stages[stageID].stage = stage;
};
export const storeStageProgression = (state, { stageID, progression }) => {
  // console.log(`Store stage ${stageID} progression`, progression)
  if (!state.stages[stageID]) {
    // happens when logout
    return null;
  }
  state.stages[stageID].progression = progression;
};

export const storeStageProgressionAlertFlag = (state, { stageID, alerted }) => {
  // console.log('STORE ALERTED FLAG')
  if (!state.stages[stageID]?.progression) {
    const progression = { alerted: alerted };
    state.stages[stageID].progression = progression;
  } else {
    state.stages[stageID].progression.alerted = alerted;
  }
};

export const storeStageProgressionCompleted = (
  state,
  { stageID, completed }
) => {
  console.log('STORE COMPLETED FLAG');
  if (!state.stages[stageID]?.progression) {
    const progression = {
      alerted: false,
      completed: completed,
    };
    state.stages[stageID].progression = progression;
  } else {
    if (state.stages[stageID].progression.alerted && completed) {
      state.stages[stageID].progression.alerted = false;
    }
    state.stages[stageID].progression.completed = completed;
  }
};

export const incrementAssemblyActivityCounter = (
  state,
  { assemblyIdentifier, counterName }
) => {
  if (!state.assemblydata[assemblyIdentifier]) {
    // happens when logout
    return null;
  }
  const progression = state.assemblydata[assemblyIdentifier]?.progression;
  console.assert(progression);
  let counter = 0;
  if (progression[counterName] !== null) {
    counter = progression[counterName];
  }
  state.assemblydata[assemblyIdentifier].progression.counterName = counter + 1;
};

export const updateFocusedContent = (state, { stageID, contentID }) => {
  // console.log("FOCUSEDCONTENT HAS BEEN WRITTEN (not yet)")
  if (!state.stages[stageID]) {
    // seem to happen sometimes => for instance when logout and data is cleared???
    return null;
  }

  if (!state.stages[stageID].progression) {
    const progression = {
      focused_content_id: contentID,
      alerted: true,
    };
    state.stages[stageID].progression = progression;
  } else {
    state.stages[stageID].progression.focused_content_id = contentID;
  }
};

export const deleteAssemblyStore = (state) => {
  state.assemblydata = {};
  state.stages = {};
  state.milestones = {};
};

export const addMilestone = (state, { label, weight, key, day, stageID }) => {
  console.assert(label);
  console.assert(weight);
  console.assert(day);
  console.assert(stageID);

  if (!(day in state.milestones)) {
    state.milestones.day = {};
  }

  console.assert(state.milestones[day] !== null);
  if (!(stageID in state.milestones[day])) {
    state.milestones[day].stageID = [];
  }

  const newMilestone = { label, weight, key };
  const currentLength = state.milestones[day][stageID].length;
  state.milestones[day][stageID][currentLength] = newMilestone;
};
