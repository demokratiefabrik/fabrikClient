import { IStageTuple } from 'src/models/stage';
import {Ref} from 'vue'

interface ICtx {
  routed_stage: IStageTuple | null;
  redirecting: boolean
  nextScheduledStage: Ref<IStageTuple>;
  isRoutedStageCompleted: boolean
  markUnAlert: () => void
  gotoStage: (IStageTuple) => void
  $t: (string) => void
} 

export default {

  survey: {
    id: 'survey',
    prosa: ' Leitet eine Text-Stage ein.',
    loading: (ctx: ICtx) => !ctx.routed_stage || ctx.redirecting,
    items: [
      {
        id: 1,
        prosa: ' Redirect zum Survey....',
        condition: (ctx: ICtx) => !ctx.isRoutedStageCompleted,
        body: (ctx: ICtx) => ctx.$t('survey.redirect_to_survey'),
      },
      {
        id: 2,
        prosa: ' Bereits Survey beendet',
        condition: (ctx: ICtx) => ctx.isRoutedStageCompleted,
        body: (ctx: ICtx) => ctx.$t('survey.survey_completed'),
        buttons: [
          {
            action: (ctx: ICtx) => { ctx.markUnAlert(); ctx.gotoStage(ctx.nextScheduledStage) },
            label: () => 'Ja, bitte weiterfahren'
          }
        ]
      }
    ]
  }
}
