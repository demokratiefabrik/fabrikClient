<style lang="sass" scoped>
.showAsButton
  text-align: center
  margin-left: auto
  margin-right: auto
  max-width: 300px
</style>
</style>
<template>
  <!-- class="bg-indigo-1" -->
  <q-expansion-item
    popup
    :value="showProposeForm"
    @input="toggleProposeForm"
    :class="{'showAsButton': !showProposeForm}"
    header-class="bg-yellow"
    icon="mdi-sticker-plus-outline"
  >

    <template
      template
      v-slot:header
    >
      <q-item-section avatar>
        <q-icon
          name="mdi-lightbulb-outline"
          size="md"
        />
      </q-item-section>
      <q-item-section>
        <q-item-label>
          Neuer Antrag für eine smartvote-Frage einreichen</q-item-label>
        <!-- <q-item-label
          caption
          class=""
        >
          Welcher Aspekt des Themas '{{topic.content.title}}' ist für Sie wichtig aber fehlt in der obigen Fragenliste?
        </q-item-label> -->
      </q-item-section>
      <a :name="`NEWPROPOSAL`" />

    </template>

    <q-card v-if="showProposeForm">
      <br>
      <q-card-section
        class="q-mb-md q-ml-md text-notification"
        v-if="CONTENTTREE.limitForAddingProposalsReached"
      >

        Sie haben heute schon {{dailyContributionLimits.current}} Anträge eingereicht. Damit haben Sie die Tageslimite erreicht.
        Ab morgen früh können Sie wieder neue Anträge stellen.
      </q-card-section>
      <q-card-section
        class="q-mb-md q-ml-md "
        v-if="newlyEnteredContent || !CONTENTTREE.limitForAddingProposalsReached"
      >

        <q-form
          @submit="onSubmit"
          @reset="onReset"
          class="q-gutter-md"
        >
          Bitte bestätigen Sie die folgenden Punkte:<br>
<div class="q-pb-md">
          <q-toggle
            v-model="accept1"
            class="q-ma-none"
            :label="$t('common_properties.insert.criteria_accept.1')"
          />
          <ListOfOlderSameLevelEntries />
          <q-toggle
            class="q-ma-none"
            v-model="accept2"
            :label="$t('common_properties.insert.criteria_accept.2', {topic: topic.content.title})"
          />

          <q-toggle
            class="q-ma-none"
            v-model="accept3"
            :label="$t('common_properties.insert.criteria_accept.3')"
          />
          <SmartvoteCriteria />
          <br>
</div>&nbsp;
<div>

  Wie lautet die Frage, die Sie vorschlagen möchten? <br>
          <q-input
            filled
            class="full-width"
            v-model="localmodel.title"
            label="smartvote-Frage: *"
            :hint="`Häufige Formulierungen lauten etwa:
              'Soll das Gesetz XY geändert werden?' oder 'Unterstützen Sie die Einführung von XY?'`"
            counter
            lazy-rules
            :maxlength="maxTitleLength"
            :rules="[ val => val && val.length > 0 || 'Geben Sie hier die smartvote-Frage ein.',
                      val => val && val.length > 0 && val.length < maxTitleLength || `Dieser Text darf nicht über 3000 Zeichen lang sein.`]"
          />

          <br>
          <br>
Bitte teilen Sie den anderen Demokratiefabrik-Mitgliedern mit, warum Ihre Frage in den smartvote-Fragebogen aufgenommen werden soll. Dieser Beitrag erscheint dann im Diskussionsforum zur Frage.
          <q-input
            filled
            v-model="localmodel.text"
            counter
            label='Warum soll die Frage in den smartvote-Fragebogen?'
            :maxlength="maxTextLength"
            type="textarea"
            lazy-rules
            :rules="[
          val => val && val.length > 0 || 'Geben Sie hier eine Begründung ein.',
          val => val && val.length > 0 && val.length < maxTextLength || `Dieser Text muss zwischen 1 und 3000 Zeichen lang sein.`
        ]"
          />

          <p> Hinweis: Sie können maximal {{dailyContributionLimits.daylimit}} Anträge pro Tag einreichen. <span v-if="dailyContributionLimits.current">Sie haben bereits {{dailyContributionLimits.current}} eingereicht.</span>
          </p>
</div>
          <div>
            <q-btn
              label="Vorschlag einreichen"
              type="submit"
              color="primary"
            />
            <q-btn
              label="Schliessen"
              type="reset"
              color="primary"
              flat
              class="q-ml-sm"
            />
          </div>
        </q-form>

        <!-- <q-dialog
          v-if="newlyEnteredContent && newlyEnteredContent.content"
          v-model="showSalienceDialog"
          persistent
        >
          <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h6">Ihre Frage '{{newlyEnteredContent.content.title}}' wurde gespeichert</div>
              <p>
                Bestimmt ist diese Frage für Sie sehr bedeutend. Doch wie sehr bedeutend ist sie?
              </p>
              {{newlyEnteredContent.progression.salience}}
              <ContentSalienceSlider
                :content="newlyEnteredContent"
                instruction=""
              />

            </q-card-section>

            <q-card-actions
              align="right"
              class="q-ma-lg"
            >
              <q-btn @click="closeSalienceDialog">Absenden</q-btn>
            </q-card-actions>
          </q-card>
        </q-dialog> -->

      </q-card-section>
    </q-card>
  </q-expansion-item>

</template>

<script>
import { mapActions } from "vuex";
import api from "src/utils/api";
import { runtimeStore } from "src/store/runtime.store";
import SmartvoteCriteria from "../../components/SmartvoteCriteria";
import ListOfOlderSameLevelEntries from "../../components/ListOfOlderSameLevelEntries";
import ContentSalienceSlider from "src/pages/ContentTree/components/ContentSalienceSlider";
import { mapGetters } from "vuex";

export default {
  name: "ProposeVAAQuestion",
  inject: [
    "CONTENTTREE",
    // "STAGE",
    "getDailyContributionLimits",
    "markDiscussed",
  ],
  data() {
    return {
      // showSalienceDialog: false,
      newlyEnteredContent: null,
      localmodel: {
        title: "",
        comment_title: "Begründung durch den Antragstellenden",
        text: "",
        type: "VAA_QUESTION",
        parent_id: null,
      },
      accept1: false,
      accept2: false,
      accept3: false,
      // isShownProposeForm: false,
    };
  },

  components: {
    ContentSalienceSlider,
    ListOfOlderSameLevelEntries,
    SmartvoteCriteria,
  },

  props: ["topic", "showProposeForm"],

  computed: {
    dailyContributionLimits() {
      const limits = this.getDailyContributionLimits();
      return limits.number_of_proposals;
    },
    maxTextLength() {
      return this.get_content_text_max_length({
        contenttreeID: this.CONTENTTREE.contenttree.id,
        type: "COMMENT",
      });
    },
    maxTitleLength() {
      return this.get_content_title_max_length({
        contenttreeID: this.CONTENTTREE.contenttree.id,
        type: "VAA_QUESTION",
      });
    },
    ...mapGetters({
      get_content_text_max_length: "contentstore/get_content_text_max_length",
      get_content_title_max_length: "contentstore/get_content_title_max_length",
    }),
  },

  methods: {
    hideProposeForm() {
      // this.showProposeForm = false;
      this.$emit("toggle", false);
    },

    toggleProposeForm() {
      this.$emit("toggle", !this.showProposeForm);
    },

    onSubmit() {
      if (!this.accept1) {
        this.$q.notify({
          type: "nFabrikWarning",
          message:
            "Sie müssen bestätigen, dass die Frage nicht bereits so oder ähnlich im Katalog drin ist.",
        });
      }
      if (!this.accept2) {
        this.$q.notify({
          type: "nFabrikWarning",
          message: `Sie müssen bestätigen, dass die Frage zum aktuell ausgewählten Thema '${this.topic.content.title}' gehört.`,
        });
      }
      if (!this.accept3) {
        this.$q.notify({
          type: "nFabrikWarning",
          message:
            "Sie müssen bestätigen, dass Sie smartvote-Kriterien einigermassen erfüllt sind.",
        });
      }

      if (this.accept1 && this.accept2 && this.accept3) {
        // MARK TOPIC AS DISCUSSED
        this.markDiscussed(this.topic);

        // RPOPOSE
        console.log("Propose new SV-Question");
        var assemblyIdentifier = runtimeStore.assemblyIdentifier;
        this.localmodel.parent_id = this.topic.content.id;
        console.assert(this.localmodel.parent_id);
        console.assert(this.CONTENTTREE.contenttree.id);
        console.assert(assemblyIdentifier);

        api
          .proposeContent(
            assemblyIdentifier,
            parseInt(this.CONTENTTREE.contenttree.id),
            this.localmodel
          )
          .then((response) => {
            console.log(response.data);
            console.log("Model saved");

            // ERROR RESPONSE
            if (response.data.OK) {
              // Update Vuex Store
              console.assert("content" in response.data);
              console.log("SEND TO VUEX", response.data.content);
              this.update_content({ contentTuple: response.data.content });
              if (response.data.comment) {
                this.update_content({ contentTuple: response.data.comment });
              }
              this.$store.dispatch("peerreviewstore/updatePeerreviewTuple", {
                peerreviewTuple: response.data.peerreview,
              });

              if ("notifications" in response.data) {
                console.log(
                  "RETRIEVED NOTIFICATIONS",
                  response.data.peerreviews
                );
                this.$store.dispatch(
                  "publicprofilestore/update_notifications",
                  {
                    notifications: response.data.notifications,
                  }
                );
              }

              this.$store.dispatch(
                "assemblystore/incrementAssemblyActivityCounter",
                { counterName: "number_of_proposals_today" }
              );

              // Success Message.
              this.$q.notify({
                type: "nFabrikInfo",
                message:
                  "Der Antrag wurde eingereicht und wird ab sofort von anderen Teilnehmenden begutachtet.",
              });
              this.newlyEnteredContent = response.data.content;
              // this.showSalienceDialog = true;
            } else {
              // Error Message
              this.$q.notify({
                type: "nFabrikError",
                message:
                  "Das Formular konnte nicht verarbeitet werden. Bitte informieren Sie die Veranstalter.",
              });
            }
          })
          .catch((error) => {
            console.warn(error);
            this.$q.notify({
              type: "nFabrikError",
              message:
                "Das Formular konnte nicht verarbeitet werden. Bitte informieren Sie die Veranstalter.",
            });
            // Error Handling is done in Axios Interceptor
          });
      }
    },

    ...mapActions({
      update_content: "contentstore/update_content",
    }),

    closeDialog() {
      setTimeout(() => {
        this.hideProposeForm();
      }, 10);
    },

    closeSalienceDialog() {
      this.update_content({ contentTuple: this.newlyEnteredContent });
      // this.showSalienceDialog = false;
      this.newlyEnteredContent = null;
      this.onReset();
    },

    onReset() {
      this.accept1 = false;
      this.accept2 = false;
      this.accept3 = false;
      this.newlyEnteredContent = null;
      this.localmodel.title = "";
      this.localmodel.text = "";
      this.smartvoteHintsDialog = false;
      this.closeDialog();
    },
  },

  created() {
    // this.newlyEnteredContent = this.topic;
  },
};
</script>
