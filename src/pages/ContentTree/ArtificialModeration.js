const AMs = {

  indexTopBasic: {
    id: 'indexTopBasic',
    loading: (ctx) => !ctx.node.children,
    items: [
      {
        id: 1,
        condition: (ctx) => ctx.node.nof_descendants === 0,
        prosa: 'Nichts bisher',
        body: (ctx) => `Noch hat niemand hierzu etwas geschrieben. Möchten Sie den Anfang machen?`,
      },
      // {
      //   id: 2,
      //   condition: (ctx) => ctx.node.nof_descendants === 0,
      //   prosa: 'Nichts bisher',
      //   body: (ctx) => `Sie können hier auch eine Frage stellen. Die anderen Teilnehmenden oder die Organisatoren werden sie sehr bald beantworten.`,
      // },
      {
        id: 3,
        condition: (ctx) => ctx.node.nof_descendants >= 7,
        prosa: 'Schon alles gesagt?',
        body: (ctx) => `Hier wurde schon einiges geschrieben. Möchten Sie die Diskussionen ergänzen?`,
      },
      {
        id: 4,
        prosa: 'Mehr als drei ungelesene Beiträge',
        condition: (ctx) => ctx.node.nof_descendants_unread > 3,
        body: (ctx) => `Da gibt es viele neue Beiträge in diesem Forum. Wollen Sie sich mal umsehen?`,
      },
      {
        id: 5,
        prosa: 'Ein ungelesener Beitrag',
        condition: (ctx) => ctx.node.nof_descendants_unread === 1,
        body: (ctx) => `Hier gibt es ein ungelesener Beitrag. Möchten Sie den lesen?`,
      },
      {
        id: 6,
        prosa: 'Es gibt zwei, drei ungelesene Beiträge',
        condition: (ctx) => ctx.node.nof_descendants_unread > 1 && ctx.node.nof_descendants_unread <= 3,
        body: (ctx) => `Einige Beiträge sind neu hier. Sehen Sie sich nur um.`,
      }
    ]
  },



  indexTopBasicDefaultExtension: {
    id: 'indexTopBasicDefaultExtension',
    prosa: "Ergänzt die indexTop AMs sofern keine anderen custom AMs mitgegeben wurden. => Zugeschnitten auf generelle Diskussion zu einem spezifischen Text/Thema",
    loading: (ctx) => !ctx.node.children,
    items: [
      {
        id: 1,
        condition: (ctx) => ctx.node.nof_descendants === 0,
        prosa: 'Nichts bisher',
        body: (ctx) => `Machen Sie hier den Anfang? Was denken Sie zu diesem Thema?`,
      },
      {
        id: 2,
        condition: (ctx) => ctx.node.nof_descendants > 0 && ctx.node.nof_descendants < 7,
        prosa: 'Gibt es Dinge, die Sie zum gelesenen Text noch erläutern möchten. Haben Sie Fragen dazu?',
        body: (ctx) => `Gibt es Dinge, die Sie noch erläutern möchten? Haben Sie Fragen? Schreiben Sie doch einen Beitrag?`,
      }
    ]
  }
}


// < !--ACTION CHIPS -->
//   <template v-slot:actions>
//     <q-chip
//       v-if="rootNode.children.length < 2 && IsContributor"
//       icon="mdi-tooltip-plus-outline"
//       clickable
//         @click="popup_create"
//       >
//         {{ $t('contenttree.add_comment_or_question') }}
export default AMs