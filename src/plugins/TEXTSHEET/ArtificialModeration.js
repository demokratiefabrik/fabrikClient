export default {
  index_top: {
    id: 'index_top',
    prosa: ' Leitet eine Text-Stage ein.',
    loading: (ctx) => !ctx.routed_stage?.stage.id,
    items: [
      {
        id: 10,
        prosa: 'Irgendwann, nachdem rundgang zu Ende ist.',
        condition: (ctx) => !ctx.nextScheduledStage.value,
        body: () => 'Sie können sich das ruhig nochmal anschauen.',
        buttons: [
          {
            action: (ctx) => {
              ctx.gotoAssemblyHome(ctx.assembly);
            },
            label: () => 'Zurück zum Programm',
          },
        ],
      },
      {
        id: 1,
        prosa: ' Erste Stage, Erster Besuch am ersten Tag!.',
        condition: (ctx) =>
          ctx.is_stage_alerted(ctx.routed_stage) &&
          ctx.isFirstText &&
          ctx.nextScheduledStage,
        body: () =>
          'Wir beginnen mit folgendem Text. Bitte lesen Sie diese Informationen zum Projekt kurz durch.',
      },
      {
        id: 2,
        prosa: ' Spätere Stage: Erster Besuch am ersten Tag!.',
        condition: (ctx) =>
          ctx.is_stage_alerted(ctx.routed_stage) &&
          !ctx.isFirstText &&
          ctx.nextScheduledStage.value,
        body: () =>
          'Auch dieser Text ist uns wichtig. Bitte lesen Sie auch diesen kurz durch.',
      },
      {
        id: 3,
        prosa: ' Zweiter Besuch',
        condition: (ctx) =>
          !ctx.is_stage_alerted(ctx.routed_stage) && ctx.nextScheduledStage.value,
        body: () => 'Sie können sich das ruhig nochmal anschauen.',
        buttons: [
          {
            action: (ctx) => {
              ctx.markUnAlert();
              ctx.gotoStage(ctx.nextScheduledStage.value);
            },
            label: () => 'Lieber jetzt gleich weiterfahren',
          },
        ],
      },
    ],
  },

  index_bottom: {
    id: 'index_bottom',
    prosa: ' Schliesst die Text-Stage ab.',
    loading: (ctx) => !ctx.routed_stage?.stage.id,
    items: [
      {
        id: 10,
        prosa: 'Irgendwann, nachdem Rundgang zu Ende ist.',
        condition: (ctx) => !ctx.nextScheduledStage.value,
        body: () => 'Hier geht es zurück zum Programm.',
        buttons: [
          {
            action: (ctx) => {
              ctx.gotoAssemblyHome(ctx.assembly);
            },
            label: () => 'zum Programm',
          },
        ],
      },
      {
        id: 1,
        prosa: ' Erster Besuch am ersten Tag!.',
        condition: (ctx) =>
          ctx.is_stage_alerted(ctx.routed_stage) && ctx.nextScheduledStage.value,
        body: () => 'Sie haben den Text gelesen? Dann folgen Sie mir bitte.',
        buttons: [
          {
            action: (ctx) => {
              ctx.markUnAlert();
              ctx.gotoStage(ctx.nextScheduledStage.value);
            },
            label: () => 'Ja, bitte!',
          },
        ],
      },
      {
        id: 2,
        prosa: ' Zweiter Besuch',
        condition: (ctx) =>
          !ctx.is_stage_alerted(ctx.routed_stage) && ctx.nextScheduledStage.value,
        body: () => 'Wollen wir weiterfahren? Dann folgen Sie mir bitte.',
        buttons: [
          {
            action: (ctx) => {
              ctx.markUnAlert();
              ctx.gotoStage(ctx.nextScheduledStage.value);
            },
            label: () => 'Ja, bitte!',
          },
        ],
      },
    ],
  },

  index_bottom_with_request_for_consent: {
    id: 'index_bottom_with_request_for_consent',
    prosa: ' Schliesst die Text-Stage mit einer Frage nach Zustimmung ab.',
    loading: (ctx) => !ctx.routed_stage?.stage.id,
    items: [
      {
        id: 10,
        prosa: 'Irgendwann, nachdem Rundgang zu Ende ist.',
        condition: (ctx) => !ctx.nextScheduledStage.value,
        body: () => 'Hier geht es zurück zum Programm.',
        buttons: [
          {
            action: (ctx) => {
              ctx.gotoAssemblyHome(ctx.assembly);
            },
            label: () => 'zum Programm',
          },
        ],
      },
      {
        id: 1,
        prosa: ' Erster Besuch am ersten Tag!.',
        condition: (ctx) =>
          ctx.is_stage_alerted(ctx.routed_stage) && ctx.nextScheduledStage.value,
        body: () => [
          'Um die Demokratiefabrik zu benutzen, müssen Sie dem Verhaltenskodex zustimmen.',
          'Stimmen Sie dem Verhaltenskodex zu?',
        ],
        buttons: [
          {
            action: (ctx) => {
              ctx.$q.notify({
                type: 'nFabrikWarning',
                message:
                  'Wir bedauern, dass Sie dem Verhaltenskodex nicht zugestimmt haben. Leider können Sie die Demokratiefabrik ohne Zustimmung nicht verwenden.',
              });
              ctx.gotoAssemblyHome(ctx.assembly);
            },
            label: () => 'Nein, ich lehne ab',
          },
          {
            action: (ctx) => {
              ctx.markUnAlert(ctx.routed_stage);
              ctx.gotoAssemblyHome(ctx.assembly);
            },
            label: () => 'Ja, ich stimme zu',
          },
        ],
      },
      {
        id: 2,
        prosa: ' Zweiter Besuch',
        condition: (ctx) =>
          !ctx.is_stage_alerted(ctx.routed_stage) && ctx.nextScheduledStage.value,
        body: () => [
          'Sie haben dem Kodex bereits zugestimmt.',
          'Wollen wir weiterfahren? Dann folgen Sie mir bitte.',
        ],
        buttons: [
          {
            action: (ctx) => {
              ctx.markUnAlert();
              ctx.gotoAssemblyHome(ctx.assembly);
            },
            label: () => 'Ja, bitte!',
          },
        ],
      },
    ],
  },

  discussion_index_top: {
    id: 'discussion_index_top',
    loading: (ctx) => !ctx.loaded(ctx.node.children),
    items: [
      {
        id: 2,
        body: () =>
          'Sie können hier eine Frage stellen. Die anderen Teilnehmenden oder die Organisatoren werden sie sehr bald beantworten.',
      },
    ],
  },
};
