import { computed, watch } from 'vue';
import usePKCEComposable from 'src/plugins/VueOAuth2PKCE/pkce.composable';
import useMonitorComposable from './monitor.composable';
import constants from 'src/utils/constants';
import useRouterComposable from './router.composable';
import { useStore } from 'vuex';
import useEmitter from 'src/utils/emitter';
import useAssemblyComposable from './assembly.composable';
import useLibraryComposable from 'src/utils/library';
import { IStageTuple } from 'src/models/stage';
// import { IAssemblyTuple } from 'src/models/assembly';

// const output = ref<null | any>(null);

const emitter = useEmitter();
const { loaded } = useLibraryComposable();
const { userid } = usePKCEComposable();

export default function useStageComposable() {
  // const setup = () => {
  console.log('DEBUG: useStageComposable::SETUP');
  const store = useStore();

  const { stageID, gotoStage, assembly, assemblyMenuData } =
    useAssemblyComposable('stage.comp');
  const { monitorLog } = useMonitorComposable();
  const { gotoAssemblyHome, assemblyIdentifier } = useRouterComposable();

  const stageMilestonesCompleted = computed(
    () => store.getters['assemblystore/stageMilestonesCompleted']
  );
  const assembly_sorted_stages = computed(
    (): IStageTuple[] | null =>
      store.getters['assemblystore/assembly_sorted_stages']
  );
  const assemblyStages = computed(
    (): IStageTuple[] | null => store.getters['assemblystore/assemblyStages']
  );
  const assembly_accessible_stages = computed(
    (): IStageTuple[] | null =>
      store.getters['assemblystore/assembly_accessible_stages']
  );
  const assembly_scheduled_stages = computed(
    (): IStageTuple[] | null =>
      store.getters['assemblystore/assembly_scheduled_stages']
  );
  const IsManager = computed(
    (): boolean => store.getters['assemblystore/IsManager']
  );
  // const assembly = computed(
  //   (): IAssemblyTuple => store.getters['assemblystore/assembly']
  // );

  const is_stage_accessible =
    store.getters['assemblystore/is_stage_accessible'];

  const is_stage_alerted = store.getters['assemblystore/is_stage_alerted'];
  const is_stage_completed = store.getters['assemblystore/is_stage_completed'];

  const isRoutedStageAlerted = computed((): boolean | null => {
    if (!routed_stage.value) {
      return null;
    }
    return is_stage_alerted(routed_stage.value);
  });
  const isRoutedStageCompleted = computed((): boolean | null => {
    if (!routed_stage.value) {
      return null;
    }
    return is_stage_completed(routed_stage.value as IStageTuple);
  });

  const nextScheduledStage = computed(
    (): IStageTuple | null => store.getters['assemblystore/nextScheduledStage']
  );

  const routed_stage = computed((): IStageTuple | null => {
    if (!stageID.value) {
      return null;
    }
    if (!assemblyStages.value) {
      return null;
    }
    console.log(
      'routed stage debug................',
      stageID.value,
      assemblyStages.value,
      assemblyStages.value[stageID.value]
    );
    return assemblyStages.value[stageID.value];
  });

  const ready = computed((): boolean => {
    const ready = loaded(assemblyStages);
    if (ready) {
      emitter.emit('hideLoading');
    }

    // TODO: check if stage is loaded...
    // TODO: right place for PERMISSION CHECK . Not really... right?
    if (!IsManager.value) {
      if (routed_stage.value && !is_stage_accessible(routed_stage)) {
        gotoAssemblyHome(assembly);
      }
    }

    return ready;
  });

  const contenttreeID = computed((): null | number => {
    // console.log('load contenttreeID in .compcontentreeuted', routed_stage.value)
    // console.log("RETRIEVE contenttreeID..", this.routed_stage)
    if (!routed_stage.value?.stage?.contenttree_id) {
      return null;
    }
    return routed_stage.value?.stage?.contenttree_id;
  });

  // --- TODO: move all below to assembly COMPO?
  const isFirstText = computed((): null | boolean => {
    if (assembly_sorted_stages.value?.length) {
      const firstTextStage = assembly_sorted_stages.value?.find(
        (stage) => stage?.stage.type === 'TEXTSHEET'
      );
      return routed_stage.value == firstTextStage;
    }
    return null;
  });

  // TODO: TO IMPLEMENT
  // const highlightedItem = computed((): null | boolean => {
  //   return this.sideMenuItems.find(
  //     (item) => {
  //       if (item.customHightlighting) {
  //         return item.customHightlighting()
  //       }
  //       const weights = stageMilestoneWeigths[item.anchor];
  //       return !weights || weights < 3
  //     }
  //   );
  // },

  const markUnAlert = (stage: IStageTuple | null = null) => {
    // Notify stage as completed
    if (!stage) {
      stage = routed_stage.value;
    }

    if (!stage) {
      return;
    }

    store.dispatch('assemblystore/storeStageProgressionAlertFlag', {
      stageID: stage.stage.id,
      alerted: false,
    });
    // Fire (immediately), immediately
    const data = { stageID: stage.stage.id };
    monitorLog(constants.MONITOR_STAGE_UNALERT, data);
  };

  const markCompleted = () => {
    // Notify stage as completed
    if (routed_stage.value && !routed_stage.value?.progression?.completed) {
      monitorLog(constants.MONITOR_STAGE_COMPLETED);
      store.dispatch('assemblystore/storeStageProgressionCompleted', {
        stageID: routed_stage.value.stage.id,
        completed: true,
      });
    }
  };

  const checkMilestones = () => {
    if (stageMilestonesCompleted.value) {
      // ignore this statement...
      if (is_stage_alerted(routed_stage.value)) {
        markUnAlert();
      }
      return;
    }
  };

  const milestone = (milestoneLabel: string, weight: number, key: string) => {
    store.dispatch('assemblystore/addMilestone', {
      label: milestoneLabel,
      weight,
      key,
    });
    checkMilestones();
  };

  //TODO add watcher... to sync data..
  /* Reset Notifications when routing...Ensure that all (error) messages disappear, when route changes.. */
  watch(contenttreeID, () => {
    if (contenttreeID.value) {
      store.dispatch('contenttreestore/syncContenttree', {
        assemblyIdentifier: assemblyIdentifier,
        contenttreeID: contenttreeID.value,
        oauthUserID: userid.value,
      });
    }
  });

  // MOUNTED
  // when stage has been loaded already
  if (routed_stage.value?.stage.contenttree_id && userid) {
    store.dispatch('contenttreestore/syncContenttree', {
      assemblyIdentifier,
      contenttreeID: routed_stage.value.stage.contenttree_id,
      oauthUserID: userid.value,
    });

    // earlier: in created section of mixin
    checkMilestones();
  }

  const groups = computed((): string[] => {
    return Object.keys(stages_by_groups);
  });

  const stages_by_groups = computed(
    (): Record<string, IStageTuple[]> | null => {
      const stages_by_groups = {};
      if (!assembly_sorted_stages.value) {
        return null;
      }
      assembly_sorted_stages.value.forEach((stage: IStageTuple) => {
        if (!stages_by_groups[stage.stage.group]) {
          stages_by_groups[stage.stage.group] = [];
        }
        stages_by_groups[stage.stage.group].push(stage);
      });

      return stages_by_groups;
    }
  );

  const groupsAccessible = computed((): string[] | undefined => {
    if (!assembly_accessible_stages.value) {
      return;
    }
    const groups = assembly_accessible_stages.value?.map(
      (stage) => stage.stage.group
    );
    return groups;
  });

  const testGroupsScheduled = computed((): any => {
    return assembly_scheduled_stages.value;
  });

  const groupsScheduled = computed((): string[] | undefined => {
    console.log('DEBUGGER, ', assembly_scheduled_stages.value);
    if (!assembly_scheduled_stages.value) {
      return;
    }
    const groups = assembly_scheduled_stages.value.map(
      (stage) => stage.stage.group
    );
    console.log('DEBUGGER, ', assembly_scheduled_stages.value, groups);
    return groups;
  });

  const routedStageGroup = computed((): string => {
    console.log('get Stage Group');
    if (!stageID.value || !routed_stage.value) {
      return 'preparation';
    }
    return routed_stage.value.stage.group;
  });

  const is_stage_first_shown = (stage): boolean | undefined => {
    console.assert(stage);
    console.assert(assembly_sorted_stages);
    if (!assembly_sorted_stages.value) {
      return undefined;
    }
    const len = assembly_sorted_stages.value.length - 1;
    return stage === assembly_sorted_stages[len];
  };

  const is_stage_last_shown = (stage): boolean => {
    console.assert(stage);
    if (!assembly_sorted_stages.value) {
      return false;
    }
    return stage === assembly_sorted_stages.value[0];
  };

  const getFirstOrRoutedStageIDByGroup = (group): number => {
    // console.assert(stages_by_groups);
    if (!stages_by_groups.value) {
      throw Error(
        'Could not find stage: stage groups are not yet loaded. refresh?'
      );
    }
    if (!Object.keys(stages_by_groups.value).includes(group)) {
      throw Error('Could not find stage: invalid stage group');
    }

    const localStageGroups: IStageTuple[] = stages_by_groups.value[group];
    if (!localStageGroups.length) {
      throw Error('Could not find stage: no stage found in given group');
    }
    if (routed_stage.value) {
      if (
        localStageGroups.find(
          (x) => routed_stage.value?.stage.id === x.stage.id
        )
      ) {
        return routed_stage.value.stage.id;
      }
    }

    // Get first stage wihtin group
    const stage: IStageTuple = localStageGroups[0];
    return stage.stage.id;
  };

  return {
    ready,
    assemblyMenuData,
    assembly,
    routed_stage,
    gotoStage,
    isFirstText,
    contenttreeID,
    milestone,
    markUnAlert,
    markCompleted,
    routedStageGroup,
    groups,
    testGroupsScheduled,
    nextScheduledStage,
    groupsScheduled,
    groupsAccessible,
    stages_by_groups,
    getFirstOrRoutedStageIDByGroup,
    is_stage_first_shown,
    is_stage_last_shown,
    isRoutedStageCompleted,
    isRoutedStageAlerted,
  };
  // };

  // if (output.value === null) {
  //   output.value = setup();
  // }

  // return output.value;
}

//     /**
//      * Clear all the data, that is linked to a certain user. => performed at logout
//      */
//     this.$root.clearUserData = () => {
//       this.$root.clearSession()
//       this.clearUserData()
//     }

//     this.$root.getAssemblyManageRoute = (assembly) => {
//       return ({
//         name: 'assembly_manage',
//         params: {
//           assemblyIdentifier: assembly.identifier
//         }
//       })
//     }

//     this.$root.gotoAssemblyManage = (assembly) => {
//       var route = this.$root.getAssemblyManageRoute(assembly);
//       this.$pushR(route)
//     }

// applyCssVarProfileColor(): Record<string, unknown> {
//   // This code apply writes the profile color into the css variable profilecolor.
//   // the variable is used for the css classes: .bg-profilecolor and .profilecolor
//   return {
//     '--profilecolor': this.profileColor,
//     '--profilecolor-light': this.lightProfileColor,
//   };
// },

// TODO: disabled due to vue 3 migration
// https://medium.com/@codetheorist/using-vuejs-computed-properties-for-dynamic-module-imports-2046743afcaf

//   return () => null;
// },
// is_assembly_page: function () {
//   return (
//     this.$route.name === 'assemblies' ||
//     !!this.$route.params.assemblyIdentifier
//   );
// },

// mounted() {

// if (this.is_assembly_page) {
// loadComponent();
// }

// <!-- MENU: for assembly views  -->
// <q-btn
//   size="lg"
//   flat
//   icon="mdi-menu"
//   label=""
//   v-if="is_assembly_page || $q.screen.lt.sm"
// >
//   <q-menu>
//     <q-list style="min-width: 100px">
//       <q-item
//         v-for="item in menu"
//         clickable
//         :key="item.text"
//         :class="
//           item.to.name == currentRoute
//             ? 'topmenuSelected'
//             : 'topmenuDefault'
//         "
//         @click="pushR(item.to)"
//         v-close-popup
//       >
//         <q-item-section>{{ item.text }}</q-item-section>
//       </q-item>
//     </q-list>
//   </q-menu>
// </q-btn>

// <!-- Left-Align: Small PAges -->
// <!-- <q-toolbar-title
//   v-if="$q.screen.lt.md && assemblyName"
//   @click="gotoAssemblyHome(assembly)"
//   class="cursor-pointer"
//   style=" font-weight:400"
// >
//   {{assemblyName}}
// </q-toolbar-title> -->
// <!-- {{assemblyName}} -->
// <!-- v-if="$q.screen.gt.xs "  -->
// <!-- Center: Large Pages -->
// <!-- v-if="$q.screen.gt.sm && assemblyName" -->

// <!-- TODO uncomment-->
// <!-- @click="$root.gotoAssemblyHome(assembly)" -->

// <q-toolbar-title
// shrink
// v-if="$q.screen.gt.sm && assemblyName"
// class="cursor-pointer"
// style="font-weight: 400"
// >
// {{ assemblyName }}
// </q-toolbar-title>

// // TODO: methods exist twice!!
// is_assembly_page: function () {
//   return (
//     this.$route.name === 'assemblies' ||
//     !!this.$route.params.assemblyIdentifier
//   );
// },

// frontpage: function () {
//   return this.$route.name == 'home';
// },
