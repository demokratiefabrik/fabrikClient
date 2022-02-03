import { date } from 'quasar';
import useRouterComposable from 'src/composables/router.composable';
import {
  IAssembly,
  IAssemblyConfiguration,
  IAssemblyProgression,
  IAssemblyTuple,
} from 'src/models/assembly';
import { IStage, IStageTuple } from 'src/models/stage';
const { isSameDate } = date;
1;
export const assemblies = (state): IAssemblyTuple[] | null => {
  // const { assemblyIdentifier } = useRouterComposable();
  return Object.values(state.assemblydata);
};

export const assemblyTuple = (state): IAssemblyTuple | null => {
  const { assemblyIdentifier } = useRouterComposable();
  if (!assemblyIdentifier.value) {
    return null;
  }

  return state.assemblydata[assemblyIdentifier.value];
};

export const assembly = (_state, getters): IAssembly | null => {
  if (!getters.assemblyTuple ) {
    return null;
  }
  return getters.assemblyTuple.assembly;
};

export const assemblyName = (_state, getters): string | undefined => {
  if (getters.assembly) {
    return getters.assembly.title;
  }
};

export const assemblyType = (_state, getters): string | undefined => {
  if (getters.assembly) {
    return getters.assembly.type;
  }
};

export const assemblyConfiguration = (
  _state,
  getters
): IAssemblyConfiguration | null => {
  if (!getters.assemblyTuple) {
    console.log('...assemblyTuple not ready (configuration)');
    return null;
  }
  return getters.assemblyTuple.configuration;
};

export const assembly_userid = (state, getters): number | null => {
  if (!getters.assemblyTuple) {
    console.log('...assemblyTuple not ready (assembly userid...');
    return null;
  }

  return getters.assemblyTuple.access_sub;
};

export const assemblyProgression = (
  state,
  getters
): IAssemblyProgression | null => {
  if (!getters.assemblyTuple) {
    return null;
  }
  // console.log(getters.assemblyTuple.progression)
  return getters.assemblyTuple.progression;
};

export const assemblyStages = (
  state,
  getters
): Record<number, IStageTuple> | null => {
  if (!getters.assemblyTuple) {
    console.log('...assemblyTuple not ready (stages)');
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
export const assemblyAcls = (
  _state,
  _getters,
  _rootState,
  rootGetters
): string[] | null => {
  const { assemblyIdentifier } = useRouterComposable();
  if (!assemblyIdentifier) {
    return null;
  }
  const translateAclMethod = rootGetters['profilestore/translateOauthAcls'];
  return translateAclMethod(assemblyIdentifier.value);
};

export const IsManager = (_state, getters): boolean | null => {
  if (!getters.assemblyAcls) {
    return null;
  }
  return getters.assemblyAcls.includes('manage');
};
export const IsObserver = (_state, getters): boolean | null => {
  if (!getters.assemblyAcls) {
    return null;
  }
  return getters.assemblyAcls.includes('observe');
};
export const IsContributor = (_state, getters): boolean | null => {
  if (!getters.assemblyAcls) {
    return null;
  }
  return getters.assemblyAcls.includes('add');
};
export const IsExpert = (_state, getters): boolean | null => {
  if (!getters.assemblyAcls) {
    return null;
  }
  return getters.assemblyAcls.includes('expert');
};
export const IsDelegate = (_state, getters): boolean | null => {
  if (!getters.assemblyAcls) {
    return null;
  }
  return getters.assemblyAcls.includes('delegate');
};

export const stageMilestones = (state, getters) => {
  console.log('>> NOTE: stageMilestones');

  const { stageID } = useRouterComposable();
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

export const stageMilestoneWeigths = (
  state,
  getters
): Record<string, number> => {
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

export const stageMilestonesCompleted = (state, getters): boolean => {
  // Every user needs to archieve 10 milestones weights for each stage a day.
  const milestones = getters.stageMilestones;
  console.assert(milestones !== null);
  const weights = milestones.reduce((n, milestone) => n + milestone.weight, 0);
  // console.log(weights, "weights")
  return weights >= 12;
};

export const stage = (_state, getters) => {
  const stages = getters.assemblyStages;

  const { stageID } = useRouterComposable();
  if (stageID.value) {
    return stages[stageID.value];
  }
};

export const assembly_sorted_stages = (
  _state,
  getters
): IStageTuple[] | null => {
  // console.log(">>..:Sort stages :")
  // console.trace()
  const stages = getters.assemblyStages;
  if (!stages) {
    return null;
  }

  const stageValues = Object.values(stages) as IStageTuple[];
  const sortFunc = (a: IStageTuple, b: IStageTuple) =>
    a.stage.order_position < b.stage.order_position
      ? -1
      : a.stage.order_position > b.stage.order_position
      ? 1
      : 0;

  return stageValues.sort((a, b) => sortFunc(a, b));
};

/** Which stage is  the next scheduled stage (if empty, no stages available or no scheduled stage available) */
export const next_scheduled_stage = (_state, getters): IStageTuple | null => {
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
export const last_accessible_stage = (_state, getters): IStageTuple | null => {
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
export const assembly_scheduled_stages = (
  _state,
  getters
): IStageTuple[] | null => {
  const sorted_stages = getters.assembly_sorted_stages;
  if (!sorted_stages) {
    console.log('assemmbly is not yet loaded');
    return null;
  }
  return sorted_stages.filter((stage) => getters.is_stage_scheduled(stage));
};

/** Which stages are freely open / accessible */
export const assembly_accessible_stages = (
  _state,
  getters
): IStageTuple[] | null => {
  const sorted_stages = getters.assembly_sorted_stages;
  if (!sorted_stages) {
    // console.log('assemmbly is not yet loaded');
    return null;
  }
  // console.assert(sorted_stages)
  const last_accessible_stage = getters.last_accessible_stage;
  console.assert(last_accessible_stage);
  // console.log('zzzzzzzzzz')

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
export const assembly_accessible_stage_ids = (_state, getters): number[] | null => {
  const accessible_stages = getters.assembly_accessible_stages;
  if (!accessible_stages) {
    return null;
  }

  return accessible_stages.map((stage) => stage.stage.id);
};

export const get_stage_number_by_stage =
  (getters) =>
  (stage): number => {
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

export const get_stage_number_by_stage_id =
  (_state, getters) =>
  (stageID): null | number => {
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
  (_state, getters) =>
  (previous_stage): IStage | null => {
    // console.log("previous stage: moveon ", previous_stage)
    console.assert(previous_stage);
    const next_stage = getters.assembly_accessible_stages.find(
      (stage) =>
        true && stage.stage.order_position > previous_stage.stage.order_position
    );
    // console.log("new stage found", next_stage)
    return next_stage;
  };

export const is_stage_first =
  (_state, getters) =>
  (stage): boolean => {
    console.assert(stage);
    const sorted_stages = getters.assembly_sorted_stages;
    return sorted_stages[0] == stage;
  };

export const is_stage_last =
  (_state, getters) =>
  (stage): boolean => {
    console.assert(stage);
    console.assert(stage.stage);

    const sorted_stages = getters.assembly_sorted_stages;
    console.assert(sorted_stages[sorted_stages.length - 1]);
    return sorted_stages[sorted_stages.length - 1]?.stage.id == stage.stage.id;
  };

/* Is there still an activity required on this stage? */
export const is_stage_scheduled =
  (_state, getters) =>
  (stage): boolean => {
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
export const is_stage_new =
  () =>
  (stage): boolean => {
    console.assert(stage);
    // when progression entry not yet exists...
    return !stage.progression;
  };

/**
 * Not scheduled, not new, not completeed => just idle
 */
export const is_stage_alerted =
  () =>
  (stage): boolean => {
    // when progression entry not yet exists or when alerted flag is set...
    return !stage.progression || stage.progression.alerted;
  };

export const is_stage_idle =
  (getters) =>
  (stage): boolean => {
    console.assert(stage);
    return (
      !getters.is_stage_scheduled(stage) &&
      !getters.is_stage_completed(stage) &&
      !getters.is_stage_disabled(stage)
    );
  };

export const is_stage_skipped =
  () =>
  (stage): boolean => {
    console.assert(stage);
    return stage.progression?.skipped;
  };

export const is_stage_disabled =
  () =>
  (stage: IStageTuple): boolean => {   
    const disabled = stage.stage.disabled !== undefined && stage.stage.disabled === true
    return (disabled)
  };

export const is_stage_completed =
  () =>
  (stage): boolean => {
    console.assert(stage);
    return stage.progression?.completed === true;
  };

export const is_stage_accessible =
  (getters) =>
  (stage): boolean => {
    console.assert(stage);
    // console.log(stage, 'ttttt', assembly_accessible_stage_ids)
    const accessible_stage_ids = getters.assembly_accessible_stage_ids;
    return accessible_stage_ids?.includes(stage.stage.id);
  };

export const is_stage_done =
  (getters) =>
  (stage): boolean => {
    console.log(stage);
    console.assert(stage);
    return (
      getters.is_stage_accessible(stage) || getters.is_stage_completed(stage)
    );
  };

export const is_first_day =
  () =>
  (stage): boolean => {
    return isSameDate(stage.progression.date_created, Date.now(), 'day');
  };
