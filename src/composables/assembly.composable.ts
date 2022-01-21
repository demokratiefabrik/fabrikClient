/** DEMOKRATIFABRIK RUNTIME VARIABLES */
import useOAuthEmitter from 'src/plugins/VueOAuth2PKCE/oauthEmitter';
import usePKCEComposable from 'src/plugins/VueOAuth2PKCE/pkce.composable';
import { ref, readonly } from 'vue';
import { useStore } from 'vuex';

const oauthEmitter = useOAuthEmitter();
const { userid } = usePKCEComposable();
const assemblyIdentifier = ref<string | null>(null);
const stageID = ref<number | null>(null);


export default function useAssemblyComposable() {
  const store = useStore();

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

  const setAssemblyIdentifier = (identifier: string | null) =>
    (assemblyIdentifier.value = identifier);

  const setStageID = (id: number | null) => (stageID.value = id);

  const clearSession = () => {
    setStageID(null);
    setAssemblyIdentifier(null);
  };

  //     /**
  //      * Clear all the data, that is linked to a certain user. => performed at logout
  //      */
  //     this.$root.clearUserData = () => {
  //       this.$root.clearSession()
  //       this.clearUserData()
  //     }

  //     this.$root.getAssemblyHomeRoute = (assembly) => {
  //       // console.log("get assembly route ", assembly)
  //       if (!assembly) {
  //         return ({
  //           name: 'home',
  //         })

  //       }
  //       return ({
  //         name: assembly.type,
  //         params: { assemblyIdentifier: assembly.identifier }
  //       })
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

  //     this.$root.gotoAssemblyHome = (assembly) => {

  //       var route = this.$root.getAssemblyHomeRoute(assembly);
  //       this.$pushR(route)
  //     }

  return {
    clearSession,
    initialize,
    assemblyIdentifier: readonly(assemblyIdentifier),
    setAssemblyIdentifier,
    stageID,
    setStageID,
  };
}

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
//   @click="$root.gotoAssemblyHome(assembly)"
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
