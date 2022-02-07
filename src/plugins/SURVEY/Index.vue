<template>
  <q-page class="doc_content">
    <ArtificialModeration :AM="AMs.survey" alignment="center" :ctx="this" />
    <div v-if="routed_stage">
      <div v-if="!isRoutedStageCompleted && !check_data">
        <h2>{{ routed_stage.stage.title }}</h2>
        <q-banner class="bg-grey-3 q-mb-lg">
          <template v-slot:avatar>
            <q-icon name="mdi-alert-circle-outline" color="primary" />
          </template>
          {{ $t('survey.misconfiguration_error') }}
          <template v-slot:action>
            <q-btn
              flat
              :label="$t('assemblies.go_back_to_assembly_home')"
              @click="gotoAssemblyHome(this.assembly)"
            />
          </template>
        </q-banner>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
// import StageMixin from 'src/mixins/stage';
import i18nPluginMixin from './i18n';
import AMs from './ArtificialModeration';
import ArtificialModeration from 'src/pages/components/artificial_moderation/ArtificialModeration.vue';
import localI18n from './i18n';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import useAuthComposable from 'src/composables/auth.composable';
import useStageComposable from 'src/composables/stage.composable';
import useAssemblyComposable from 'src/composables/assembly.composable';

export default defineComponent({
  setup() {
    const i18n = useI18n();
    i18n.mergeLocaleMessage('de-ch', localI18n['de-ch']);
    const { userid } = useAuthComposable();
    const {
      routed_stage,
      markUnAlert,
      gotoStage,
      markCompleted,
      nextScheduledStage,
      isRoutedStageCompleted,
    } = useStageComposable();
    const { gotoAssemblyHome, assemblyIdentifier, assembly, stageID } =
      useAssemblyComposable('');

    return {
      userid,
      assembly,
      gotoAssemblyHome,
      routed_stage,
      markUnAlert,
      gotoStage,
      markCompleted,
      nextScheduledStage,
      isRoutedStageCompleted,
      assemblyIdentifier,
      stageID,
      ...i18nPluginMixin,
    };
  },
  name: 'Survey',
  components: {
    ArtificialModeration,
  },
  data() {
    return {
      AMs,
    };
  },
  computed: {
    redirecting(): boolean {
      return (
        this.routed_stage && this.check_data && !this.isRoutedStageCompleted
      );
    },

    check_data(): boolean | null {
      console.log('check survey data..');

      if (this.routed_stage === undefined) {
        return null;
      }

      if (
        !this.routed_stage.stage.custom_data ||
        !this.routed_stage.stage.custom_data.provider ||
        !this.routed_stage.stage.custom_data.SID
      ) {
        console.error('no survey data provided at this stage..');
        console.error(this.routed_stage.stage.custom_data);
        return false;
      }
      return true;
    },

    is_a_survey_response(): boolean | undefined {
      if (!this.$route.query.completed) {
        return undefined;
      }
      if (this.userid != this.$route.query.U) {
        return false;
      }
      return true;
    },
  },

  methods: {
    redirectToSurveyProvider() {
      // all data available
      const SID = this.routed_stage.stage.custom_data.SID;
      // this.$router.currentRoute.path
      let url = process.env.ENV_SURVEY_URL as string;
      console.log(url, 'DEBUGGGGG');
      var re = /:SID:/g;
      var newurl = url.replace(re, SID);
      re = /:USERID:/g;
      newurl = newurl.replace(re, this.userid);
      re = /:STAGEID:/g;
      newurl = newurl.replace(re, this.stageID);
      re = /:ASSEMBLYIDENTIFIER:/g;
      newurl = newurl.replace(re, this.assemblyIdentifier);
      window.location.href = newurl;

      return true;
    },
  },

  created: function () {
    // Completed Response?
    if (!this.isRoutedStageCompleted) {
      if (this.is_a_survey_response) {
        // Seems to be a survey response: survey is finished...
        console.log('aooos')
        this.markCompleted();
      } else {
        this.redirectToSurveyProvider();
      }
    }
  },
});
</script>
