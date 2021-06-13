const AMs = {

  index_top: {
    id: 'index_top',
    prosa: ' Leitet eine Text-Stage ein.',
    loading: (ctx) => !ctx.routed_stage?.stage.id,
    items: [
      {
        id: 10,
        prosa: 'Irgendwann, nachdem rundgang zu Ende ist.',
        condition: (ctx) => !ctx.next_scheduled_stage,
        body: (ctx) => `Sie können sich das ruhig nochmal anschauen.`,
        buttons: [
          {
            action: (ctx) => {
              ctx.$root.gotoAssemblyHome(ctx.assembly)
            },
            label: (ctx) => 'Zurück zum Programm'
          }
        ]
      },
      {
        id: 1,
        prosa: ' Erste Stage, Erster Besuch am ersten Tag!.',
        condition: (ctx) => ctx.is_stage_alerted(ctx.routed_stage) && ctx.isFirstText && ctx.next_scheduled_stage,
        body: (ctx) => `Wir beginnen mit folgendem Text. Bitte lesen Sie diese Informationen zum Projekt kurz durch.`,
      },
      {
        id: 2,
        prosa: ' Spätere Stage: Erster Besuch am ersten Tag!.',
        condition: (ctx) => ctx.is_stage_alerted(ctx.routed_stage) && !ctx.isFirstText && ctx.next_scheduled_stage,
        body: (ctx) => `Auch dieser Text ist uns wichtig. Bitte lesen Sie auch diesen kurz durch.`,
      },
      {
        id: 3,
        prosa: ' Zweiter Besuch',
        condition: (ctx) => !ctx.is_stage_alerted(ctx.routed_stage) && ctx.next_scheduled_stage,
        body: (ctx) => `Sie können sich das ruhig nochmal anschauen.`,
        buttons: [
          {
            action: (ctx) => {
              ctx.markUnAlert(); ctx.gotoStage(ctx.next_scheduled_stage)
            },
            label: (ctx) => 'Lieber jetzt gleich weiterfahren'
          }
        ]
      }
    ]
  },

  index_bottom: {
    id: 'index_bottom',
    prosa: ' Schliesst die Text-Stage ab.',
    loading: (ctx) => !ctx.routed_stage?.stage.id,
    items: [
      {
        id: 10,
        prosa: 'Irgendwann, nachdem Rundgang zu Ende ist.',
        condition: (ctx) => !ctx.next_scheduled_stage,
        body: (ctx) => `Hier geht es zurück zum Programm.`,
        buttons: [
          {
            action: (ctx) => {
              ctx.$root.gotoAssemblyHome(ctx.assembly)
            },
            label: (ctx) => 'zum Programm'
          }
        ]
      },
      {
        id: 1,
        prosa: ' Erster Besuch am ersten Tag!.',
        condition: (ctx) => ctx.is_stage_alerted(ctx.routed_stage) && ctx.next_scheduled_stage,
        body: (ctx) => `Sie haben den Text gelesen? Dann folgen Sie mir bitte.`,
        buttons: [
          {
            action: (ctx) => {
              ctx.markUnAlert(); ctx.gotoStage(ctx.next_scheduled_stage)
            },
            label: (ctx) => 'Ja, bitte!'
          }
        ]
      },
      {
        id: 2,
        prosa: ' Zweiter Besuch',
        condition: (ctx) => !ctx.is_stage_alerted(ctx.routed_stage) && ctx.next_scheduled_stage,
        body: (ctx) => `Wollen wir weiterfahren? Dann folgen Sie mir bitte.`,
        buttons: [

          {
            action: (ctx) => {
              ctx.markUnAlert(); ctx.gotoStage(ctx.next_scheduled_stage)
            },
            label: (ctx) => 'Ja, bitte!'
          }
        ]
      }
    ]
  },

  index_bottom_with_request_for_consent: {
    id: 'index_bottom_with_request_for_consent',
    prosa: ' Schliesst die Text-Stage mit einer Frage nach Zustimmung ab.',
    loading: (ctx) => !ctx.routed_stage?.stage.id,
    items: [
      {
        id: 10,
        prosa: 'Irgendwann, nachdem Rundgang zu Ende ist.',
        condition: (ctx) => !ctx.next_scheduled_stage,
        body: (ctx) => `Hier geht es zurück zum Programm.`,
        buttons: [
          {
            action: (ctx) => {
              ctx.$root.gotoAssemblyHome(ctx.assembly)
            },
            label: (ctx) => 'zum Programm'
          }
        ]
      },
      {
        id: 1,
        prosa: ' Erster Besuch am ersten Tag!.',
        condition: (ctx) => ctx.is_stage_alerted(ctx.routed_stage) && ctx.next_scheduled_stage,
        body: (ctx) => [
          `Um die Demokratiefabrik zu benutzen, müssen Sie dem Verhaltenskodex zustimmen.`,
          `Stimmen Sie dem Verhaltenskodex zu?`],
        buttons: [
          {
            action: (ctx) => {
              ctx.$q.notify({
                type: "nFabrikWarning",
                message:
                  "Wir bedauern, dass Sie dem Verhaltenskodex nicht zugestimmt haben. Leider können Sie die Demokratiefabrik ohne Zustimmung nicht verwenden.",
              });
              ctx.$root.gotoAssemblyHome(ctx.assembly)
            },
            label: (ctx) => 'Nein, ich lehne ab'
          },
          {
            action: (ctx) => {
              ctx.markUnAlert(ctx.routed_stage); ctx.$root.gotoAssemblyHome(ctx.assembly)
            },
            label: (ctx) => 'Ja, ich stimme zu'
          },
        ]
      },
      {
        id: 2,
        prosa: ' Zweiter Besuch',
        condition: (ctx) => !ctx.is_stage_alerted(ctx.routed_stage) && ctx.next_scheduled_stage,
        body: (ctx) => [`Sie haben dem Kodex bereits zugestimmt.`, `Wollen wir weiterfahren? Dann folgen Sie mir bitte.`],
        buttons: [

          {
            action: (ctx) => {
              ctx.markUnAlert(); ctx.$root.gotoAssemblyHome(ctx.assembly)
            },
            label: (ctx) => 'Ja, bitte!'
          }
        ]
      }
    ]
  },

  discussion_index_top: {
    id: 'discussion_index_top',
    loading: (ctx) => !ctx.$loaded(ctx.node.children),
    items: [
      {
        id: 2,
        body: (ctx) => `Sie können hier eine Frage stellen. Die anderen Teilnehmenden oder die Organisatoren werden sie sehr bald beantworten.`,
      }
    ]
  },
}

export default AMs