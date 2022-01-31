/** DEMOKRATIFABRIK RUNTIME VARIABLES */
// import { RouteRecordRaw, LocationAsRelativeRaw, useRoute} from 'vue-router';
// import useOAuthEmitter from 'src/plugins/VueOAuth2PKCE/oauthEmitter';
// import usePKCEComposable from 'src/plugins/VueOAuth2PKCE/pkce.composable';
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute} from 'vue-router';
// import useRouterComposable from './router.composable';
import useEmitter from 'src/utils/emitter';
import useAssemblyComposable from './assembly.composable';
import useLibraryComposable from 'src/utils/library';
// import useAuthComposable from './auth.composable';
import usePKCEComposable from 'src/plugins/VueOAuth2PKCE/pkce.composable';

// const oauthEmitter = useOAuthEmitter();
// const { userid } = usePKCEComposable();
const assemblyIdentifier = ref<string | null>(null);
// const stageID = ref<number | null>(null);


export default function useStageComposable() {
  const store = useStore();
  const emitter = useEmitter();
    const currentRoute = useRoute();

  // const { gotoAssemblyHome, stageID, assemblyIdentifier } = useAssemblyComposable();
  const { loaded } = useLibraryComposable();
  const {userid} = usePKCEComposable();
  const { gotoAssemblyHome, setStageID, setAssemblyIdentifier, stageID} = useAssemblyComposable();

  // const currentRoute = useRoute();
  // const { pushR } = useRouterComposable();

  // const assembly_sorted_stages =
  //   store.getters['assemblystore/assembly_sorted_stages'];
  const assembly_stages = store.getters['assemblystore/assembly_stages'];
  const is_stage_accessible =
    store.getters['assemblystore/is_stage_accessible'];
  // const assembly_accessible_stages =
  //   store.getters['assemblystore/assembly_accessible_stages'];
  // const assembly_scheduled_stages =
  //   store.getters['assemblystore/assembly_scheduled_stages'];
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

  
  /* Set runtime variables: currently selected assembly and stage */
  watch(currentRoute, () => {

    if (currentRoute.params?.assemblyIdentifier) {
      setAssemblyIdentifier(currentRoute?.params?.assemblyIdentifier as string | null);

      if (currentRoute.params?.stageID !== null && currentRoute.params?.stageID !== undefined) {
        // TODO: redirect to asembly home, when stage is invalid
        setStageID(parseInt(currentRoute.params.stageID as string));
        emitter.emit('showLoading');
      }
    }
  });

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
        oauthUserID: userid
      })
    }


  return {
    // currentGroup,
    // groups,
    ready,
    routed_stage,
    // next_scheduled_stage,
    // groupsScheduled,
    // groupsAccessible,
    // stages_by_groups,
    // getFirstOrRoutedStageIDByGroup,
    // is_stage_first_shown,
    // is_stage_last_shown,
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
