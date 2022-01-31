/** DEMOKRATIFABRIK RUNTIME VARIABLES */
// import { RouteRecordRaw, LocationAsRelativeRaw, useRoute} from 'vue-router';
// import useOAuthEmitter from 'src/plugins/VueOAuth2PKCE/oauthEmitter';
// import usePKCEComposable from 'src/plugins/VueOAuth2PKCE/pkce.composable';
import { computed } from 'vue';
import { useStore } from 'vuex';
// import useRouterComposable from './router.composable';
import useEmitter from 'src/utils/emitter';
import useAssemblyComposable from './assembly.composable';
import useLibraryComposable from 'src/utils/library';

// const oauthEmitter = useOAuthEmitter();
// const { userid } = usePKCEComposable();
// const assemblyIdentifier = ref<string | null>(null);
// const stageID = ref<number | null>(null);

export interface IStageGroup{
  name: string;
  disabled?: boolean;
  label: string;
  toc_label?: string;
  description:string;
  icon: string;
  tooltip?: string;
  expanded?: (item) => boolean;
  expandable?: boolean;
  manual_expanded?: boolean;
  to: () => any; // TODO. add route interface
}


export default function useStagesComposable() {
  const store = useStore();
  const emitter = useEmitter();
  const { gotoAssemblyHome, stageID } = useAssemblyComposable();
  const { loaded } = useLibraryComposable();

  // const currentRoute = useRoute();
  // const { pushR } = useRouterComposable();

  const assembly_sorted_stages =
    store.getters['assemblystore/assembly_sorted_stages'];
  const assembly_stages = store.getters['assemblystore/assembly_stages'];
  const is_stage_accessible =
    store.getters['assemblystore/is_stage_accessible'];
  const assembly_accessible_stages =
    store.getters['assemblystore/assembly_accessible_stages'];
  const assembly_scheduled_stages =
    store.getters['assemblystore/assembly_scheduled_stages'];
  const IsManager = store.getters['assemblystore/IsManager'];
  const assembly = store.getters['assemblystore/assembly'];


  const routed_stage = computed(() => {
    if (!stageID.value) {
      return null;
    }
    if (!assembly_stages) {
      return null;
    }
    return assembly_stages[stageID.value];
  });

  const ready = computed(() => {
    const ready = loaded(assembly_stages);
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

  const groups = computed(() => {
    return Object.keys(stages_by_groups);
  });

  const stages_by_groups = computed(() => {
    const stages_by_groups = {};
    if (!assembly_stages) {
      return null;
    }

    Object.values(assembly_sorted_stages).forEach((stage: any) => {
      if (!stages_by_groups[stage.stage.group]) {
        stages_by_groups[stage.stage.group] = [];
      }
      stages_by_groups[stage.stage.group].push(stage);
    });

    return stages_by_groups;
  });

  const groupsAccessible = computed(() => {
    if (!assembly_scheduled_stages) {
      return;
    }
    const groups = assembly_accessible_stages.map((stage) => stage.stage.group);
    return groups;
  });

  const groupsScheduled = computed(() => {
    if (!assembly_scheduled_stages) {
      return;
    }
    const groups = assembly_scheduled_stages.map((stage) => stage.stage.group);
    return groups;
  });

  const currentGroup = computed(() => {
    console.log('get Stage Group');
    if (!stageID.value || !routed_stage.value) {
      return 'preparation';
    }
    return routed_stage.value.stage.group;
  });

  const is_stage_first_shown = (stage) => {
    console.assert(stage);
    console.assert(assembly_sorted_stages)
    return stage === assembly_sorted_stages[assembly_sorted_stages.length - 1];
  };

  const is_stage_last_shown = (stage) => {
    console.assert(stage);
    return stage === assembly_sorted_stages[0];
  };

  const getFirstOrRoutedStageIDByGroup = (group) => {
    console.assert(stages_by_groups);
    if (routed_stage.value) {
      if (
        stages_by_groups[group].find(
          (x) => routed_stage.value.stage.id === x.stage.id
        )
      ) {
        return routed_stage.value.stage.id;
      }
    }
    console.assert(stages_by_groups[group]);
    console.assert(stages_by_groups[group][0]);
    return stages_by_groups[group][0].stage.id;
  };


  const next_scheduled_stage = store.getters['assemblystore/next_scheduled_stage']

  // const next_scheduled_stage = computed(() => {
  //   return  store.getters['assemblystore/next_scheduled_stage'];
  // });
  // const getFirstOrRoutedStageIDByGroup = computed(() => {
  //   return  store.getters['assemblystore/getFirstOrRoutedStageIDByGroup'];
  // });

  return {
    currentGroup,
    groups,
    ready,
    routed_stage,
    next_scheduled_stage,
    groupsScheduled,
    groupsAccessible,
    stages_by_groups,
    getFirstOrRoutedStageIDByGroup,
    is_stage_first_shown,
    is_stage_last_shown,
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
// const current = this.$router.currentRoute as any
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
