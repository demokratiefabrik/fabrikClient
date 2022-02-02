/** DEMOKRATIFABRIK RUNTIME VARIABLES */

import useAssemblyComposable from 'src/composables/assembly.composable';
import constants from 'src/utils/constants';
import useStagesComposable, {
  IStageGroup,
} from 'src/composables/stages.composable';
import { ref } from 'vue';

const output = ref<null | any>(null);

export default function useCIRComposable() {
  // const initialize = () => {
  // };
  const setup = () => {
    const { assemblyIdentifier } = useAssemblyComposable('');
    const { next_scheduled_stage, getFirstOrRoutedStageIDByGroup } =
      useStagesComposable();

    const assemblyMenu: Record<string, IStageGroup> = {
      preparation: {
        name: 'preparation',
        // disabled: this.groupsAccessible?.includes("preparation"),
        label: 'Programm',
        toc_label: 'Vorbereitung',
        description:
          'Sie erhalten hier die wichtigsten Informationen zur Könizer Demokratiefabrik. Umgekehrt benötigen wir auch einige Angaben von Ihnen.',
        icon: 'mdi-information-outline',
        tooltip: 'Sie finden hier das Demokratiefabrik-Programm.',
        expanded: (item) =>
          next_scheduled_stage?.stage.group == 'preparation' ||
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
        label: 'Themengebiete',
        icon: constants.ICONS.VAA_TOPIC,
        description:
          'Welche Themen sind Ihnen wichtig? Wie viel Gewicht soll den einzelnen politischen Themen im smartvote-Fragebogen beigemessen werden?',
        tooltip:
          'Welche Themen sind Ihnen wichtig? Wie viel Gewicht soll den einzelnen politischen Themen im smartvote-Fragebogen beigemessen werden?',
        // disabled: this.groupsAccessible?.includes("topics"),
        // tooltip: "Setzen Sie die Themen des Wahlkampfs.",
        expanded: () => false,
        to: () => {
          return {
            name: 'VAA_TOPICS',
            params: {
              assemblyIdentifier,
              stageID: getFirstOrRoutedStageIDByGroup('topics'),
            },
          };
        },
      },

      questions: {
        name: 'questions',
        label: 'Fragenkatalog',
        description:
          'Nun wird es konkret: Was möchten Sie von den Kandidatinnen und Kandidaten der Könizer Gemeindewahlen wissen, bevor Sie sie wählen?',
        icon: constants.ICONS.VAA_QUESTION,
        expanded: () => false,
        tooltip:
          'Bei welchen Sachfragen müssen die Kandidatinnen und Kandidaten mit Ihnen übereinstimmen, damit Sie sie wählen würden.',
        // tooltip:
        //   "Entscheiden, Sie über welche konkreten Fragen im Wahlkampf diskutiert werden soll.",
        to: () => {
          return {
            name: 'VAA_QUESTIONS',
            params: {
              assemblyIdentifier: assemblyIdentifier,
              stageID: getFirstOrRoutedStageIDByGroup('questions'),
            },
          };
        },
      },

      conclusion: {
        name: 'conclusion',
        label: 'Zwischenstand',
        description:
          'Hier stellen wir Ihnen erste, provisorische Resultate zusammen. Welche Fragen liegen vorn? Welche Themen sind den bisherigen Mitgliedern der Demokratiefabrik besonders wichtig?',
        tooltip:
          'Hier stellen wir Ihnen erste, provisorische Resultate zusammen. Welche Fragen liegen vorn? Welche Themen sind den bisherigen Mitgliedern der Demokratiefabrik besonders wichtig?',
        // disabled: this.groupsAccessible?.includes("conclusion"),
        icon: 'mdi-flag-checkered',
        expanded: () => false,
        // tooltip:
        //   "Sie finden eine Übersicht über den aktuellen Stand der Online-Versammlung",
        to: () => {
          return {
            name: 'VAA_CONCLUSION',
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
