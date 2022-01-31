import plugin_AMs from '../../plugins/Plugins';

const AMs = {
  assembly_home_top: {},

  stage_teaser_DEFAULT: {
    id: 'stage_teaser_DEFAULT',
    loading: (ctx) => !ctx.currentSelectedStage,
    items: [
      {
        id: 1,
        condition: (ctx) =>
          ctx.is_stage_new(ctx.currentSelectedStage) &&
          ctx.is_stage_first_shown(ctx.currentSelectedStage) &&
          !ctx.is_stage_last_shown(ctx.currentSelectedStage) &&
          !ctx.is_stage_completed(ctx.currentSelectedStage),
        body: (ctx) => ctx.$i18n.t('stages.am.enter_first'),
      },
      {
        id: 2,
        condition: (ctx) =>
          ctx.is_stage_new(ctx.currentSelectedStage) &&
          !ctx.is_stage_first_shown(ctx.currentSelectedStage) &&
          !ctx.is_stage_last_shown(ctx.currentSelectedStage) &&
          !ctx.is_stage_completed(ctx.currentSelectedStage),
        body: (ctx) => ctx.$i18n.t('stages.am.enter_continue'),
      },
      {
        id: 3,
        condition: (ctx) => ctx.is_stage_completed(ctx.currentSelectedStage),
        body: (ctx) => ctx.$i18n.t('stages.am.already_completed'),
      },
      {
        id: 3,
        condition: (ctx) =>
          ctx.is_stage_new(ctx.currentSelectedStage) &&
          !ctx.is_stage_first_shown(ctx.currentSelectedStage) &&
          ctx.is_stage_last_shown(ctx.currentSelectedStage) &&
          !ctx.is_stage_completed(ctx.currentSelectedStage),
        body: (ctx) => ctx.$i18n.t('stages.am.enter_end'),
      },
      {
        id: 4,
        condition: (ctx) =>
          ctx.is_stage_new(ctx.currentSelectedStage) &&
          ctx.is_stage_first_shown(ctx.currentSelectedStage) &&
          ctx.is_stage_last_shown(ctx.currentSelectedStage) &&
          !ctx.is_stage_completed(ctx.currentSelectedStage),
        body: (ctx) => ctx.$i18n.t('stages.am.enter_unique_stage'),
      },
      {
        id: 5,
        condition: (ctx) => ctx.is_stage_scheduled(ctx.currentSelectedStage),
        body: (ctx) => ctx.$i18n.t('stages.am.attention_needed'),
      },
      {
        id: 6,
        condition: (ctx) =>
          !ctx.is_stage_scheduled(ctx.currentSelectedStage) &&
          !ctx.is_stage_last_shown(ctx.currentSelectedStage),
        body: (ctx) => ctx.$i18n.t('stages.am.already_seen'),
      },
      {
        id: 7,
        prosa:
          'Schon mal gesehen. Doch es ist der letze eintrag auf dieser seite.',
        condition: (ctx) =>
          !ctx.is_stage_scheduled(ctx.currentSelectedStage) &&
          ctx.is_stage_last_shown(ctx.currentSelectedStage),
        body: (ctx) => ctx.$i18n.t('stages.am.all_stages_already_seen'),
      },
    ],

    buttons: [
      {
        condition: (ctx) =>
          !ctx.is_stage_last_shown(ctx.currentSelectedStage) &&
          !ctx.is_stage_scheduled(ctx.currentSelectedStage),
        action: (ctx) => ctx.gotoNextStageNr(ctx.currentSelectedStage),
        label: (ctx) => ctx.$i18n.t('stages.goto_next_stage'),
        icon_right: 'mdi-arrow-down',
      },
      {
        condition: (ctx) => ctx.is_stage_scheduled(ctx.currentSelectedStage),
        action: (ctx) => ctx.gotoStage(ctx.currentSelectedStage),
        label: (ctx) => ctx.$i18n.t('stages.please_enter_stage'),
        icon_right: 'mdi-arrow-right',
      },
    ],
  },

  /* IMPORT AM-Instructions from the plugins... 
  NOTE: there are some reserved keys: (written in uppercase)
  - stage_teaser_<STAGE_TYPE>
  */
  ...plugin_AMs,
};

export default AMs;
