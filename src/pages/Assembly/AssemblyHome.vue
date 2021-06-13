<style lang="sass" scoped>
.q-stepper__dot
  width: 50px !important
  height: 50px !important
</style>
<template>
  <q-page class="doc_content">

    <!-- ASSEMBLY DESCRIPTION -->
    <!-- <div>

      <h2>{{ assembly.title }}: Der Tagesüberblick</h2>
      <p>{{ assembly.info }}</p>
    </div> -->

    <!-- AM-Conclusion (INTRO STAGES) -->
    <!-- <ArtificialModeration
      :AM="AMs.assembly_home_top"
      :role="1"
      alignment="right"
      :ctx="that"
    />
 -->
    <!-- <q-stepper
      v-if="assembly_sorted_stages &&  oauth.authorized !== null"
      v-model="stage_nr_last_visited"
      vertical
      header-nav
      @transition="stageTransition"
      flat
      ref="stepper"
    >
      <q-step
        v-for="(localStage, localStageNr) in assembly_sorted_stages"
        :key="Number(localStageNr)"
        :prefix="localStageNr+1"
        :done="true"
        :name="Number(localStageNr)"
        :caption="getStepCaption(localStage)"
        :title="localStage.stage.title"
        :color="getColor(localStage)"
        :disabled="!is_stage_accessible(localStage)"
        :done-icon="getIcon(localStage)"
        :active-icon="getIcon(localStage)"
      > -->

    <!-- STAGE CONTENT-->
    <!-- <q-card flat>
          <q-card-section
            v-if="localStageNr==stage_nr_last_visited"
            class="q-pa-xs"
            style="min-height:3em;"
          >
            <div
              class="text-subtitle2"
              v-if="!is_stage_completed(localStage)"
              v-dompurify-html="localStage.stage.info"
            />

            <q-btn
              color="white"
              text-color="black"
              class="q-mt-md"
              @click="gotoStage(localStage)"
              v-if="is_stage_idle(localStage)"
              label="Öffnen"
            />
          </q-card-section>

          <q-card-section
            class="col-12 "
            align="right"
          >

            <div v-if="localStageNr==stage_nr_last_visited && next_scheduled_stage">
              <keep-alive>
                <component
                  :is="componentStageTeaser"
                  :stage="localStage"
                ></component>
              </keep-alive>
            </div>

          </q-card-section>

        </q-card> -->
    <!-- </q-step>
    </q-stepper> -->

  </q-page>
</template>


<script>
import AssemblyMixin from "src/mixins/assembly";
import { LayoutEventBus } from "src/utils/eventbus.js";
// import { mapGetters } from "vuex";
import AMs from "./ArtificialModeration";
import ArtificialModeration from "src/components/artificial_moderation/ArtificialModeration.vue";

export default {
  name: "PageAssemblyHome",
  mixins: [AssemblyMixin],

  data() {
    return {
      // AMs,
      // that: this,
    };
  },

  components: {
    // ArtificialModeration,
  },

  computed: {
    // stageType: function () {
    //   return this.stage_last_visited?.stage?.type;
    // },
    // componentStageTeaser() {
    //   console.assert(this.stageType);
    //   return () =>
    //     import(
    //       `src/plugins/${this.assemblyType}/artificialmoderation/${this.stageType}/StageTeaser`
    //     )
    //       .then((teaser) => teaser)
    //       .catch(() => ArtificialModeratorAssemblyStage);
    // },
    // ...mapGetters("assemblystore", [
    //   "assemblyType",
    //   "IsDelegate",
    //   "IsExpert",
    //   "IsContributor",
    //   "IsObserver",
    //   "IsManager",
    // ]),
  },

  methods: {
    // getStepCaption: function (stage, stageNr) {
    //   var caption = "";
    //   // PREFIX
    //   if (this.is_stage_completed(stage)) {
    //     caption = this.$i18n.t("stages.status_completed");
    //   } else if (!this.is_stage_done(stage)) {
    //     caption = this.$i18n.t("stages.status_not_yet_accessible");
    //   } else if (stage.stage.disabled) {
    //     caption = this.$i18n.t("stages.status_disabled");
    //   } else if ("deleted" in stage.stage && stage.stage.deleted) {
    //     caption = this.$i18n.t("stages.status_deleted");
    //   }
    //   if (caption) {
    //     return `(${caption})`;
    //   }
    // },
    // getIcon(stage) {
    //   console.assert(stage);
    //   if (this.is_stage_disabled(stage)) {
    //     return "mdi-cancel";
    //   }
    //   if (this.last_accessible_stage == stage) {
    //     return "mdi-bell";
    //   }
    //   if (
    //     this.last_accessible_stage?.stage.order_position <
    //     stage.stage.order_position
    //   ) {
    //     return "mdi-clock-time-eleven-outline";
    //   }
    //   return "mdi-check-bold";
    // },
    // getColor(stage) {
    //   var color = "green-6";
    //   if (this.is_stage_disabled(stage)) {
    //     return "grey-4";
    //   }
    //   if (this.is_stage_completed(stage)) {
    //     return "green-3";
    //   }
    //   if (this.last_accessible_stage == stage) {
    //     return "blue-9";
    //   }
    //   if (!this.is_stage_accessible(stage)) {
    //     return "orange-5";
    //   }
    //   return color;
    // },
    // is_stage_accessible(stage) {
    //   return (
    //     this.last_accessible_stage?.stage.order_position >=
    //     stage.stage.order_position
    //   );
    // },
  },

  created() {
    // Not for moderators, here...
    // if (this.assembly.acl.includes("manage")) {
    //   this.gotoAssemblyHome(this.assembly);
    // }

    this.$root.gotoAssemblyHome(this.assembly);

    // Catch all authentication status changes
    LayoutEventBus.$once("AssemblyLoaded", (data) => {
      // console.log("LayoutEventBus on AssemblyLoaded")
      // this.gotoDefaultStageTeaser();
      this.$root.gotoAssemblyHome(this.assembly);
    });

    this.gotoDefaultStageTeaser();
  },
};
</script>
