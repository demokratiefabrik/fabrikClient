// import { IStageGroup } from 'src/composables/stage.composable';
import { IStageGroup, IStageTuple } from 'src/models/stage';
// import { Ref} from 'vue';

export interface IAmToc {
  groupsScheduled: IStageGroup[];
  assemblyMenuItems: IStageGroup[]
  stages_by_groups: Record<string, IStageTuple[]>
  nextScheduledStage: IStageTuple
  nextScheduledStageGroup: IStageGroup
  gotoStage: (IStageTuple) => void
  // [x: string]: any, 
}


const AMs = {

  toc: {
    id: 'toc',
    prosa: ' Wird bei der Tagesübersicht angzeigt.',
    loading: (ctx: IAmToc) => !ctx.assemblyMenuItems?.length || !ctx.stages_by_groups,
    items: [
      {
        id: 1,
        prosa: ' ... gibt nichts mehr zu tun',
        condition: (ctx: IAmToc) => !ctx.groupsScheduled?.length,
        body: () => 'Sie haben heute bereits alle wichtigsten Traktanden erledigt. Erst morgen früh halten wir hier wieder neue Aufgaben für Sie bereit.',
      },
      {
        id: 3,
        prosa: ' ... VORBEREITUNG: die bitte dort weiterzufarhen wo, es was zu tun gibt.',
        condition: (ctx: IAmToc) => ctx.nextScheduledStage && ctx.nextScheduledStage.stage.group == 'preparation',
        body: (ctx) => {
          const chapter = ctx.nextScheduledStage.stage.title
          return `Wir möchten, dass Sie sich nun das Kapitel «${chapter}» ansehen. Machen Sie mit? `
        },
        buttons: [
          {
            action: (ctx: IAmToc) => ctx.gotoStage(ctx.nextScheduledStage),
            label: () => 'Ich komme mit!'
          }
        ]
      },
      {
        id: 21,
        prosa: ' ... TOPICS: Day X: die bitte dort weiterzufarhen wo, es was zu tun gibt.',
        condition: (ctx: IAmToc) => ctx.nextScheduledStage && ctx.nextScheduledStageGroup?.name == 'voice' && (ctx.nextScheduledStage.progression && ctx.nextScheduledStage.progression.number_of_day_sessions > 1),
        body: () => {
          // const chapter = ctx.nextScheduledStageGroup.toc_label ? ctx.nextScheduledStageGroup.toc_label : ctx.nextScheduledStageGroup.label
          return 'Kommen Sie doch nochmals mit zu den smartvote-Themen.'
        },
        buttons: [
          {
            action: (ctx: IAmToc) => ctx.gotoStage(ctx.nextScheduledStage),
            label: () => 'Ja, gern.'
          }
        ]
      },
      {
        id: 212,
        prosa: ' ... TOPICS: Day 1: die bitte dort weiterzufarhen wo, es was zu tun gibt.',
        condition: (ctx: IAmToc) => ctx.nextScheduledStage && ctx.nextScheduledStageGroup?.name == 'voice' && (!ctx.nextScheduledStage.progression || ctx.nextScheduledStage.progression.number_of_day_sessions == 1),
        body: () => {
          // const chapter = ctx.nextScheduledStageGroup.toc_label ? ctx.nextScheduledStageGroup.toc_label : ctx.nextScheduledStageGroup.label
          return 'Sie haben nun alle Vorbereitungen beendet und es kann richtig los gehen.'
        },
        buttons: [
          {
            action: (ctx: IAmToc) => ctx.gotoStage(ctx.nextScheduledStage),
            label: () => 'Weiterfahren'
          }
        ]
      },
      {
        id: 22,
        prosa: ' ... QUESTIONS: die bitte dort weiterzufarhen wo, es was zu tun gibt.',
        condition: (ctx: IAmToc) => ctx.nextScheduledStage && ctx.nextScheduledStageGroup?.name == 'arguments',
        body: () => 'Wir brauchen Ihre Hilfe drüben bei den smartvote-Fragen.',
        buttons: [
          {
            action: (ctx: IAmToc) => ctx.gotoStage(ctx.nextScheduledStage),
            label: () => 'Ja, ich komme mit!'
          }
        ]
      },
      {
        id: 2,
        prosa: ' ... CONCLUSION: die bitte dort weiterzufarhen wo, es was zu tun gibt.',
        condition: (ctx: IAmToc) => ctx.nextScheduledStageGroup?.name == 'conclusion',
        body: () => 'Sehr schön! Sie haben unsere Fragen alle beantwortet. Vielen Dank. Sie können sich nun noch den Zwischenstand ansehen.',
        buttons: [
          {
            action: (ctx: IAmToc) => ctx.gotoStage(ctx.nextScheduledStage),
            label: () => 'Zum Zwischenstand'
          }
        ]
      }
    ]
  },


  indexTopPeerReview: {
    id: 'indexTopBasic',
    loading: (ctx) => !ctx.node.children,
    items: [
      {
        id: 1,
        condition: (ctx) => ctx.node.nof_descendants === 0,
        priority: 1,
        prosa: 'Nichts bisher',
        body: () => 'Die anderen würden sich freuen, wenn Sie hier Ihre Überlegungen teilen.',
      },
      {
        id: 1,
        condition: (ctx) => ctx.node.nof_descendants > 0 && ctx.node.nof_descendants < 5,
        priority: 1,
        prosa: 'Nichts bisher',
        body: () => 'Was sind Ihre Überlegungen zu diesem Vorschlag?',
      },
      {
        id: 3,
        priority: 1,
        condition: (ctx) => ctx.node.nof_descendants >= 5,
        prosa: 'Schon alles gesagt?',
        body: () => 'Was denken Sie zu den Überlegungen der anderen?',
      },
    ]
  },

  conclusionA: {
    id: 'conclusionA',
    items: [
      {
        id: 1,
        body: (_ctx, { actorPartnerReference }) => ['Wir danken Ihnen im Namen des ganzen Demokratiefabrik-Teams für Ihre wertvolle Mitarbeit!', `${actorPartnerReference} und ich machen nun Pause. Wir stehen Ihnen ab morgen wieder zur Verfügung!`],
      },
    ]
  },

  conclusionB: {
    id: 'conclusionB',
    items: [
      {
        id: 2,
        body: () => [
          'Wenn Sie noch Lust haben, können Sie gerne noch selbständig auf Entdeckungstour durch unsere Demokratiefabrik gehen.',
          'Unten folgt noch eine kleine Übersicht über den aktuellen Stand der Arbeiten zum smartvote-Fragenkatalog.'],
      },

    ]
  }
}

export default AMs