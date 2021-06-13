import constants from 'src/utils/constants'
import { runtimeStore } from "src/store/runtime.store"
const AMs = {

  questions_top_partner: {
    id: 'questions_top_partner',
    prosa: ' Einleitung zum aktuellen Thema.',
    condition: (ctx) => ctx.next_scheduled_stage,
    loading: (ctx) => !ctx.routed_stage || (ctx.isRandomFocusStage && !ctx.focusedContent),
    items: [
      {
        id: 1,
        condition: (ctx) => !ctx.VAAQuestionStageManualFocusTopic && ctx.isRandomFocusStage,
        body: (ctx) =>
          [
            // ZUFALLS-THEMA-STAGE
            `Wir beginnen mit einem zufällig ausgewählten Thema. Danach können Sie frei weiterfahren.`,
            `Sind Sie bereit für das Thema '${ctx.VAAQuestionStageRandomFocusTopic.content.title}'? Dann scrollen Sie bitte nach unten.`

          ]
      },
      {
        id: 2,
        condition: (ctx) => !ctx.VAAQuestionStageManualFocusTopic && !ctx.isRandomFocusStage && ctx.focusedContent,
        body: (ctx) => `Wir sind nun beim Thema, dass Sie sich selber ausgesucht haben.`
      },
      {
        id: 2002,
        condition: (ctx) => !ctx.VAAQuestionStageManualFocusTopic && !ctx.isRandomFocusStage && !ctx.focusedContent,
        body: (ctx) => [
          `Sie können sich jetzt ein beliebiges Thema aussuchen.`,
          ctx.get_uncompleted_user_peerreviews?.length ? `Bei den Themen sehen Sie jeweils, ob Sie noch Gutachten abgeben können` : ''
        ]
      },
      {
        id: 3,
        condition: (ctx) => ctx.VAAQuestionStagesAlerted.length == 0 && ctx.next_scheduled_stage,
        body: (ctx) => [
          `Sie können sich nun die Abschlussseite "Zwischenstand" ansehen. Diese ist jetzt freigeschaltet.`,
          `Wenn Sie möchten können Sie sich aber auch noch andere Themenbereiche anschauen.`
        ],
      }
    ]
  },

  // CHOOOSE TOPIC
  questions_choose_manual_topic: {
    id: 'questions_choose_manual_topic',
    prosa: ' Nachfrage, zur Themenwahl.',
    loading: (ctx) => !ctx.routed_stage || (ctx.isRandomFocusStage && !ctx.focusedContent),
    condition: (ctx) => ctx.isManualFocusStage && ctx.isFocusedContentAlreadySet === false,
    items: [
      {
        id: 1,
        condition: (ctx) => ctx.VAAQuestionStageRandomFocusTopic != ctx.temporarySelectedTopic,
        buttons: [
          {
            condition: (ctx) => ctx.temporarySelectedTopic,
            action: (ctx) => {
              ctx.selectTopic(ctx.temporarySelectedTopic.content.id)
            },
            label: (ctx) => 'Ja , dieses Thema!'
          }
        ],
        body: (ctx) => ctx.temporarySelectedTopic ?
          [
            // Bereits den Themenselector geändert.
            `Möchten Sie nun das Thema '${ctx.temporarySelectedTopic.content.title}' bearbeiten?`

          ] :
          [
            // SELBST-AUSSUCH-THEMA-STAGE
            `Für welches Thema entscheiden Sie sich?`
          ]
      },
      {
        id: 2,
        condition: (ctx) => ctx.temporarySelectedTopic && ctx.VAAQuestionStageRandomFocusTopic == ctx.temporarySelectedTopic,
        body: (ctx) => `Dieses Thema haben Sie gerade schon bearbeitet.`
      },
    ],
  },


  questions_current_state: {
    id: 'questions_current_state',
    prosa: ' Erläuterungen zum aktuellen Stand des Fragenkatalogs.',
    loading: (ctx) => !ctx.routed_stage || !ctx.node,
    items: [
      {
        id: 1,
        condition: (ctx) => !ctx.milestoneSALIENCE && ctx.nodeChildrenExceptUserPeerreviews.length > 1 && ctx.nodeChildrenExceptUserPeerreviews.length <= 6,
        body: (ctx) => [
          // `Der Katalog enthält zu diesem Thema aktuell ${ctx.nodeChildrenExceptUserPeerreviews.length} Fragen.`,
          `Können Sie diese Fragen bewerten? Wie relevant finden Sie sie?`
        ],
      },
      {
        id: 103,
        condition: (ctx) => !ctx.milestoneSALIENCE && ctx.nodeChildrenExceptUserPeerreviews.length == 1,
        body: (ctx) => [
          // `Der Katalog enthält zu diesem Thema aktuell ${ctx.nodeChildrenExceptUserPeerreviews.length} Fragen.`,
          `Können Sie diese Frage bewerten? Wie relevant finden Sie sie?`
        ],
      },

      {
        id: 104,
        condition: (ctx) => !ctx.milestoneSALIENCE && ctx.nodeChildrenExceptUserPeerreviews.length > 6,
        body: (ctx) => [
          // `Der Katalog enthält zu diesem Thema aktuell ${ctx.nodeChildrenExceptUserPeerreviews.length} Fragen.`,
          `Können Sie einige dieser Fragen bewerten? Wie relevant finden Sie sie?`
        ],
      },

      {
        id: 2,
        condition: (ctx) => ctx.milestoneSALIENCE && !ctx.milestonePEERREVIEW,
        body: (ctx) => `Gerne würden wir nun mit den Gutachten fortfahren.`,
        buttons: [
          {
            action: (ctx) => {
              ctx.milestone("SALIENCE", 3); ctx.$root.scrollToAnchor('PEERREVIEW')
            },
            label: (ctx) => 'Zu den Gutachten'
          }
        ]
      },
      {
        id: 3,
        condition: (ctx) => ctx.milestonePEERREVIEW && !ctx.milestonePROPOSE,
        body: (ctx) => `Weiter unten haben wir eine Frage an Sie.`,
        buttons: [
          {
            action: (ctx) => { ctx.$root.scrollToAnchor('PROPOSE') },
            label: (ctx) => 'Ich komme mit!'
          }
        ]
      },
      {
        id: 3,
        condition: (ctx) => ctx.milestonePROPOSE && !ctx.milestoneCHARTS,
        body: (ctx) => `Weiter unten haben wir eine Frage an Sie.`,
        // buttons: [
        //   {
        //     action: (ctx) => { ctx.$root.scrollToAnchor('CHARTS') },
        //     label: (ctx) => 'Zur Statistik.'
        //   }
        // ]
      },
      {
        id: 4,
        prosa: "finish with this topic => other stage is still open..",
        condition: (ctx) => ctx.milestoneCHARTS && ctx.milestonePROPOSE && ctx.next_scheduled_stage && ctx.VAAQuestionStagesAlerted.length,
        body: (ctx) => `Zum Thema '${ctx.VAAQuestionStageRandomFocusTopic.content.title}' haben wir gerade keine Frage. Wenn Sie mögen können wir zum nächten Thema wechseln.`,
        buttons: [
          {
            action: (ctx) => ctx.gotoStage(ctx.next_scheduled_stage),
            label: (ctx) => 'Zum nächsten Thema'
          }
        ]
      },
      // {
      //   id: 4,
      //   prosa: "finish with all topics..",
      //   condition: (ctx) => ctx.next_scheduled_stage && !ctx.VAAQuestionStagesAlerted.length,
      //   body: (ctx) => `Sehr schön. Kommen Sie doch mit. Jetzt muss ich Ihnen was zeigen.`,
      // },

      // {
      //   id: 5,
      //   prosa: "finish with everything",
      //   condition: (ctx) => ctx.milestonePROPOSE && ctx.next_scheduled_stage &&  ctx.VAAQuestionStagesAlerted.length,
      //   body: (ctx) => `Sie haben das Thema '${ctx.VAAQuestionStageRandomFocusTopic.content.title}' ausgewählt. Nun können Sie das Thema nach belieben wechseln.`
      // }
    ]
  },



  // TODO: only when there are less than five questions (incl. proposal) and when user has free-proposals left...
  questions_peerreview: {
    id: 'questions_peerreview',
    loading: (ctx) => !ctx.routed_stage,
    items: [
      {
        id: 1,
        condition: (ctx) => !ctx.milestonePEERREVIEW && Object.keys(ctx.contents_to_peerreview).length == 1,
        body: (ctx) => `Das ist uns besonders wichtig: Wir brauchen Ihr Urteil bei einem Gutachten.`,
      },
      {
        id: 2,
        condition: (ctx) => !ctx.milestonePEERREVIEW && Object.keys(ctx.contents_to_peerreview).length > 1,
        body: (ctx) => `Das ist uns besonders wichtig: Nun brauchen wir Ihr Urteil bei ${Object.keys(ctx.contents_to_peerreview).length}  Gutachten.`,
      }
    ],
  },

  // TODO: only when there are less than five questions (incl. proposal) and when user has free-proposals left...
  propose_question: {
    id: 'propose_question',
    loading: (ctx) => !ctx.routed_stage,
    condition: (ctx) => !ctx.showProposeForm && ctx.askToProposeNewQuestion,
    items: [
      {
        id: 1,
        condition: (ctx) => !ctx.CONTENTTREE.limitForAddingProposalsReached,
        body: (ctx) => `Haben Sie zum Thema '${ctx.node.content.title}' einen Vorschlag für eine neue smartvote-Frage?`,
      },
      {
        id: 2,
        condition: (ctx) => ctx.CONTENTTREE.limitForAddingProposalsReached,
        body: (ctx) => `Heute können Sie leider keinen Vorschlag mehr einbringen. Morgen früh sieht das wieder ganz anders aus.`,
      }
    ],
    buttons: [
      {
        condition: (ctx) => !ctx.CONTENTTREE.limitForAddingProposalsReached,
        action: (ctx) => { ctx.showProposeForm = true },
        label: (ctx) => 'Ja, ich weiss da etwas.'
      },
      {
        condition: (ctx) => !ctx.CONTENTTREE.limitForAddingProposalsReached,
        action: (ctx) => { ctx.milestone("PROPOSE", 3); ctx.$root.scrollToAnchor('CHARTS', 300, 300) },
        label: (ctx) => 'Nein, gerade nicht.'
      },
      {
        condition: (ctx) => ctx.CONTENTTREE.limitForAddingProposalsReached,
        action: (ctx) => { ctx.milestone("PROPOSE", 3); ctx.$root.scrollToAnchor('CHARTS', 300, 300) },
        label: (ctx) => 'Weiter'
      }
    ]
  },


  questions_after_charts: {
    id: 'topics_after_charts',
    loading: (ctx) => !ctx.routed_stage,
    items: [
      {
        id: 1,
        body: (ctx) => ctx.daySessions <= 1 ?
          `Sind Sie mit Ihrer Priorisierung einverstanden?` :
          `Sind Sie mit Ihrer Priorisierung einverstanden?`,
        condition: (ctx) => !ctx.milestoneCHARTS,
        buttons: [
          {
            action: (ctx) => { ctx.milestone("CHARTS", 4); ctx.$root.scrollToAnchor('FINAL', 300, 300) },
            label: (ctx) => 'Ja, es stimmt so!'
          },
          {
            action: (ctx) => { ctx.$root.scrollToAnchor('SALIENCE') },
            label: (ctx) => 'Ich möchte noch etwas ändern.'
          }
        ]
      },
      {
        id: 2,
        body: (ctx) => `Sie sehen in diesem Bild Ihre persönliche Prioritätenliste der smartvote-Fragen. Sind Sie zufrieden damit?`,
        condition: (ctx) => ctx.milestoneSALIENCE && !ctx.milestoneCHARTS,
        buttons: [
          {
            action: (ctx) => { ctx.milestone("CHARTS", 4); ctx.$root.scrollToAnchor('FINAL', 300, 300) },
            label: (ctx) => 'Ja, es stimmt so!'
          },
          {
            action: (ctx) => { ctx.$root.scrollToAnchor('SALIENCE') },
            label: (ctx) => 'Ich möchte noch etwas ändern.'
          }

        ]
      }
    ]
  },

  questions_end_of_page: {
    id: 'topics_end_of_page',
    // condition: (ctx) => ctx.next_scheduled_stage,
    loading: (ctx) => !ctx.routed_stage,
    items: [
      {
        id: 1,
        prosa: "Fortfahren mit zweiter Fragen-Stage.",
        body: (ctx) => [
          `Vielen Dank! Wir möchten nun, dass Sie sich zum Schluss noch ein zweites Thema ansehen.`,
          `Das zweite Thema können Sie frei wählen.`
        ],
        condition: (ctx) => ctx.next_scheduled_stage && ctx.isRandomFocusStage && ctx.VAAQuestionStagesAlerted.length,
        buttons: [
          {
            action: (ctx) => { ctx.gotoStage(ctx.next_scheduled_stage) },
            label: (ctx) => 'Okay!'
          },
          {
            action: (ctx) => { ctx.$root.monitorLog(constants.MONITOR_STAGE_OPTOUT); ctx.markUnAlert(ctx.next_scheduled_stage); ctx.gotoStage(ctx.next_scheduled_stage) },
            label: (ctx) => 'Ich habe wirklich keine Lust mehr.'
          }
        ]
      },
      {
        id: 2,
        body: (ctx) => [`Ich verstehe gut, dass Sie müde sind und die smartvote-Fragen zu diesem Thema grad nicht mehr bewerten wollen. Schauen Sie doch noch kurz beim Zwischenstand vorbei?`],
        condition: (ctx) => ctx.next_scheduled_stage && !ctx.VAAQuestionStagesAlerted.length && !ctx.milestoneSALIENCE,
        buttons: [
          {
            action: (ctx) => { ctx.milestone("CHARTS", 4); ctx.$root.scrollToAnchor('SALIENCE') },
            label: (ctx) => 'Zur Bewertung der Fragen.'
          },
          {
            action: (ctx) => { ctx.milestone("CHARTS", 4); ctx.gotoStage(ctx.next_scheduled_stage) },
            label: (ctx) => 'Zum Zwischenstand'
          }
        ]
      },
      {
        id: 199,
        body: (ctx) => [`Haben Sie noch Lust, Gutachten zu diesem Thema zu beantworten? Es ist uns ein Anliegen, dass möglichst viele Personen dabei mithelfen.`],
        condition: (ctx) => !ctx.VAAQuestionStagesAlerted.length && ctx.milestoneSALIENCE && !ctx.peerreviewCompleted,
        buttons: [
          {
            action: (ctx) => { ctx.$root.scrollToAnchor('PEERREVIEW') },
            label: (ctx) => 'Zu den Gutachten.'
          },
          {
            action: (ctx) => ctx.$root.scrollToAnchor('TOPICSELECTION'),
            label: (ctx) => 'Nein, danke. Es reicht jetzt wirklich!'
          }
        ]
      },
      {
        id: 200,
        body: (ctx) => [`Wunderbar! Sie können sich nun noch die weiteren Themen anschauen oder direkt zum 'Zwischenstand' wechseln.`],
        condition: (ctx) => ctx.next_scheduled_stage && !ctx.VAAQuestionStagesAlerted.length && ctx.milestoneSALIENCE && ctx.peerreviewCompleted,
        buttons: [
          {
            action: (ctx) => { ctx.$root.scrollToAnchor('TOPICSELECTION') },
            label: (ctx) => 'Erneut zur Themenwahl'
          },
          {
            action: (ctx) => { ctx.gotoStage(ctx.next_scheduled_stage) },
            label: (ctx) => 'Zum Zwischenstand'
          }
        ]
      },
      {
        id: 201,
        body: (ctx) => [`Hier geht es wieder nach oben zur Themenwahl`],
        condition: (ctx) => !ctx.next_scheduled_stage && ctx.milestoneSALIENCE && ctx.peerreviewCompleted,
        buttons: [
          {
            action: (ctx) => { ctx.$root.scrollToAnchor('TOPICSELECTION') },
            label: (ctx) => 'Erneut zur Themenwahl'
          }
        ]
      }

    ]
  },
}

export default AMs