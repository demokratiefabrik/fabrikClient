<template>
  <q-page
    class="doc_content"
    v-if="ready"
  >
    <ArtificialModeration
      :AM="AMs.survey"
      alignment="center"
      :ctx="this"
    />

    <!-- MISCONFIGURATION ERROR -->
    <div v-if="routed_stage">

      <div v-if="!is_stage_completed(routed_stage) && !check_data">
        <h2>{{routed_stage.stage.title}}</h2>

        <q-banner class="bg-grey-3 q-mb-lg">
          <template v-slot:avatar>
            <q-icon
              name="mdi-alert-circle-outline"
              color="primary"
            />
          </template>
          {{ $t('survey.misconfiguration_error') }}
          <template v-slot:action>
            <q-btn
              flat
              :label="$t('assemblies.go_back_to_assembly_home')"
              @click="$root.gotoAssemblyHome(this.assembly)"
            />
          </template>
        </q-banner>
      </div>

    </div>

  </q-page>
</template>


<script>
import StageMixin from "src/mixins/stage";
import i18nPluginMixin from "./i18n";
import AMs from "./ArtificialModeration.js";
import ArtificialModeration from "src/components/artificial_moderation/ArtificialModeration.vue";
import { runtimeStore } from "src/store/runtime.store";

export default {
  name: "Survey",
  components: {
    ArtificialModeration,
  },
  mixins: [StageMixin, i18nPluginMixin],

  data() {
    return {
      AMs,
    };
  },
  computed: {
    redirecting() {
      return (
        this.routed_stage &&
        this.check_data &&
        !this.is_stage_completed(this.routed_stage)
      );
    },

    check_data: function () {
      console.log("check survey data..");

      if (this.routed_stage === undefined) {
        // not yet loaded...
        return null;
      }

      if (
        !this.routed_stage.stage.custom_data ||
        !this.routed_stage.stage.custom_data.provider ||
        !this.routed_stage.stage.custom_data.SID
      ) {
        console.log("no survey data provided at this stage..");
        console.log(this.routed_stage.stage.custom_data);
        return false;
      }
      return true;
    },

    is_a_survey_response() {
      if (!this.$route.query.completed) {
        return;
      }
      if (this.oauth.userid != this.$route.query.U) {
        return false;
      }

      return true;
    },
  },

  methods: {
    redirectToSurveyProvider: function () {
      // all data available
      const SID = this.routed_stage.stage.custom_data.SID;
      // this.$router.currentRoute.path
      let url = process.env.ENV_SURVEY_URL;
      var re = /:SID:/g;
      var newurl = url.replace(re, SID);
      re = /:USERID:/g;
      newurl = newurl.replace(re, this.oauth.userid);
      re = /:STAGEID:/g;
      newurl = newurl.replace(re, runtimeStore.stageID);
      re = /:ASSEMBLYIDENTIFIER:/g;
      newurl = newurl.replace(re, runtimeStore.assemblyIdentifier);
      window.location.href = newurl;

      return true;
    },
  },

  created: function () {
    // Completed Response?
    if (!this.is_stage_completed(this.routed_stage)) {
      if (this.is_a_survey_response) {
        this.markCompleted();
      } else {
        this.redirectToSurveyProvider();
      }
    }
  },
};
</script>
