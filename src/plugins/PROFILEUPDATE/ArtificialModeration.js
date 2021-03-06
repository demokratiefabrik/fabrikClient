const AMs = {

  profileupdate: {
    id: 'profileupdate',
    prosa: ' Leitet eine PROFILEUPDATE-Stage ein.',
    loading: (ctx) => !ctx.routed_stage || ctx.redirecting,
    items: [
      {
        id: 2,
        prosa: ' Bereits Sekretariat',
        condition: (ctx) => ctx.is_stage_completed(ctx.routed_stage),
        body: (ctx) => 'Die Kontaktinformation sind eingetragen. Sie können sie jederzeit über das Hauptmenü ändern.',
        buttons: [
          {
            action: (ctx) => ctx.gotoStage(ctx.next_scheduled_stage),
            label: (ctx) => 'Ok. Nun bitte weiterfahren'
          }
        ]
      }
    ]
  }
}

export default AMs