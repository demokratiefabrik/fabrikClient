import useAppComposable from 'src/composables/app.composable';
import { date } from 'quasar';
const { isSameDate } = date;

export const assemblyTuple = (state) => {
  const { assemblyIdentifier } = useAppComposable();
  if (!assemblyIdentifier.value) {
    return null;
  }

  return state.assemblydata[assemblyIdentifier.value];
};

export const assembly = (getters) => {
  if (!getters.assemblyTuple) {
    return null;
  }

  return getters.assemblyTuple.assembly;
};

export const assemblyName = (getters) => {
  if (getters.assembly) {
    return getters.assembly.title;
  }
};

export const assemblyType = (state, getters) => {
  if (getters.assembly) {
    return getters.assembly.type;
  }
};

export const assemblyConfiguration = (state, getters) => {
  if (!getters.assemblyTuple) {
    console.log('...assemblyTuple not ready');
    return null;
  }
  return getters.assemblyTuple.configuration;
};

export const assembly_userid = (state, getters) => {
  if (!getters.assemblyTuple) {
    console.log('...assemblyTuple not ready');
    return null;
  }

  return getters.assemblyTuple.access_sub;
};

export const assemblyProgression = (state, getters) => {
  if (!getters.assemblyTuple) {
    return null;
  }
  // console.log(getters.assemblyTuple.progression)
  return getters.assemblyTuple.progression;
};

export const assembly_stages = (state, getters) => {
  if (!getters.assemblyTuple) {
    console.log('...assemblyTuple not ready');
    return null;
  }

  const stage_keys = getters.assemblyTuple.stages;

  /**
   * filter only the stages of the specific assembly
   * */
  // TODO: use filter (defined in boot/index)
  const stages = Object.keys(state.stages)
    .filter((key) => stage_keys.includes(`${key}`))
    .reduce((obj, key) => {
      obj[key] = state.stages[key];
      return obj;
    }, {});

  return stages;
};

/**
 * oAuth Server delivers user roles in the format "<role>@<assemblyIdentifier>".
 * THis method translates thes roles in a list of acls for the given Assembly.
 * => such as  ['delegate', 'modify', 'observe']
 */
export const assemblyAcls = (state, getters, rootState, rootGetters) => {
  const { assemblyIdentifier } = useAppComposable();
  if (!assemblyIdentifier) {
    return null;
  }
  const translateAclMethod =
    rootGetters['profilestore/translateOauthAcls'];
  return translateAclMethod(assemblyIdentifier.value);
};

export const IsManager = (_state, getters) => {
  if (!getters.assemblyAcls) {
    return null;
  }
  return getters.assemblyAcls.includes('manage');
};
export const IsObserver = (_state, getters) => {
  if (!getters.assemblyAcls) {
    return null;
  }
  return getters.assemblyAcls.includes('observe');
};
export const IsContributor = (_state, getters) => {
  if (!getters.assemblyAcls) {
    return null;
  }
  return getters.assemblyAcls.includes('add');
};
export const IsExpert = (_state, getters) => {
  if (!getters.assemblyAcls) {
    return null;
  }
  return getters.assemblyAcls.includes('expert');
};
export const IsDelegate = (_state, getters) => {
  if (!getters.assemblyAcls) {
    return null;
  }
  return getters.assemblyAcls.includes('delegate');
};

export const stageMilestones = (state, getters) => {
  console.log('>> NOTE: stageMilestones');

  const { stageID } = useAppComposable();
  if (!stageID.value) {
    console.log('...stageID not ready');
    return null;
  }
  const day = getters.assemblyProgression?.number_of_day_sessions;
  console.assert(day && day > 0);
  const stateMilestones = state.milestones[day];
  if (!stateMilestones) {
    return [];
  }
  const milestones = stateMilestones[stageID.value];
  return milestones ? milestones : [];
};

export const stageMilestoneLabels = (_state, getters) => {
  const milestones = getters.stageMilestones;
  if (!milestones) {
    console.log('empty milestoness...............sldfls');
    return [];
  }
  return milestones.map((milestone) => milestone.label);
};

export const stageMilestoneWeigths = (state, getters) => {
  const milestones = getters.stageMilestones;
  if (!milestones) {
    return {};
  }

  const weights = {};
  milestones.forEach((milestone) => {
    if (!(milestone.label in weights)) {
      weights[milestone.label] = 0;
    }
    weights[milestone.label] += parseInt(milestone.weight);
  });
  return weights;
};

export const stageMilestonesCompleted = (state, getters) => {
  // Every user needs to archieve 10 milestones weights for each stage a day.
  const milestones = getters.stageMilestones;
  console.assert(milestones !== null);
  const weights = milestones.reduce((n, milestone) => n + milestone.weight, 0);
  // console.log(weights, "weights")
  return weights >= 12;
};

export const stage = (_state, getters) => {
  const stages = getters.assembly_stages;

  const { stageID } = useAppComposable();
  if (stageID.value) {
    return stages[stageID.value];
  }
};

export const assembly_sorted_stages = (_state, getters) => {
  // console.log(">>..:Sort stages :")
  // console.trace()
  const stages = getters.assembly_stages;
  if (!stages) {
    return null;
  }

  if (stages) {
    const stageValues = Object.values(stages);
    const sortFunc = (a: any, b: any) =>
      a.stage.order_position < b.stage.order_position
        ? -1
        : a.stage.order_position > b.stage.order_position
        ? 1
        : 0;
    return stageValues.sort((a, b) => sortFunc(a, b));
  }
};

/** Which stage is  the next scheduled stage (if empty, no stages available or no scheduled stage available) */
export const next_scheduled_stage = (state, getters) => {
  // console.log(">> next_scheduled_stage")
  // console.log(getters.assembly_sorted_stages)
  const stages = getters.assembly_sorted_stages;
  if (!stages) {
    console.log('assemmbly is not yet loaded');
    return null;
  }
  // console.log("sorted stages,", stages)
  // console.log(getters.is_stage_scheduled(stages[1]))
  const last_accessible_stage = stages.find(
    (stage) =>
      true &&
      getters.is_stage_scheduled(stage) &&
      !getters.is_stage_disabled(stage) &&
      !getters.is_stage_completed(stage)
  );
  // console.trace()
  return last_accessible_stage;
};

/** Which stage is  the last one that is freely open / accessible */
export const last_accessible_stage = (state, getters) => {
  const nextScheduledStage = getters.next_scheduled_stage;
  const stages = getters.assembly_sorted_stages;

  if (!stages) {
    console.log('assemmbly is not yet loaded');
    return null;
  }

  if (!nextScheduledStage) {
    // it seems that all stages are open! => take the last one...
    return stages[stages.length - 1];
  }

  // console.log('current stage: ', nextScheduledStage)
  return nextScheduledStage;
};

/* Return all stages, that are still to absolve */
export const assembly_scheduled_stages = (state, getters) => {
  const sorted_stages = getters.assembly_sorted_stages;
  if (!sorted_stages) {
    console.log('assemmbly is not yet loaded');
    return null;
  }
  return sorted_stages.filter((stage) => getters.is_stage_scheduled(stage));
};

/** Which stages are freely open / accessible */
export const assembly_accessible_stages = (state, getters) => {
  const sorted_stages = getters.assembly_sorted_stages;
  if (!sorted_stages) {
    console.log('assemmbly is not yet loaded');
    return null;
  }
  // console.assert(sorted_stages)
  const last_accessible_stage = getters.last_accessible_stage;
  console.assert(last_accessible_stage);

  // Return all stages until the last_accessible_stage
  return sorted_stages.filter(
    (stage) =>
      true &&
      stage.stage.order_position <=
        last_accessible_stage.stage.order_position &&
      !getters.is_stage_disabled(stage) &&
      !getters.is_stage_completed(stage)
  );
};

/** Which stages are freely open / accessible */
export const assembly_accessible_stage_ids = (getters) => {
  const accessible_stages = getters.assembly_accessible_stages;

  if (!accessible_stages) {
    return null;
  }

  return accessible_stages.map((stage) => stage.stage.id);
};

export const get_stage_number_by_stage = (getters) => (stage) => {
  console.assert(stage);
  const sorted_stages = getters.assembly_sorted_stages;
  console.assert(sorted_stages);
  const sorted_stage_ids = sorted_stages.map((stage) => stage.stage.id);
  // console.log(sorted_stage_ids)
  const stage_number = sorted_stage_ids.indexOf(stage.stage.id);
  // console.log(stage_number, "stage_number of stage: ", stage)
  // console.log("sorted_stage: ", sorted_stages)
  console.assert(stage_number > -1);

  return stage_number;
};

export const get_stage_number_by_stage_id = (state, getters) => (stageID) => {
  if (!stageID) {
    return null;
  }
  // assembly loaded?
  const sorted_stages = getters.assembly_sorted_stages;
  if (!sorted_stages) {
    return null;
  }

  console.assert(sorted_stages);
  const sorted_stage_ids = sorted_stages.map((stage) => stage.stage.id);
  const stage_number = sorted_stage_ids.indexOf(stageID);
  // console.log("find stage", stageID, " in ", sorted_stage_ids)
  console.assert(stage_number > -1);

  return stage_number;
};

export const find_next_accessible_stage =
  (state, getters) => (previous_stage) => {
    // console.log("previous stage: moveon ", previous_stage)
    console.assert(previous_stage);
    const next_stage = getters.assembly_accessible_stages.find(
      (stage) =>
        true && stage.stage.order_position > previous_stage.stage.order_position
    );
    // console.log("new stage found", next_stage)
    return next_stage;
  };

export const is_stage_first = (state, getters) => (stage) => {
  console.assert(stage);
  const sorted_stages = getters.assembly_sorted_stages;
  return sorted_stages[0] == stage;
};

export const is_stage_last = (state, getters) => (stage) => {
  console.assert(stage);
  console.assert(stage.stage);

  const sorted_stages = getters.assembly_sorted_stages;
  console.assert(sorted_stages[sorted_stages.length - 1]);
  return sorted_stages[sorted_stages.length - 1]?.stage.id == stage.stage.id;
};

/* Is there still an activity required on this stage? */
export const is_stage_scheduled = (state, getters) => (stage) => {
  console.assert(stage);
  if (getters.is_stage_completed(stage)) {
    return false;
  }

  // for observers and other users...
  if (!getters.IsDelegate) {
    return false;
  }

  // only for delegates....
  return getters.is_stage_alerted(stage) || getters.is_stage_new(stage);
};

/** Which stage is new => no progression entry is available */
export const is_stage_new = () => (stage) => {
  console.assert(stage);
  // when progression entry not yet exists...
  return !stage.progression;
};

/**
 * Not scheduled, not new, not completeed => just idle
 */
export const is_stage_alerted = () => (stage) => {
  // when progression entry not yet exists or when alerted flag is set...
  return !stage.progression || stage.progression.alerted;
};

export const is_stage_idle = (getters) => (stage) => {
  console.assert(stage);
  return (
    !getters.is_stage_scheduled(stage) &&
    !getters.is_stage_completed(stage) &&
    !getters.is_stage_disabled(stage)
  );
};

export const is_stage_skipped = () => (stage) => {
  console.assert(stage);
  return stage.progression?.skipped;
};

export const is_stage_disabled = () => (stage) => {
  console.assert(stage);
  console.log('deprecated.... is_stage_disabled')
  return false;
  // TODO: not anymore available, right? return (stage.stage.disabled || stage.stage.deleted)
};

export const is_stage_completed = () => (stage) => {
  console.assert(stage);
  return stage.progression?.completed === true;
};

export const is_stage_accessible = (getters) => (stage) => {
  console.assert(stage);
  const accessible_stage_ids = getters.assembly_accessible_stage_ids;
  return accessible_stage_ids.includes(stage.stage.id);
};

export const is_stage_done = (getters) => (stage) => {
  console.log(stage);
  console.assert(stage);
  return (
    getters.is_stage_accessible(stage) || getters.is_stage_completed(stage)
  );
};

export const is_first_day = () => (stage) => {
  return isSameDate(stage.progression.date_created, Date.now(), 'day');
};