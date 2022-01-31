const AMs = {


  // topics_top: {
  //   id: 'topics_top',
  //   prosa: ' Anweisung, was hier aktuell zu tun ist.',
  //   // condition: (ctx) => { return (!ctx.salienceCompleted) },
  //   loading: (ctx) => !ctx.routed_stage,
  //   items: [
  //     {
  //       id: 1,
  //       body: (ctx) => [
  //         `Setzen Sie die Themen des Wahlkampfes! In diesem Abschnitt geht es darum, die wichtigsten politischen Themen der nächsten Legislatur zu finden.`,
  //         `Je wichtiger die Themen für die Bürgerinnen und Bürgern sind, desto mehr Platz erhalten sie im smartvote-Fragebogen.`
  //       ]
  //     }
  //   ]
  // },


  topics_top_partner: {
    id: 'topics_top_partner',
    prosa: ' Einleitung zu den Themen.',
    // condition: (ctx) => { return (!ctx.salienceCompleted) },
    loading: (ctx) => !ctx.routed_stage,
    items: [
      {
        id: 1,
        condition: (ctx) => !ctx.salienceCompleted,
        body: (ctx) => `Bitte geben Sie unten an, wie wichtig Ihnen die verschiedenen Themen sind.`,
      },
      {
        id: 2,
        condition: (ctx) => ctx.milestoneSALIENCE && !ctx.milestoneCHARTS,
        body: (ctx) => `Wir brauchen Sie nun weiter unten. Schauen Sie sich dort Ihre persönliche Wichtigkeit der Themen an.`,
        buttons: [
          {
            action: (ctx) => ctx.$root.scrollToAnchor('CHARTS'),
            label: (ctx) => 'Zum Themenvergleich'
          }
        ]

      },
      // {
      //   id: 3,
      //   condition: (ctx) => ctx.milestoneSALIENCE && !ctx.milestoneFORUM,
      //   body: (ctx) => `Beim Diskussionsforum haben wir noch eine Frage an Sie.`,
      //   buttons: [
      //     {
      //       action: (ctx) => { ctx.$root.scrollToAnchor('FORUM') },
      //       label: (ctx) => 'Zum Forum.'
      //     }
      //   ]
      // },
      {
        id: 4,
        prosa: "finish with everything",
        condition: (ctx) => ctx.milestoneCHARTS && ctx.milestoneSALIENCE && ctx.next_scheduled_stage,
        body: (ctx) => `Hierzu haben wir gerade keine Frage. Wenn Sie mögen können wir zum nächten Kapitel gehen.`,
        buttons: [
          {
            action: (ctx) => { ctx.markUnAlert(); ctx.gotoStage(ctx.next_scheduled_stage) },
            label: (ctx) => 'Weiterfahren, bitte!'
          }
        ]
      },
    ]
  },

  topics_after_saliencing: {
    id: 'topics_after_saliencing',
    loading: (ctx) => !ctx.routed_stage,
    items: [
      {
        id: 100,
        body: (ctx) => `Bitte bewerten Sie alle Themen. Dann können wir weiterfahren!`,
        condition: (ctx) => !ctx.salienceCompleted,
      },
      {
        id: 101,
        body: (ctx) => [
          `Vielen Dank!`,
          `Sie haben übrigens oben die Möglichkeit, mit Könizerinnen und Könizern über die Themen zu diskutieren. Öffnen Sie dazu bei einem Thema den Reiter «Diskussion». Gerne können Sie aber auch hier weiterfahren.`],
        condition: (ctx) => ctx.milestoneSALIENCE && !ctx.milestoneCHARTS && ctx.numberOfCurrentlySaliencedEntries > 0,
      }
    ]

  },



  // topics_forum_index_top: {
  //   id: 'topics_forum_index_top',
  //   prosa: 'Generelle Aufforderung sich umzusehen / mitzumachen..',
  //   items: [
  //     {
  //       id: 200,
  //       condition: (ctx) => ctx.node.nof_descendants === 0 && !ctx.CONTENTTREE.limitForAddingCommentsReached,
  //       prosa: 'Nichts bisher',
  //       body: (ctx) => `Machen Sie hier den Anfang? Worüber möchten Sie sich unterhalten?`,
  //     },
  //     {
  //       id: 201,
  //       condition: (ctx) => ctx.node.nof_descendants > 0 && ctx.node.nof_descendants < 15 && !ctx.CONTENTTREE.limitForAddingCommentsReached,
  //       prosa: 'Gibt es etwas, was sie gerade sagen möchten? Zu welchem Themengebiet?',
  //       body: (ctx) => `Gibt es Dinge, die Sie gerade sagen möchten? Haben Sie Fragen? Schreiben Sie einen Beitrag!`,
  //     },
  //     {
  //       id: 202,
  //       condition: (ctx) => ctx.node.nof_descendants > 15,
  //       prosa: 'Nothing urgent. Many statements.',
  //       body: (ctx) => [`Aktuell habe ich nichts dringendes.`, `Schauen Sie sich nur im Forum um. Da finden sich schon recht viele Wortmeldungen.`],
  //     },


  //     // PRIORITY ITEMS
  //     {
  //       id: 300,
  //       priority: 100,
  //       prosa: 'High Salience',
  //       condition: (ctx) => !ctx.checkMilestone('FORUM', 4) && ctx.undiscussedTopLevelEntrySuperiorSalience,
  //       body: (ctx) => {
  //         const node = ctx.undiscussedTopLevelEntrySuperiorSalience
  //         return [
  //           `Ich würde gerne noch wissen, was sie zum Thema «${node.content.title}» zu sagen haben. Wieso ist das Thema für Sie so bedeutsam?`,
  //           node.nof_descendants < 10 && !ctx.CONTENTTREE.limitForAddingCommentsReached ?
  //             `Könnten Sie dies in einem neuen Beitrag begründen?` :
  //             `Können Sie in diesem den einen oder anderen Beitrag bewerten. Dann erfahren wir mehr über Ihre Überlegungen.`]
  //       },
  //       buttons: [
  //         {
  //           action: (ctx) => {
  //             ctx.focus_on_branch(ctx.undiscussedTopLevelEntrySuperiorSalience)
  //           },
  //           label: (ctx) => 'Ja gern. Zum Thema, bitte!'
  //         },
  //         {
  //           action: (ctx) => {
  //             ctx.markDiscussed(ctx.undiscussedTopLevelEntrySuperiorSalience);
  //           },
  //           label: (ctx) => 'Nein, jetzt nicht.'
  //         }
  //       ]
  //     },
  //     {
  //       id: 400,
  //       priority: 100,
  //       prosa: 'Low Salience',
  //       condition: (ctx, { role }) => !ctx.checkMilestone('FORUM', 4) && ctx.undiscussedTopLevelEntryLowestSalience && role == 2,
  //       body: (ctx) => {
  //         const node = ctx.undiscussedTopLevelEntryLowestSalience
  //         return [
  //           ` Das Thema '${node.content.title}' ist Ihnen offenbar nicht sehr wichtig.`,
  //           node.nof_descendants < 10 && !ctx.CONTENTTREE.limitForAddingCommentsReached ?
  //             `Könnten Sie dies in einem neuen Beitrag begründen?` :
  //             `Über Ihre Gründe möchten wir mehr erfahren. Können Sie in dem Kapitel den einen oder anderen Beitrag bewerten?`]
  //       },
  //       buttons: [
  //         {
  //           action: (ctx) => ctx.focus_on_branch(ctx.undiscussedTopLevelEntryLowestSalience),
  //           label: (ctx) => 'Ja gern. Zum Thema, bitte!'
  //         },
  //         {
  //           action: (ctx) => {
  //             ctx.markDiscussed(ctx.undiscussedTopLevelEntryLowestSalience);
  //           },
  //           label: (ctx) => 'Nein, jetzt nicht.'
  //         }
  //       ]
  //     },
  //     {
  //       id: 500,
  //       prosa: 'Discrepance Positive',
  //       priority: 100,
  //       condition: (ctx) => !ctx.checkMilestone('FORUM', 4) && ctx.undiscussedTopLevelEntrySuperiorSalienceDiscrepancePositive,
  //       body: (ctx) => {
  //         // console.log(ctx)
  //         const node = ctx.undiscussedTopLevelEntrySuperiorSalienceDiscrepancePositive
  //         return [
  //           `Im Gegensatz zu vielen anderen Könizerinnen und Könizern scheint Ihnen das Thema '${node.content.title}' sehr wichtig zu sein.`,
  //           node.nof_descendants < 10 && !ctx.CONTENTTREE.limitForAddingCommentsReached ?
  //             `Könnten Sie dies in einem neuen Beitrag begründen?` :
  //             `Warum ist das so? Können Sie bei diesem Thema einige Beiträge von andern bewerten.`]
  //       },
  //       buttons: [
  //         {
  //           action: (ctx) => {
  //             ctx.focus_on_branch(ctx.undiscussedTopLevelEntrySuperiorSalienceDiscrepancePositive)
  //           },
  //           label: (ctx) => 'Ja gern. Zum Thema, bitte!'
  //         },
  //         {
  //           action: (ctx) => {
  //             ctx.markDiscussed(ctx.undiscussedTopLevelEntrySuperiorSalienceDiscrepancePositive);
  //           },
  //           label: (ctx) => 'Nein, jetzt nicht.'
  //         }
  //       ]
  //     },
  //     {
  //       id: 600,
  //       prosa: 'Discrepance Negative',
  //       priority: 100,
  //       condition: (ctx) => !ctx.checkMilestone('FORUM', 4) && ctx.undiscussedTopLevelEntrySuperiorSalienceDiscrepanceNegativ,
  //       body: (ctx) => {
  //         const node = ctx.undiscussedTopLevelEntrySuperiorSalienceDiscrepanceNegativ
  //         return [
  //           `Was haben Sie übrigens gegen das Thema '${node.content.title}'. Anderen scheint dies viel wichtiger zu sein?`,
  //           node.nof_descendants < 10 && !ctx.CONTENTTREE.limitForAddingCommentsReached ?
  //             `Könnten Sie dies in einem neuen Beitrag begründen?` :
  //             `Können Sie dort den einen oder anderen Beitrag bewerten. Dann erfahren wir mehr darüber warum das so ist.`]
  //       },
  //       buttons: [
  //         {
  //           action: (ctx) => {
  //             ctx.focus_on_branch(ctx.undiscussedTopLevelEntrySuperiorSalienceDiscrepanceNegativ)
  //           },
  //           label: (ctx) => 'Ja gern. Zum Thema, bitte!'
  //         },
  //         {
  //           action: (ctx) => {
  //             ctx.markDiscussed(ctx.undiscussedTopLevelEntrySuperiorSalienceDiscrepanceNegativ);
  //           },
  //           label: (ctx) => 'Nein, jetzt nicht.'
  //         }
  //       ]
  //     },

  //     {
  //       id: 700,
  //       prosa: 'Unexpanded topic with UNREAD MESSAGES',
  //       priority: 99,
  //       condition: (ctx) => !ctx.checkMilestone('FORUM', 4) && ctx.unexpandedTopLevelEntryWithUnreadMessage,
  //       body: (ctx) => {
  //         const node = ctx.unexpandedTopLevelEntryWithUnreadMessage
  //         return [
  //           `Schauen Sie sich nur um. Danach möchte ich Sie bitten beim Thema '${node.content.title}' vorbeizuschauen. Dort gibt es einige neue Beiträge.`
  //         ]
  //       },
  //       buttons: [
  //         {
  //           action: (ctx) => {
  //             ctx.focus_on_branch(ctx.unexpandedTopLevelEntryWithUnreadMessage)
  //           },
  //           label: (ctx) => `Zum Thema '${ctx.unexpandedTopLevelEntryWithUnreadMessage.content.title}'.`
  //         }
  //       ]
  //     }
  //   ],
  // },

  // topics_above_forum: {
  //   id: 'topics_after_charts',
  //   loading: (ctx) => !ctx.routed_stage,
  //   condition: (ctx) => ctx.milestoneFORUM,
  //   items: [
  //     {
  //       id: 1,
  //       body: (ctx) => [
  //         `Vorerst habe ich hier keine Fragen mehr. Sobald Sie genug diskutiert haben, können wir weiterfahren.`
  //       ],
  //       buttons: [
  //         {
  //           action: (ctx) => { ctx.$root.scrollToAnchor('CHARTS') },
  //           label: (ctx) => 'Ja, gerne weiterfahren'
  //         }
  //       ]
  //     }
  //   ]
  // },


  // topics_after_forum: {
  //   id: 'topics_after_forum',
  //   loading: (ctx) => !ctx.routed_stage,
  //   items: [
  //     {
  //       id: 1,
  //       condition: (ctx) => !ctx.milestoneFORUM,
  //       body: (ctx, { actorPartnerReference }) => `${actorPartnerReference} hat eben noch eine Frage an Sie.`,
  //       buttons: [
  //         {
  //           action: (ctx) => { ctx.$root.scrollToAnchor('FORUM') },
  //           label: (ctx) => 'Das will ich mir ansehen.'
  //         },
  //       ]
  //     },
  //   ]
  // },

  topics_before_charts: {
    id: 'topics_before_charts',
    loading: (ctx) => !ctx.routed_stage,
    items: [
      {
        id: 1,
        body: (ctx) => 'Hier finden Sie Ihre Übersicht zu den Themen im Vergleich zu den bisherigen Teilnehmenden an der Demokratiefabrik.',
        condition: (ctx) => !ctx.milestoneCHARTS,
      },
    ]
  },


  topics_after_charts: {
    id: 'topics_after_charts',
    loading: (ctx) => !ctx.routed_stage,
    items: [
      {
        id: 1,
        body: (ctx) =>
          ctx.daySessions === 1 ?
            `Sind Sie mit Ihrer Priorisierung der Themen einverstanden?` :
            `Sind Sie mit Ihrer Priorisierung der Themen einverstanden?`,
        condition: (ctx) => !ctx.milestoneCHARTS,
        buttons: [
          {
            action: (ctx) => { ctx.milestone("CHARTS", 4); ctx.$root.scrollToAnchor('FINAL', 300, 300) },
            label: (ctx) => 'Ja, es stimmt so!'
          },
          {
            action: (ctx) => { ctx.$root.scrollToAnchor('SALIENCE') },
            label: (ctx) => 'Nein, ich möchte noch etwas ändern.'
          }
        ]
      },
    ]
  },

  topics_end_of_page: {
    id: 'topics_end_of_page',
    condition: (ctx) => ctx.next_scheduled_stage?.stage,
    loading: (ctx) => !ctx.routed_stage,
    items: [
      {
        id: 1,
        body: (ctx) => `Wunderbar! Jetzt widmen wir uns den smartvote-Fragen.`,
        condition: (ctx) => ctx.next_scheduled_stage?.stage,
        buttons: [
          {
            action: (ctx) => { ctx.markUnAlert(); ctx.gotoStage(ctx.next_scheduled_stage) },
            label: (ctx) => 'Bitte weiterfahren!'
          }
        ]
      }
    ]
  },
}

export default AMs