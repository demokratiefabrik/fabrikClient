/** DEMOKRATIFABRIK RUNTIME VARIABLES */
// import { RouteRecordRaw, LocationAsRelativeRaw, useRoute} from 'vue-router';
// import useOAuthEmitter from 'src/plugins/VueOAuth2PKCE/oauthEmitter';
// import usePKCEComposable from 'src/plugins/VueOAuth2PKCE/pkce.composable';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
// import { useRoute} from 'vue-router';
// import useRouterComposable from './router.composable';
import useEmitter from 'src/utils/emitter';
import useAssemblyComposable from './assembly.composable';
import useLibraryComposable from 'src/utils/library';
// import useAuthComposable from './auth.composable';
import usePKCEComposable from 'src/plugins/VueOAuth2PKCE/pkce.composable';
import { IStageTuple } from 'src/models/stage';
import useMonitorComposable from './monitor.composable';
import constants from 'src/utils/constants';
// const oauthEmitter = useOAuthEmitter();
// const { userid } = usePKCEComposable();
const assemblyIdentifier = ref<string | null>(null);
// const stageID = ref<number | null>(null);

export default function useStageComposable() {
  console.log('DEBUG: useStageComposable::SETUP');

  const store = useStore();
  const emitter = useEmitter();
  // const currentRoute = useRoute();

  // const { gotoAssemblyHome, stageID, assemblyIdentifier } = useAssemblyComposable();
  const { loaded } = useLibraryComposable();
  const { userid } = usePKCEComposable();
  const { gotoAssemblyHome, stageID } = useAssemblyComposable();
  const { monitorLog } = useMonitorComposable();

  // const currentRoute = useRoute();
  // const { pushR } = useRouterComposable();

  // const assembly_sorted_stages =
  //   store.getters['assemblystore/assembly_sorted_stages'];
  const assemblyStages = store.getters['assemblystore/assemblyStages'];
  const assembly_sorted_stages =
    store.getters['assemblystore/assembly_sorted_stages'];

  const is_stage_accessible =
    store.getters['assemblystore/is_stage_accessible'];
  // const assembly_accessible_stages =
  //   store.getters['assemblystore/assembly_accessible_stages'];
  // const assembly_scheduled_stages =
  //   store.getters['assemblystore/assembly_scheduled_stages'];
  const IsManager = store.getters['assemblystore/IsManager'];
  const is_stage_alerted = store.getters['assemblystore/is_stage_alerted'];
  const assembly = store.getters['assemblystore/assembly'];
  // const stageMilestoneWeigths = store.getters['assemblystore/stageMilestoneWeigths'];
  const stageMilestonesCompleted =
    store.getters['assemblystore/stageMilestonesCompleted'];

  const routed_stage = computed(() => {
    if (!stageID.value) {
      return null;
    }
    if (!assemblyStages) {
      return null;
    }
    return assemblyStages[stageID.value];
  });

  const ready = computed(() => {
    const ready = loaded(assemblyStages);
    if (ready) {
      emitter.emit('hideLoading');
    }

    if (!IsManager) {
      if (routed_stage.value && !is_stage_accessible(routed_stage)) {
        gotoAssemblyHome(assembly);
      }
    }

    return ready;
  });

  const contenttreeID = computed((): null | number => {
    // console.log("load contenttreeID in contentree.computed")
    // console.log("RETRIEVE contenttreeID..", this.routed_stage)
    if (!routed_stage.value?.stage?.contenttree_id) {
      return null;
    }
    return routed_stage.value?.stage?.contenttree_id;
  });

  const isFirstText = computed((): null | boolean => {
    const firstTextStage = Object.values(
      assembly_sorted_stages as Record<number, IStageTuple>
    ).find((stage) => stage?.stage.type === 'TEXTSHEET');
    return routed_stage.value == firstTextStage;
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

    store.dispatch('storeStageProgressionAlertFlag', {
      stageID: stage.stage.id,
      alerted: false,
    });
    // Fire (immediately), immediately
    const data = { stageID: stage.stage.id };
    monitorLog(constants.MONITOR_STAGE_UNALERT, data);
  };

  const markCompleted = () => {
    // Notify stage as completed
    if (!routed_stage.value.progression?.completed) {
      monitorLog(constants.MONITOR_STAGE_COMPLETED);
      store.dispatch('assemblystore/storeStageProgressionCompleted', {
        stageID: routed_stage.value.stage.id,
        completed: true,
      });
    }
  };

  const checkMilestones = () => {
    if (stageMilestonesCompleted) {
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
  // watch: {
  //   contenttreeID(to, from) {
  //     if (to) {
  //       this.$store.dispatch('contentstore/syncContenttree', {
  //         assemblyIdentifier: runtimeStore.assemblyIdentifier,
  //         contenttreeID: to,
  //         oauthUserID: this.oauth.userid
  //       })
  //     }
  //   },
  // },

  // MOUNTED
  // when stage has been loaded already
  if (routed_stage.value?.stage.contenttree_id && userid) {
    store.dispatch('contentstore/syncContenttree', {
      assemblyIdentifier,
      contenttreeID: routed_stage.value.stage.contenttree_id,
      oauthUserID: userid,
    });

    // earlier: in created section of mixin
    checkMilestones();
  }

  return {
    // currentGroup,
    // groups,
    ready,
    routed_stage,
    isFirstText,
    contenttreeID,
    milestone,
    markUnAlert,
    markCompleted,

    // next_scheduled_stage,
    // groupsScheduled,
    // groupsAccessible,
    // stages_by_groups,
    // getFirstOrRoutedStageIDByGroup,
    // is_stage_first_shown,
    // is_stage_last_shown,
  };
}
