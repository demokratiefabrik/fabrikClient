/** DEMOKRATIFABRIK RUNTIME VARIABLES */
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import useEmitter from 'src/utils/emitter';
import useAssemblyComposable from './assembly.composable';
import useLibraryComposable from 'src/utils/library';
import { IStageTuple } from 'src/models/stage';
import { IAssemblyTuple } from 'src/models/assembly';

export interface IStageGroup {
  name: string;
  disabled?: boolean;
  label: string;
  toc_label?: string;
  description: string;
  icon: string;
  tooltip?: string;
  expanded?: (item) => boolean;
  expandable?: boolean;
  manual_expanded?: boolean;
  to: () => any; // TODO. add route interface
}

const output = ref<null | any>(null);

export default function useStagesComposable() {
  const setup = () => {
    console.log('DEBUG: useStagesComposable::SETUP');

    const store = useStore();
    const emitter = useEmitter();
    const { gotoAssemblyHome, stageID } = useAssemblyComposable('stages.comp');
    const { loaded } = useLibraryComposable();

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
    const assembly = computed(
      (): IAssemblyTuple => store.getters['assemblystore/assembly']
    );

    const is_stage_accessible =
      store.getters['assemblystore/is_stage_accessible'];

    const next_scheduled_stage = computed(
      (): IStageTuple | null =>
        store.getters['assemblystore/next_scheduled_stage']
    );

    const routed_stage = computed((): IStageTuple | null => {
      if (!stageID.value) {
        return null;
      }
      if (!assemblyStages.value) {
        return null;
      }
      return assemblyStages[stageID.value];
    });

    const ready = computed((): boolean => {
      const ready = loaded(assemblyStages);
      if (ready) {
        emitter.emit('hideLoading');
      }

      if (!IsManager.value) {
        if (routed_stage.value && !is_stage_accessible(routed_stage)) {
          gotoAssemblyHome(assembly);
        }
      }

      return ready;
    });

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

    const groupsScheduled = computed((): string[] | undefined => {
      if (!assembly_scheduled_stages.value) {
        return;
      }
      const groups = assembly_scheduled_stages.value.map(
        (stage) => stage.stage.group
      );
      return groups;
    });

    const currentGroup = computed((): string => {
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
      console.assert(stages_by_groups);
      if (routed_stage.value) {
        if (
          stages_by_groups[group].find(
            (x) => routed_stage.value?.stage.id === x.stage.id
          )
        ) {
          return routed_stage.value.stage.id;
        }
      }
      console.assert(stages_by_groups[group]);
      console.assert(stages_by_groups[group][0]);
      return stages_by_groups[group][0].stage.id;
    };

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
  };
  if (output.value === null) {
    output.value = setup();
  }

  return output.value;
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
