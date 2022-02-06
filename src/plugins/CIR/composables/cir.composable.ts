/** DEMOKRATIFABRIK RUNTIME VARIABLES */

import useAssemblyComposable from 'src/composables/assembly.composable';
import constants from 'src/utils/constants';
import useStageComposable from 'src/composables/stage.composable';
import { ref } from 'vue';
import { IStageGroup } from 'src/models/stage';

const output = ref<null | any>(null);

export default function useCIRComposable() {
  // const initialize = () => {
  // };
  const setup = () => {
    const { assemblyIdentifier } = useAssemblyComposable('');
    const { nextScheduledStage, getFirstOrRoutedStageIDByGroup } =
      useStageComposable();

    const assemblyMenu: Record<string, IStageGroup> = {
      preparation: {
        name: 'preparation',
        label: 'Programm',
        toc_label: 'Vorbereitung',
        description:
          'Sie erhalten hier die wichtigsten Informationen zur Könizer Demokratiefabrik. Umgekehrt benötigen wir auch einige Angaben von Ihnen.',
        icon: 'mdi-information-outline',
        tooltip: 'Sie finden hier das Demokratiefabrik-Programm.',
        expanded: (item) =>
          nextScheduledStage?.stage.group == 'preparation' ||
          item.manual_expanded,
        expandable: true,
        manual_expanded: false,
        to: () => {
          return {
            name: 'VAA',
            params: { assemblyIdentifier },
          };
        },
      },

      topics: {
        name: 'topics',
        label: 'Meinungsaustausch',
        icon: constants.ICONS.VAA_TOPIC,
        description:
          'Erfahren Sie alles über die Position der anderen Teilnehmenden. Sie sind mir deren Meinung einverstanden?',
        tooltip:
          'Erfahren Sie alles über die Position der anderen Teilnehmenden. Sie sind mir deren Meinung einverstanden?',
        expanded: () => false,
        to: () => {
          return {
            name: 'CIR_VOICE',
            params: {
              assemblyIdentifier,
              stageID: getFirstOrRoutedStageIDByGroup('voice'),
            },
          };
        },
      },

      questions: {
        name: 'arguments',
        label: 'Argumentarium',
        description:
          'Nun wird es konkret: Was genau sind für Sie die wichtigsten Argumente die Vorlage anzunehmen oder abzulehnen. Für welche Argumente bringen Sie am meisten Verständnis auf?',
        icon: constants.ICONS.VAA_QUESTION,
        expanded: () => false,
        tooltip:
        'Nun wird es konkret: Was genau sind für Sie die wichtigsten Argumente die Vorlage anzunehmen oder abzulehnen. Für welche Argumente bringen Sie am meisten Verständnis auf?',
        to: () => {
          return {
            name: 'CIR_ARGUMENTS',
            params: {
              assemblyIdentifier: assemblyIdentifier,
              stageID: getFirstOrRoutedStageIDByGroup('arguments'),
            },
          };
        },
      },

      conclusion: {
        name: 'conclusion',
        label: 'Zwischenstand',
        description:
        'Hier stellen wir Ihnen erste, provisorische Resultate zusammen. Welche Argumente liegen vorn? Welche anderen Teilnehmende stimmen mit Ihner Position am meisten überein?',
        tooltip:
        'Hier stellen wir Ihnen erste, provisorische Resultate zusammen. Welche Argumente liegen vorn? Welche anderen Teilnehmende stimmen mit Ihner Position am meisten überein?',
        // disabled: this.groupsAccessible?.includes("conclusion"),
        icon: 'mdi-flag-checkered',
        expanded: () => false,
        to: () => {
          return {
            name: 'CIR_CONCLUSION',
            params: {
              assemblyIdentifier: assemblyIdentifier,
              stageID: getFirstOrRoutedStageIDByGroup('conclusion'),
            },
          };
        },
      },
    };

    return {
      assemblyMenu,
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

//     this.gotoAssemblyManage = (assembly) => {
//       var route = this.getAssemblyManageRoute(assembly);
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
// <!-- @click="gotoAssemblyHome(assembly)" -->

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
