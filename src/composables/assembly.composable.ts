/** DEMOKRATIFABRIK RUNTIME VARIABLES */
import { RouteLocationRaw } from 'vue-router';
import useOAuthEmitter from 'src/plugins/VueOAuth2PKCE/oauthEmitter';
import usePKCEComposable from 'src/plugins/VueOAuth2PKCE/pkce.composable';
import { readonly, Ref, computed } from 'vue';
import { useStore } from 'vuex';
import useRouterComposable from './router.composable';
import useEmitter from 'src/utils/emitter';
import useLibraryComposable from 'src/utils/library';
import { useRouter } from 'vue-router';
import { IStageTuple } from 'src/models/stage';
// import { RouteLocation } from 'src/models/layout';

// import { get_stage_number_by_stage_id } from 'src/store/assemblystore/getters';

export interface IContributionLimits {
  number_of_proposals: {
    daylimit: number;
    overalllimit: number;
    overallCurrent: number;
    current: number;
  };
  number_of_comments: {
    daylimit: number;
    current: number;
  };
}

const oauthEmitter = useOAuthEmitter();
const { userid } = usePKCEComposable();

// ADD ASSEMBLY TYPES
// export const installedAssemblyPlugins = ref<string[]>([])


export default function useAssemblyComposable() {

  console.log('DEBUG: useAssemblyComposable::SETUP');

  // const installAssemblyPlugin = (plugin: string): void => {
  //   installedAssemblyPlugins.value.push(plugin)
  // }
  
  
  const store = useStore();
  // const currentRoute = useRoute();
  const emitter = useEmitter();
  const { pushR, assemblyIdentifier, stageID, clearSession, setStageID } =
    useRouterComposable();
  const get_stage_number_by_stage_id =
    store.getters['assemblystore/get_stage_number_by_stage_id'];
  const get_stage_number_by_stage =
    store.getters['assemblystore/get_stage_number_by_stage'];
  const assemblyStages = store.getters['assemblystore/assemblyStages'];
  const last_accessible_stage =
    store.getters['assemblystore/last_accessible_stage'];
  const IsManager = store.getters['assemblystore/IsManager'];
  const assembly_sorted_stages =
    store.getters['assemblystore/assembly_sorted_stages'];
  const assemblyProgression =
    store.getters['assemblystore/assemblyProgression'];
  const assemblyConfiguration =
    store.getters['assemblystore/assemblyConfiguration'];
  const assembly = store.getters['assemblystore/assembly'];
  const find_next_accessible_stage =
    store.getters['assemblystore/find_next_accessible_stage'];

  const { loaded } = useLibraryComposable();

  const { push } = useRouter();

  const initialize = () => {
    oauthEmitter.on('AfterLogin', () => {
      clearSession();
      syncUserAssembly();
      setSyncIntervall();
    });
    oauthEmitter.on('RecycleLogin', () => {
      syncUserAssembly();
      setSyncIntervall();
    });

    // INITIAL SYNC of Public Assembly (no authentication needed)
    syncPublicAssembly();
  };

  const syncPublicAssembly = () => {
    // console.log('syncAssembliesSync...')
    // sync public assembly...
    store.dispatch('publicindexstore/syncPublicIndex');
  };

  const syncUserAssembly = () => {
    // console.log('syncAssembliesSync...')
    // sync public assembly...
    if (assemblyIdentifier.value && userid.value) {
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
    }, intervall);
  };

  const getAssemblyHomeRoute = (
    assembly
  ): RouteLocationRaw => {
    if (!assembly) {
      return {
        name: 'home',
      } as RouteLocationRaw;
    }

    return {
      name: assembly.type,
      params: { assemblyIdentifier: assembly.identifier },
    } as RouteLocationRaw
  };


  
  const getAssemblyManageRoute = (
    assembly
  ): RouteLocationRaw => {
    if (!assembly) {
      return {
        name: 'home',
      } as RouteLocationRaw;
    }

    return {
      name: 'assembly_manage',
      params: { assemblyIdentifier: assembly.identifier },
    } as RouteLocationRaw
  };

  
  const gotoAssemblyHome = (assembly) => {
    const route = getAssemblyHomeRoute(assembly);
    pushR(route);
  };


  const gotoAssemblyManage = (assembly) => {
    var route = getAssemblyManageRoute(assembly);
    pushR(route)
  }


  const stage_nr_last_visited: Ref<number | null>  = computed({
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
    }
  });

  // CONTENTTREE
  const daySessions = computed((): number => {
    return assemblyProgression?.number_of_day_sessions;
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
    if (IsManager) {
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

  const clickBackToAssemblyListButton = (): void => {
    // setAssemblyIdentifier(null);
    push({ name: 'assemblies' });
  };

  // const stageTransition = (newVal, oldVal) => {
  //   // this.scrollToStage()
  // }
  //
  // const laggedScrollToStage = () => {
  //   setTimeout(() => {
  //     scrollToStage();
  //   }, 200);
  // };

  const gotoNextStageNr = (stage): void => {
    console.assert(stage);
    // console.log('gotoNextStageNr');
    const currentStageGroup = stage.stage.group;

    const nextStage = find_next_accessible_stage(stage);
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

  const gotoStage = (stage): void => {
    console.assert(stage);
    push(getStageRoute(stage));
  };

  const getStageRoute = (stage): RouteLocationRaw => {
    console.assert(stage);
    const params = {
      assemblyIdentifier: assemblyIdentifier.value,
      stageID: stage.stage.id,
      contenttreeID: stage.stage.contenttree_id,
    };

    return {
      name: stage.stage.type,
      params,
    };
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
    // console.log("Assembly PROG", progression)
    // console.log("Configuration", configuration)

    if (!configuration || !progression) {
      // can happen when logout
      return undefined;
    }

    return {
      number_of_proposals: {
        daylimit: configuration.MAX_DAILY_USER_PROPOSALS,
        overalllimit: configuration.MAX_OVERALL_USER_PROPOSALS,
        overallCurrent:
          progression.number_of_proposals === null
            ? 0
            : progression.number_of_proposals,
        current:
          progression.number_of_proposals_today === null
            ? 0
            : progression.number_of_proposals_today,
      },
      number_of_comments: {
        daylimit: configuration.MAX_DAILY_USER_COMMENTS,
        current:
          progression.number_of_comments_today === null
            ? 0
            : progression.number_of_comments_today,
      },
    };
  };

  // // WHEN MOUNTED
  store.dispatch('assemblystore/syncAssembly', {
    oauthUserID: userid,
    assemblyIdentifier: assemblyIdentifier,
  });

  console.log('DEBUG: end of assembly composable');

  return {
    clearSession,
    gotoAssemblyHome,
    initialize,
    gotoDefaultStageTeaser,
    // next_scheduled_stage,
    // getFirstOrRoutedStageIDByGroup,
    assemblyIdentifier: readonly(assemblyIdentifier),
    assembly_sorted_stages,
    // setAssemblyIdentifier,
    stageID,
    gotoAssemblyManage,
    assembly,
    assemblyStages,
    // setStageID,
    daySessions,
    ready,
    stage_last_visited,
    getDailyContributionLimits,
    overallLimitForAddingProposalsReached,
    limitForAddingProposalsReached,
    limitForAddingCommentsReached,
    clickBackToAssemblyListButton,
    // laggedScrollToStage,
    gotoNextStageNr,
    gotoStage
  };
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
