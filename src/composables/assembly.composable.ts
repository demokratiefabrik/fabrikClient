/** DEMOKRATIFABRIK RUNTIME VARIABLES */
import { RouteLocationRaw } from 'vue-router';
import useOAuthEmitter from 'src/plugins/VueOAuth2PKCE/oauthEmitter';
import usePKCEComposable from 'src/plugins/VueOAuth2PKCE/pkce.composable';
import { readonly, Ref, computed, ref } from 'vue';
import { useStore } from 'vuex';
import useRouterComposable from './router.composable';
import useEmitter from 'src/utils/emitter';
// import useLibraryComposable from 'src/utils/library';
import library  from 'src/utils/library';
import { useRouter } from 'vue-router';
import { IStageGroup, IStageTuple } from 'src/models/stage';
import { IContributionLimits } from 'src/models/layout';
import useStoreComposable from './store.composable';

const oauthEmitter = useOAuthEmitter();
const { userid } = usePKCEComposable();
const emitter = useEmitter();
const { loaded } = library;

// let output: null | any = null;

const assemblyMenuData = ref<Record<string, IStageGroup> | null>(null);
const assemblyType = ref<string | null>(null);
const { setStageID, assemblyIdentifier, stageID } = useStoreComposable();

export default function useAssemblyComposable(caller = '') {
  // const setup = () => {
  console.log('DEBUG: useAssemblyComposable::SETUP', caller);
  const store = useStore();


  const {
    pushR,
    // assemblyIdentifier,
    currentRouteMeta,
    // stageID,
    clearSession,
    // setStageID,
  } = useRouterComposable();
  const { push } = useRouter();

  const get_stage_number_by_stage_id =
    store.getters['assemblystore/get_stage_number_by_stage_id'];
  const get_stage_number_by_stage =
    store.getters['assemblystore/get_stage_number_by_stage'];
  const assemblyStages = computed(
    (): Record<number, IStageTuple> =>
      store.getters['assemblystore/assemblyStages']
  );
  const last_accessible_stage = computed(
    () => store.getters['assemblystore/last_accessible_stage']
  );
  const IsManager = computed(() => store.getters['assemblystore/IsManager']);
  const assembly_sorted_stages = computed(
    () => store.getters['assemblystore/assembly_sorted_stages']
  );
  const assemblyProgression = computed(
    () => store.getters['assemblystore/assemblyProgression']
  );
  const assemblyConfiguration = computed(
    () => store.getters['assemblystore/assemblyConfiguration']
  );
  const assembly = computed(() => store.getters['assemblystore/assembly']);

  const find_next_accessible_stage = computed(
    () => store.getters['assemblystore/find_next_accessible_stage']
  );

  const showAssemblyMenu = computed(
    (): boolean =>
      !!assemblyType.value &&
      !currentRouteMeta.value?.hideAssemblyMenu &&
      !IsManager.value
  );

  const stage_nr_last_visited: Ref<number | null> = computed({
    get() {
      if (stageID.value === null || isNaN(stageID.value)) {
        return null;
      }
      console.log(
        'DEBUG: stage_nr_last_visited => vuex::get_stage_number_by_stage_id',
        stageID.value
      );
      return get_stage_number_by_stage_id(stageID.value) as number;
    },
    set(stageNr: number | null) {
      if (stageNr === null || stageNr === undefined) {
        setStageID(null);
      } else {
        const stageID = assembly_sorted_stages[stageNr as number].stage.id;
        // console.log("set stageID by stageNR", stageNr, stageID)
        setStageID(stageID);
      }
    },
  });

  // CONTENTTREE
  const daySessions = computed((): number => {
    return assemblyProgression.value?.number_of_day_sessions;
  });

  const ready = computed((): boolean => {
    const ready = loaded(assembly);
    if (ready) {
      emitter.emit('hideLoading');
    }
    return ready;
  });

  const stage_last_visited = computed((): IStageTuple | null => {
    if (stage_nr_last_visited.value === null) {
      return null;
    }
    return assembly_sorted_stages[stage_nr_last_visited.value];
  });

  const overallLimitForAddingProposalsReached = computed((): boolean | null => {
    const dailyContributionLimits = getDailyContributionLimits();
    if (!dailyContributionLimits) {
      return null;
    }
    const numberOfProposalLimits = dailyContributionLimits.number_of_proposals;
    const limitReached =
      numberOfProposalLimits.overallCurrent >=
      numberOfProposalLimits.overalllimit;
    return limitReached;
  });

  const limitForAddingProposalsReached = computed((): boolean | null => {
    const dailyAddingLimits = getDailyContributionLimits();
    if (!dailyAddingLimits) {
      return null;
    }
    const numberOfProposalLimits = dailyAddingLimits.number_of_proposals;
    const limitReached =
      numberOfProposalLimits.current >= numberOfProposalLimits.daylimit;
    return limitReached;
  });

  const limitForAddingCommentsReached = computed((): boolean | null => {
    if (IsManager.value) {
      return false;
    }

    const dailyAddingLimits = getDailyContributionLimits();
    if (!dailyAddingLimits) {
      return null;
    }
    const numberOfCommentsLimits = dailyAddingLimits.number_of_comments;
    const limitReached =
      numberOfCommentsLimits.current >= numberOfCommentsLimits.daylimit;
    return limitReached;
  });

  const syncPublicAssembly = () => {
    // sync public assembly...
    store.dispatch('publicindexstore/syncPublicIndex');
  };

  const syncUserAssembly = () => {
    // sync public assembly...
    if (assemblyIdentifier.value && userid.value) {
      console.log('syncAssembliesSync...');
      store.dispatch('assemblystore/syncAssembly', {
        oauthUserID: userid.value,
        assemblyIdentifier: assemblyIdentifier.value,
      });
    }
  };

  const setSyncIntervall = () => {
    // CREATE INTERVALL TO KEEP IN SYNC ASSEMBLY
    const intervallString: string = process.env
      .ENV_APISERVER_MONITOR_INTERVAL_SECONDS
      ? process.env.ENV_APISERVER_MONITOR_INTERVAL_SECONDS
      : '60';
    const intervall = (parseInt(intervallString) + 5) * 1000;
    // console.log(intervall);
    setInterval(() => {
      // INTERVALL SYNC
      syncPublicAssembly();
      syncUserAssembly();
    }, intervall * 1000);
  };

  const getStageRoute = (stage): RouteLocationRaw => {
    console.assert(stage);
    const params = {
      assemblyIdentifier: assemblyIdentifier.value,
      assemblyType: assemblyType.value,
      stageID: stage.stage.id,
      contenttreeID: stage.stage.contenttree_id,
    };

    return {
      name: `${stage.stage.type}__${assemblyType.value}`,
      params,
    };
  };

  const gotoStage = (stage): void => {
    console.assert(stage);
    console.log(getStageRoute(stage), 'ppppppppppppp')

    pushR(getStageRoute(stage));
  };

  const gotoNextStageNr = (stage): void => {
    console.assert(stage);
    // console.log('gotoNextStageNr');
    const currentStageGroup = stage.stage.group;

    const nextStage = find_next_accessible_stage.value(stage);
    if (!nextStage) {
      // console.log('NOTE: Assembly seems to be completed!');
      return;
    }
    const nextStageGroup = stage.stage.group;
    if (nextStageGroup !== currentStageGroup) {
      // different group: so make a new route...
      // console.log('ROUTERROUTE');
      push(`${nextStage.stage.id}/${nextStage.stage.group}`);
    } else {
      // just update , the "stage_nr_last_visited"
      // console.log(this.stage_nr_last_visited, "old stage")
      stage_nr_last_visited.value = get_stage_number_by_stage(nextStage);
      // console.log(stage_nr_last_visited.value, 'new stage');
    }
  };

  // TODO: what is that for?
  const gotoDefaultStageTeaser = (): void => {
    console.log('goto default stage teaser');
    if (stageID.value !== null && stageID.value !== undefined) {
      console.log(
        'DEBUG: gotoDefaultStageTeaser => vuex::get_stage_number_by_stage_id',
        stageID.value
      );
      stage_nr_last_visited.value = get_stage_number_by_stage_id(stageID.value);
    } else if (last_accessible_stage.value) {
      stage_nr_last_visited.value = get_stage_number_by_stage(
        last_accessible_stage.value
      );
    } else {
      stage_nr_last_visited.value = null;
    }
  };

  const getDailyContributionLimits = (): IContributionLimits | undefined => {
    const progression = assemblyProgression;
    const configuration = assemblyConfiguration;
    if (!configuration || !progression) {
      // can happen when logout
      return undefined;
    }

    return {
      number_of_proposals: {
        daylimit: configuration.value.MAX_DAILY_USER_PROPOSALS,
        overalllimit: configuration.value.MAX_OVERALL_USER_PROPOSALS,
        overallCurrent:
          progression.value.number_of_proposals === null
            ? 0
            : progression.value.number_of_proposals,
        current:
          progression.value.number_of_proposals_today === null
            ? 0
            : progression.value.number_of_proposals_today,
      },
      number_of_comments: {
        daylimit: configuration.value.MAX_DAILY_USER_COMMENTS,
        current:
          progression.value.number_of_comments_today === null
            ? 0
            : progression.value.number_of_comments_today,
      },
    };
  };

  const initialize = () => {
    console.log('DEBUG: INITIALIZE ASSEMBLY.COMP');
    oauthEmitter.on('AfterLogin', () => {
      clearSession();
      syncUserAssembly();
      setSyncIntervall();
    });
    oauthEmitter.on('RecycleLogin', () => {
      syncUserAssembly();
      setSyncIntervall();
    });

    syncPublicAssembly();
    syncUserAssembly();
  };

  const initializePlugin = (
    localAssemblyType: string,
    localAssemblyMenuData: Record<string, IStageGroup>
  ) => {
    // assemblyType
    assemblyType.value = localAssemblyType;
    assemblyMenuData.value = localAssemblyMenuData;
  };

  return {
    assemblyIdentifier,
    // assembly: toRefs(assembly),
    assembly,
    stageID: readonly(stageID),
    assembly_sorted_stages,
    assemblyStages,
    daySessions,
    ready,
    stage_last_visited,
    overallLimitForAddingProposalsReached,
    limitForAddingProposalsReached,
    limitForAddingCommentsReached,
    // pluginComposableFunction,

    // All other functions
    syncUserAssembly,
    // gotoAssemblyHome,
    initialize,
    gotoDefaultStageTeaser,
    // gotoAssemblyManage,
    getDailyContributionLimits,
    // clickBackToAssemblyListButton,
    gotoNextStageNr,
    gotoStage,

    // Plugin // assemblyMenu
    initializePlugin,
    showAssemblyMenu, // should assembly menu be shown?
    assemblyMenuData,
    assemblyType,
  };
  // };

  // if (output === null) {
  //   output = setup();
  // }

  // return output;
}
// }

// const stageTransition = (newVal, oldVal) => {
//   // this.scrollToStage()
// }
//
// const laggedScrollToStage = () => {
//   setTimeout(() => {
//     scrollToStage();
//   }, 200);
// };

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
// AssemblyMenuComponentLoader() {
//   if (this.showAssemblyMenu) {
//     // TODO: disabled. due to error
//     // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
//     // return () => import(`../plugins/${this.assemblyType}/Menu.vue`);
//   }
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

// enable or disable AssemblyMenu
// TODO: DW:
// this.showAssemblyMenu = false;
// const current = this.$currentRoute as any
// this.showAssemblyMenu = this.assemblyType &&
//   !current?.meta?.hideAssemblyMenu &&
//   !this.IsManager;
// }

//   <!-- MAIN MENU -->
//   <!-- TODO <div v-if="showAssemblyMenu">
//     <component
//       :is="AssemblyMenuComponentLoader"
//       :menuOffset="menuOffset"
//       v-if="is_assembly_page"
//     />
//   </div> -->
//   <!-- END DYNAMIC MENU -->

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
