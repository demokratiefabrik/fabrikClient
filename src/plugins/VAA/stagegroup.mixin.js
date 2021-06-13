
import { runtimeStore } from "src/store/runtime.store"
import constants from "src/utils/constants";
import StageGroupMixin from "../../mixins/stagegroup";

export default {
  mixins: [StageGroupMixin],
  data() {
    return {
      menu: {
        preparation: {
          name: "preparation",
          // disabled: this.groupsAccessible?.includes("preparation"),
          label: "Programm",
          toc_label: "Vorbereitung",
          description: "Sie erhalten hier die wichtigsten Informationen zur Könizer Demokratiefabrik. Umgekehrt benötigen wir auch einige Angaben von Ihnen.",
          icon: "mdi-information-outline",
          tooltip: "Sie finden hier das Demokratiefabrik-Programm.",
          expanded: (item) => this.next_scheduled_stage?.stage.group == 'preparation' || item.manual_expanded,
          expandable: true,
          manual_expanded: false,
          to: () => {
            return {
              name: "VAA",
              params: { assemblyIdentifier: runtimeStore.assemblyIdentifier },
            };
          },
        },

        topics: {
          name: "topics",
          label: "Themengebiete",
          icon: constants.ICONS.VAA_TOPIC,
          description: "Welche Themen sind Ihnen wichtig? Wie viel Gewicht soll den einzelnen politischen Themen im smartvote-Fragebogen beigemessen werden?",
          tooltip: "Welche Themen sind Ihnen wichtig? Wie viel Gewicht soll den einzelnen politischen Themen im smartvote-Fragebogen beigemessen werden?",
          // disabled: this.groupsAccessible?.includes("topics"),
          // tooltip: "Setzen Sie die Themen des Wahlkampfs.",
          expanded: () => false,
          to: () => {
            return {
              name: "VAA_TOPICS",
              params: {
                assemblyIdentifier: runtimeStore.assemblyIdentifier,
                stageID: this.getFirstOrRoutedStageIDByGroup("topics"),
              },
            };
          },
        },

        questions: {
          name: "questions",
          label: "Fragenkatalog",
          description: "Nun wird es konkret: Was möchten Sie von den Kandidatinnen und Kandidaten der Könizer Gemeindewahlen wissen, bevor Sie sie wählen?",
          icon: constants.ICONS.VAA_QUESTION,
          expanded: () => false,
          tooltip: "Bei welchen Sachfragen müssen die Kandidatinnen und Kandidaten mit Ihnen übereinstimmen, damit Sie sie wählen würden.",
          // tooltip:
          //   "Entscheiden, Sie über welche konkreten Fragen im Wahlkampf diskutiert werden soll.",
          to: () => {
            return {
              name: "VAA_QUESTIONS",
              params: {
                assemblyIdentifier: runtimeStore.assemblyIdentifier,
                stageID: this.getFirstOrRoutedStageIDByGroup("questions"),
              },
            };
          },
        },

        conclusion: {
          name: "conclusion",
          label: "Zwischenstand",
          description: "Hier stellen wir Ihnen erste, provisorische Resultate zusammen. Welche Fragen liegen vorn? Welche Themen sind den bisherigen Mitgliedern der Demokratiefabrik besonders wichtig?",
          tooltip: "Hier stellen wir Ihnen erste, provisorische Resultate zusammen. Welche Fragen liegen vorn? Welche Themen sind den bisherigen Mitgliedern der Demokratiefabrik besonders wichtig?",
          // disabled: this.groupsAccessible?.includes("conclusion"),
          icon: "mdi-flag-checkered",
          expanded: () => false,
          // tooltip:
          //   "Sie finden eine Übersicht über den aktuellen Stand der Online-Versammlung",
          to: () => {
            return {
              name: "VAA_CONCLUSION",
              params: {
                assemblyIdentifier: runtimeStore.assemblyIdentifier,
                stageID: this.getFirstOrRoutedStageIDByGroup("conclusion"),
              },
            };
          },
        },
      },
    }
  }
}