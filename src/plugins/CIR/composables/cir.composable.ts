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

    const assemblyMenuData: Record<string, IStageGroup> = {
      preparation: {
        name: 'preparation',
        label: 'Programm',
        toc_label: 'Vorbereitung',
        description:
          'Sie erhalten hier die wichtigsten Informationen zur Könizer Demokratiefabrik. Umgekehrt benötigen wir auch einige Angaben von Ihnen.',
        icon: 'mdi-information-outline',
        tooltip: 'Sie finden hier das Demokratiefabrik-Programm.',
        expanded: (item) =>
          nextScheduledStage?.value?.stage.group == 'preparation' ||
          item.manual_expanded,
        expandable: true,
        manual_expanded: false,
        to: () => {
          return {
            name: 'CIR',
            params: { 
              assemblyIdentifier: assemblyIdentifier.value
            },
          };
        },
      },

      voice: {
        name: 'voice',
        label: 'Meinungsaustausch',
        icon: constants.ICONS.VAA_TOPIC,
        description:
          'Erfahren Sie alles über die Position der anderen Teilnehmenden. Sie sind mir deren Meinung einverstanden?',
        tooltip:
          'Erfahren Sie alles über die Position der anderen Teilnehmenden. Sie sind mir deren Meinung einverstanden?',
        expanded: () => false,
        to: () => {
          return {
            name: 'VOICE__CIR',
            params: {
              assemblyIdentifier: assemblyIdentifier.value,
              stageID: getFirstOrRoutedStageIDByGroup('voice'),
            },
          };
        },
      },

      arguments: {
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
            name: 'ARGUMENTS__CIR',
            params: {
              assemblyIdentifier: assemblyIdentifier.value,
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
            name: 'CONCLUSION',
            params: {
              assemblyIdentifier: assemblyIdentifier.value,
              stageID: getFirstOrRoutedStageIDByGroup('conclusion'),
            },
          };
        },
      },
    };

    return {
      assemblyMenuData,
    };
  };

  if (output.value === null) {
    output.value = setup();
  }

  return output.value;
}
