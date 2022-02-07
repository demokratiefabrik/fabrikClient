import { IStageTuple } from 'src/models/stage';
import {Ref} from 'vue'

// import { ICtx } from "../TEXTSHEET/ArtificialModeration";
export interface ICtx {
  routed_stage: IStageTuple | null;
  redirecting: boolean
  nextScheduledStage: Ref<IStageTuple>;
  isRoutedStageCompleted: boolean
  gotoStage: (IStageTuple) => void
}

export default {

  profileupdate: {
    id: 'profileupdate',
    prosa: ' Leitet eine PROFILEUPDATE-Stage ein.',
    loading: (ctx: ICtx) => !ctx.routed_stage || ctx.redirecting,
    items: [
      {
        id: 2,
        prosa: ' Bereits Sekretariat',
        condition: (ctx: ICtx) => ctx.isRoutedStageCompleted,
        body: () => 'Die Kontaktinformation sind eingetragen. Sie können sie jederzeit über das Hauptmenü ändern.',
        buttons: [
          {
            action: (ctx: ICtx) => ctx.gotoStage(ctx.nextScheduledStage),
            label: () => 'Ok. Nun bitte weiterfahren'
          }
        ]
      }
    ]
  }
}