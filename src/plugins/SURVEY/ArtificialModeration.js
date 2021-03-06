const AMs = {

  survey: {
    id: 'survey',
    prosa: ' Leitet eine Text-Stage ein.',
    loading: (ctx) => !ctx.routed_stage || ctx.redirecting,
    items: [
      {
        id: 1,
        prosa: ' Redirect zum Survey....',
        condition: (ctx) => !ctx.is_stage_completed(ctx.routed_stage),
        body: (ctx) => ctx.$i18n.t("survey.redirect_to_survey"),
      },
      {
        id: 2,
        prosa: ' Bereits Survey beendet',
        condition: (ctx) => ctx.is_stage_completed(ctx.routed_stage),
        body: (ctx) => ctx.$i18n.t('survey.survey_completed'),
        buttons: [
          {
            action: (ctx) => { ctx.markUnAlert(); ctx.gotoStage(ctx.next_scheduled_stage) },
            label: (ctx) => 'Ja, bitte weiterfahren'
          }
        ]
      }
    ]
  }
}

export default AMs