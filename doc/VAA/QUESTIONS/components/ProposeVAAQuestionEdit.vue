<template>
  <div class="q-pa-md">
    <q-card-section
      class="q-mb-md q-ml-md text-notification"
      v-if="
        CONTENTTREE.limitForAddingProposalsReached &&
        !CONTENTTREE.overallLimitForAddingProposalsReached
      "
    >
      Sie haben heute schon {{ dailyContributionLimits.current }} Anträge
      eingereicht. Damit haben Sie die Tageslimite erreicht. Ab morgen früh
      können Sie wieder neue Anträge stellen.
    </q-card-section>

    <q-card-section
      class="q-mb-md q-ml-md text-notification"
      v-if="CONTENTTREE.overallLimitForAddingProposalsReached"
    >
      Sie haben das Maximum an möglichen Anträgen pro Teilnehmenden erreicht.
      Wir danken Ihnen für Ihr grosses Engagement in der Demokratiefabrik.
    </q-card-section>

    <q-form
      ref="qform"
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
      v-if="
        !CONTENTTREE.overallLimitForAddingProposalsReached &&
        !CONTENTTREE.limitForAddingProposalsReached &&
        !node.content.pending_peerreview_for_update &&
        !node.content.pending_peerreview_for_insert
      "
    >
      Bitte bestätigen Sie zuerst folgende Aussagen:<br />
      <q-toggle
        v-model="accept1"
        class="q-ma-none"
        :label="$t('common_properties.update.criteria_accept.1')"
      />
      <q-toggle
        class="q-ma-none"
        v-model="accept2"
        :label="$t('common_properties.update.criteria_accept.2')"
      />

      <q-toggle
        class="q-ma-none"
        v-model="accept3"
        :label="$t('common_properties.update.criteria_accept.3')"
      />

      <SmartvoteCriteria />

      <br />
      <q-input
        style="clear: both"
        filled
        counter
        v-model="localmodel.title"
        label="Die Frage an die Kandidierenden *"
        :maxlength="maxTitleLength"
        :hint="`Häufige Formulierungen lauten etwa:
              'Soll das Gesetz XY geändert werden?' oder 'Unterstützen Sie die Einführung von XY?'`"
        lazy-rules
        :rules="[
          (val) =>
            (val && val.length > 0) ||
            'Geben Sie hier die smartvote-Frage ein.',
        ]"
      />

      <br />

      <q-input
        filled
        v-model="localmodel.text"
        label="Warum nehmen Sie die Änderung vor? Begründen Sie es bitte kurz. *"
        type="textarea"
        counter
        :maxlength="maxTextLength"
        lazy-rules
        :rules="[
          (val) =>
            (val !== null && val !== '') ||
            'Versuchen Sie die anderen Teilnehmenden von dieser Änderung zu überzeugen.',
          (val) =>
            (val && val.length > 0 && val.length <= maxTextLength) ||
            `Die Beschreibung muss zwischen 0 und ${maxTextLength} Zeichen lang sein.`,
        ]"
      />
      <p>
        Hinweis: Sie können heute maximal
        {{ dailyContributionLimits.daylimit }}
        {{
          dailyContributionLimits.daylimit == 1 ? 'Antrag' : 'Anträge'
        }}
        einreichen.
        <span v-if="dailyContributionLimits.current"
          >Sie haben bereits
          {{ dailyContributionLimits.current }} eingereicht.</span
        >
        <!-- <p> Hinweis: Sie können maximal {{dailyContributionLimits.daylimit}} Anträge pro Tag einreichen. <span v-if="dailyContributionLimits.current">Sie haben bereits {{dailyContributionLimits.current}} eingereicht.</span> -->
      </p>

      <div>
        <q-btn
          label="Änderungsvorschlag einreichen"
          type="submit"
          color="primary"
        />
        <q-btn
          label="Vorschlag verwerfen"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
        />
      </div>
    </q-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import api from 'src/utils/api';
import SmartvoteCriteria from '../../components/SmartvoteCriteria';
import { mapGetters } from 'vuex';
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    const { assemblyIdentifier } = useAssemblyComposable();
    return { assemblyIdentifier };
  },
  name: 'ProposeVAAQuestionEdit',
  inject: ['CONTENTTREE', 'getDailyContributionLimits', 'markDiscussed'],
  data() {
    return {
      localmodel: {
        title: '',
        text: '',
      },
      accept1: false,
      accept2: false,
      accept3: false,
    };
  },
  components: {
    SmartvoteCriteria,
  },
  props: ['node'],
  computed: {
    dailyContributionLimits() {
      const limits = this.getDailyContributionLimits();
      return limits.number_of_proposals;
    },
    maxTextLength() {
      return this.get_content_text_max_length({
        contenttreeID: this.CONTENTTREE.contenttree.id,
        type: 'COMMENT',
      });
    },
    maxTitleLength() {
      return this.get_content_title_max_length({
        contenttreeID: this.CONTENTTREE.contenttree.id,
        type: 'VAA_QUESTION',
      });
    },
    ...mapGetters({
      get_content_text_max_length: 'contentstore/get_content_text_max_length',
      get_content_title_max_length: 'contentstore/get_content_title_max_length',
    }),
  },
  methods: {
    onSubmit() {
      var assemblyIdentifier = this.assemblyIdentifier;
      console.assert(this.CONTENTTREE.contenttree.id);
      console.assert(assemblyIdentifier);

      if (!this.accept1) {
        this.$q.notify({
          type: 'nFabrikWarning',
          message:
            'Sie müssen bestätigen, dass die ursprüngliche Idee der Frage erhalten bleibt.',
        });
      }
      if (!this.accept2) {
        this.$q.notify({
          type: 'nFabrikWarning',
          message: `Sie müssen bestätigen, dass ihre Änderung nach bestem Wissen und Gewissen eine Verbesserung der Frage darstellt.`,
        });
      }
      if (!this.accept3) {
        this.$q.notify({
          type: 'nFabrikWarning',
          message:
            'Sie müssen bestätigen, dass Sie mit dieser Änderung die smartvote-Kriterien einhalten.',
        });
      }

      const data = { ...this.localmodel };
      // Transmit only the data that changed.
      if (this.node.content.title == data.title) {
        this.$q.notify({
          type: 'nFabrikWarning',
          message: 'Es wurden keine Änderungen vorgenommen.',
        });
        return null;
      }

      if (this.accept1 && this.accept2 && this.accept3) {
        // MARK TOPIC AS DISCUSSED
        // this.markDiscussed(this.topic);

        // SUBMIT PROPOSAL
        console.log('Propose new SV-Question');
        data.id = this.node.content.id;
        api
          .proposeContent(
            assemblyIdentifier,
            this.CONTENTTREE.contenttree.id,
            data
          )
          .then((response) => {
            console.log(response.data);
            console.log('Model saved');

            // ERROR RESPONSE
            if (response.data.OK) {
              // Update Vuex Store
              console.assert('peerreview' in response.data);
              console.log('SEND TO VUEX', response.data.peerreview);
              this.$store.dispatch('peerreviewstore/updatePeerreviewTuple', {
                peerreviewTuple: response.data.peerreview,
              });

              if (response.data.content) {
                this.update_content({ contentTuple: response.data.content });
                console.log(
                  'SEND DISCUSSION CONTENT TO VUEX',
                  response.data.content
                );
              }

              if ('notifications' in response.data) {
                console.log(
                  'RETRIEVED NOTIFICATIONS',
                  response.data.peerreviews
                );
                this.$store.dispatch(
                  'publicprofilestore/update_notifications',
                  {
                    notifications: response.data.notifications,
                  }
                );
              }

              this.$store.dispatch(
                'assemblystore/incrementAssemblyActivityCounter',
                { counterName: 'number_of_proposals_today' }
              );

              // Success Message.
              this.$q.notify({
                type: 'nFabrikInfo',
                message:
                  'Der Antrag wurde eingereicht und wird ab sofort von anderen Teilnehmenden begutachtet.',
              });

              this.onReset('peerreviews');
            } else {
              // Error Message
              this.$q.notify({
                type: 'nFabrikError',
                message:
                  'Das Formular konnte nicht verarbeitet werden. Bitte informieren Sie die Veranstalter.',
              });
            }
          })
          .catch((error) => {
            console.warn(error);
            this.$q.notify({
              type: 'nFabrikError',
              message:
                'Das Formular konnte nicht verarbeitet werden. Bitte informieren Sie die Veranstalter.',
            });
            // Error Handling is done in Axios Interceptor
          });
      }
    },

    ...mapActions({
      update_content: 'contentstore/update_content',
    }),

    closeDialog(destinationTab) {
      console.log('DESTINATION TAB', destinationTab);
      setTimeout(() => {
        this.$emit('switch-tab', destinationTab);
      }, 10);
    },

    onReset(destinationTab) {
      this.accept1 = false;
      this.accept2 = false;
      this.accept3 = false;
      this.localmodel.title = this.node.content.title;
      this.localmodel.text = '';
      this.smartvoteHintsDialog = false;
      this.$refs.qform.resetValidation();
      // console.log("closeDialog ", destinationTab);
      this.closeDialog(destinationTab);
    },
  },

  mounted() {
    this.localmodel.title = this.node.content.title;
  },
});
</script>
