<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>

<template>
  <q-page class="doc_content">
    <div
      class="row justify-between"
      v-if="!$loaded(ready)"
    >
      <div class="seperator">
        <q-spinner-dots size="2rem" />
      </div>
    </div>

    <div v-if="ready">
      <h2>{{isManualFocusStage ? 'Zweites Thema:' : 'Der smartvote-Fragenkatalog:'}} Was wollen Sie von den Kandidierenden wissen, bevor Sie sie wählen? </h2>
      <a name="TOPICSELECTION" />

      <p>
        Hier geht es darum, ein breites Spektrum an relevanten politischen Fragen zusammenzustellen. Aus den von den Teilnehmenden der Demokratiefabrik am besten bewerteten Fragen bildet sich am Ende der smartvote-Fragebogen.
      </p>

      <ArtificialModeration
        :AM="AMs.questions_top_partner"
        amGroup="questions_intro"
        alignment="left"
        :role="2"
        :ctx="this"
      />

      <!-- TOPIC SELECTION -->
      <VAATopicSelector
        v-if="focusedContent || !isRandomFocusStage"
        @input="selectTopicPrepare"
        :topicID="contentID"
        :nofSalienceUncompleted="nofSalienceUncompleted"
        :disabled="(VAAQuestionStagesAlerted && VAAQuestionStagesAlerted.length) && focusedContent"
      />
      <ArtificialModeration
        :AM="AMs.questions_choose_manual_topic"
        amGroup="questions_intro"
        alignment="right"
        :role="1"
        :ctx="this"
      />
      <div
        class="row justify-between"
        v-if="detailView && !$loaded(nodeChildrenExceptUserPeerreviews) && contentID"
      >
        <div class="seperator">
          <q-spinner-dots size="2rem" />
        </div>
      </div>

      <!-- QUESTIONS -->
      <transition name="fade">
        <div v-if="detailView && $loaded(nodeChildrenExceptUserPeerreviews)">

          <div class="row justify-between">
            <div class="seperator">
              <q-icon name="mdi-star-four-points-outline" />
            </div>
          </div>

          <br><br>
          <a name="SALIENCE" />

          <ArtificialModeration
            :AM="AMs.questions_current_state"
            alignment="right"
            :ctx="this"
          />
          <h2>
            <q-badge
              v-if="milestoneSALIENCE"
              color="green"
              style="position:relative; top:-1em;"
            >
              <q-icon
                name="mdi-check"
                size="1.2em"
              />
            </q-badge>
            Aktueller Stand des Fragenkatalogs
          </h2>

          <p v-if="nodeChildrenExceptUserPeerreviews.length === 0">
            Der Fragenkatalog zum Thema '{{node.content.title}}' ist momentan noch leer.
          </p>
          <p v-else-if="nodeChildrenExceptUserPeerreviews.length == 1">
            Zu diesem Thema wurde bisher folgende Fragen '{{node.content.title}}' eingetragen. <br>
          </p>
          <p v-else-if="nodeChildrenExceptUserPeerreviews.length > 1">
            Zu diesem Thema wurden bisher {{nodeChildrenExceptUserPeerreviews.length}} Fragen eingetragen. <br>
          </p>

          <SalienceList
            v-if="nodeChildren && nodeChildrenExceptUserPeerreviews.length"
            salienceInstruction="Wie wichtig ist Ihnen diese Frage für den smartvote-Fragebogen? Bitte verschieben Sie den Regler."
            :salienceCompleted="salienceCompleted"
            :contentList="nodeChildrenExceptUserPeerreviewsLimited"
            :showBackgroundPage="true"
            :hideText="true"
            @item-saliencing="incrementNumberOfCurrentlySaliencedEntries"
            @item-read="itemRead"
            :itemIcon="ICON_VAA_QUESTION"
            titlePrefix="smartvote-Frage"
            discussionIntro="Sie können hier über diese smartvote-Frage diskutieren. Im Forum werden auch die eingereichten Verbesserungsvorschläge zur Formulierung der Frage aufgelistet. So können die Überlegungen der anderen Teilnehmenden nachvollzogen werden."
            captionPrefix="Alles über die smartvote-Frage"
          ></SalienceList>
          <br>
          <div v-if="tooManyQuestions">
            <div v-if="areNodeChildrenLimited">
              Es werden {{nodeChildrenExceptUserPeerreviewsLimited.length}} von {{nodeChildrenExceptUserPeerreviews.length}} Fragen angezeigt. Klicken Sie auf 'Alle anzeigen' um sich alle Fragen zu diesem Thema anzeigen zu lassen.
              <q-chip
                clickable
                size="1.2em"
                @click="toggleSalienceListLimit(false)"
              > Alle anzeigen</q-chip>
              <!-- &nbsp;<span v-if="nofHiddenUnsaliencedQuestions">(inklusive {{nofHiddenUnsaliencedQuestions}} unbewertete Fragen</span>) -->
            </div>
            <div v-else>
              Es sind bereits einige Fragen zu diesem Thema eingetragen worden. Klicken Sie auf 'Weniger anzeigen' um nur eine zufällige Auswahl von Fragen eingeblendet zu lassen.
              <q-chip
                clickable
                size="1.2em"
                @click="toggleSalienceListLimit(true)"
              > Weniger anzeigen</q-chip>
            </div>
          </div>

          <br>
          <br>

          <a name="PEERREVIEW" />

          <br><br>
          <div class="row justify-between">
            <div class="seperator">
              <q-icon name="mdi-star-four-points-outline" />
            </div>
          </div>

          <Skeleton
            v-if="!milestoneSALIENCE"
            h2="Involvierte Gutachten"
          />

          <div v-if="milestoneSALIENCE">
            <br>
            <h2>
              <q-badge
                v-if="milestonePEERREVIEW"
                color="green"
                style="position:relative; top:-1em;"
              >
                <q-icon
                  name="mdi-check"
                  size="1.2em"
                />
              </q-badge> Gutachten: Vorschläge der anderen Teilnehmenden prüfen
            </h2>
            <!-- <p>Wir möchten, dass Sie uns helfen, die Vorschläge der anderen Teilnehmenden zu beurteilen.</p> -->
            <p>
              Als Teilnehmerin und Teilnehmer der Demokratiefabrik sind Sie automatisch auch Gutachterin respektive Gutachter. Somit sind Sie mitverantwortlich, ob die vorgeschlagenen Fragen im Fragenkatalog der Demokratiefabrik verbleiben und somit die Chance erhalten bleibt, in den finalen smartvote-Fragebogen einzufliessen.
              <!-- <br><br> -->
              <!-- Als Teilnehmerin und Teilnehmer der Demokratiefabrik sind Sie automatisch auch Gutachterin respektive Gutachter. Somit sind Sie mitverantwortlich, ob die vorgeschlagenen Fragen im Fragenkatalog der Demokratiefabrik bleiben. -->
            </p>
            <div v-if="Object.values(contents_to_peerreview).length">

              <ArtificialModeration
                :AM="AMs.questions_peerreview"
                alignment="left"
                :ctx="this"
              />
              <q-list>

                <PeerReviewListItem
                  v-for="(peerreviews, contentID)  in Object.values(contents_to_peerreview)"
                  :key="`contentID${contentID}`"
                  :peerreviews="peerreviews"
                  :topic="node"
                  @completed-peerreview="areAllPeerReviewCompleted"
                  ref="peerreview_lists"
                ></PeerReviewListItem>

              </q-list>
              <!-- {{lastMonitorUpdate}} -->
              <!-- Bei {{openPeerreviewTasks.length === 1 ? 'einer smartvote-Frage' : `${openPeerreviewTasks.length} smartvote-Fragen`}} ist ihr Urteil gefragt. -->
            </div>
            <div
              v-else
              class="text-notification"
            >
              Zu diesem Thema wurde Ihnen aktuell kein Gutachten zugewiesen.
            </div><br>

            <!-- Zusammen mit mindestens 10 anderen zufällig ausgewählten Könizer und Könizerinnen und Könizer können sie entscheiden, ob folgende
            Anträge genehmigt werden sollen oder nicht. -->

            <!-- Disclaimer -->
            <AlgorithmDisclaimer
              :expanded="true"
              :text="`Wir wollen, dass möglichst viele Könizerinnen und Könizer mitentscheiden, welche Fragen im Fragenkatalog der Demokratiefabrik erscheinen. Deshalb fragen wir jeden Tag aufs Neue zufällige Teilnehmerinnen und Teilnehmer an, uns Ihr Urteil zu einem Vorschlag mitzuteilen. Die Mehrheit dieser zufällig angefragten Könizerinnen und Könizer entscheidet dann, ob der Antrag gutgeheissen wird. Wird der Antrag abgelehnt, wird der Fragevorschlag nicht mehr länger im Fragenkatalog der Demokratiefabrik angezeigt. Wird der Antrag angenommen, verbleibt die Frage im Rennen um einen Platz im smartvote-Fragebogen.`"
            />

          </div>

          <!-- 3. Etappe -->
          <a name="PROPOSE" />

          <div class="row justify-between">
            <div class="seperator large">
              <q-icon name="mdi-star-four-points-outline" />
            </div>
          </div>

          <!-- {{peerreviewCompleted}} -->
          <Skeleton
            v-if="!milestonePEERREVIEW || !milestoneSALIENCE || !peerreviewCompleted"
            h2="Neue smartvote-Frage vorschlagen"
          />

          <div v-if="milestonePEERREVIEW && milestoneSALIENCE && peerreviewCompleted">
            <h2>
              <q-badge
                v-if="milestonePROPOSE && milestoneSALIENCE && peerreviewCompleted"
                color="green"
                style="position:relative; top:-1em;"
              >
                <q-icon
                  name="mdi-check"
                  size="1.2em"
                />
              </q-badge>
              Neue smartvote-Frage vorschlagen
            </h2>
            <p>Finden Sie, dass bisher ein wichtiger Aspekt des Themas '{{node.content.title}}' noch nicht abgedeckt ist? Dann reichen Sie hier einen Antrag für eine neue Frage ein!</p>
            <ArtificialModeration
              :AM="AMs.propose_question"
              amGroup="propose_question"
              alignment="right"
              v-if="!milestonePROPOSE"
              :role="2"
              :ctx="this"
            />

            <ProposeVAAQuestion
              :topic="node"
              ref="proposeForm"
              :showProposeForm="showProposeForm"
              @toggle="toggleProposeForm"
            />

            <br> <!-- Disclaimer -->
            <!-- Disclaimer -->
            <AlgorithmDisclaimer
              :expanded="true"
              :text="`Alle eingeladenen Könizerinnen und Könizer können hier neue Vorschläge für den smartvote-Fragebogen einbringen. Bevor die vorgeschlagene Frage dann in den Fragenkatalog der Demokratiefabrik einfliesst und im Rennen bleibt für einen Platz im finalen smartvote-Fragebogen, muss er von zufällig ausgewählten anderen Teilnehmenden in einem Begutachtungsverfahren angenommen werden.`"
            />

            <!-- <span>
              <b>So funktionierts:</b> Alle eingeladenen Könizerinnen und Könizer können hier neue Vorschläge für den smartvote-Fragebogen einbringen. Bevor die vorgeschlagene Frage dann in den smartvote Katalog einfliesst, wird er von zufällig ausgewählten anderen Teilnehmenden begutachtet.
            </span> -->

          </div>

          <br><br>

          <div class="row justify-between">
            <div class="seperator">
              <q-icon name="mdi-star-four-points-outline" />
            </div>
          </div>

          <!-- 4. Etappe -->
          <a name="CHARTS" />

          <Skeleton
            v-if="!milestonePROPOSE || !milestoneSALIENCE || !peerreviewCompleted"
            h2="Ihre Bewertung im Vergleich "
          />

          <div v-if="milestonePROPOSE && milestoneSALIENCE && peerreviewCompleted">

            <h2>
              <q-badge
                v-if="milestoneCHARTS && milestoneSALIENCE && peerreviewCompleted"
                color="green"
                style="position:relative; top:-1em;"
              >
                <q-icon
                  name="mdi-check"
                  size="1.2em"
                />
              </q-badge> Ihre Bewertung im Vergleich
            </h2>
            <p v-if="chartBarLabels.length">
              Sie sehen hier nun Ihre Bewertungen der Fragen zum Thema "" im Vergleich zu derjenigen aller Teilnehmenden.
            </p>
            <p
              v-else
              class="text-notification"
            >
              Es sind heute noch zu wenige Daten vorhanden. Die Rangfolge steht für dieses Thema noch nicht zur Verfügung.
            </p>

            <br>
            <br>

            <ContentTreeChart
              v-if="chartBarLabels.length"
              :chartType="chartType"
              :nodes="nodeChildren"
            />

            <br>
            <ArtificialModeration
              :AM="AMs.questions_after_charts"
              v-if="chartBarLabels.length"
              alignment="right"
              amGroup="afterCharts"
              :role="2"
              :ctx="this"
            />

          </div>

          <br>
          <br>
          <!-- 4. Etappe -->
          <a name="FINAL" />
          <br>
          <br>
          <br>

          <div v-if="milestoneCHARTS || !chartBarLabels.length">
            <ArtificialModeration
              alignment="left"
              :AM="AMs.questions_end_of_page"
              :ctx="this"
            />

          </div>
        </div>
      </transition>

      <SideMenu
        :items="sideMenuItems"
        :highlightedItem="highlightedItem"
      />
    </div>

  </q-page>
</template>


<script>
import { debounce } from "quasar";
import Skeleton from "src/components/Skeleton";

import AMs from "./ArtificialModeration.js";
import ArtificialModeration from "src/components/artificial_moderation/ArtificialModeration.vue";
import { mapGetters, mapActions } from "vuex";
import constants from "src/utils/constants.js";
import { LayoutEventBus } from "src/utils/eventbus.js";
import ChartBar from "src/components/charts/ChartBar";

import ContentMixin from "src/mixins/standalone.content";
import ContentTreeMixin from "src/mixins/stage.contenttree";
import VAATopicSelector from "./components/TopicSelector";
import ProposeVAAQuestion from "./components/ProposeVAAQuestion";

import SalienceList from "src/plugins/VAA/components/SalienceList.vue";
import PeerReviewListItem from "src/plugins/VAA/components/PeerReviewListItem.vue";
import { runtimeStore } from "src/store/runtime.store";
import SideMenu from "src/components/SideMenu";
import ComponentContentTree from "src/pages/ContentTree/components/ContentTree";
import AlgorithmDisclaimer from "src/components/AlgorithmDisclaimer";
import ContentTreeChart from "src/pages/ContentTree/components/ContentTreeChart";

export default {
  name: "VAAQuestions",
  mixins: [ContentMixin, ContentTreeMixin],
  data: () => {
    return {
      contentID: null,
      chartType: "chartBar",
      ICON_VAA_QUESTION: constants.ICONS.VAA_QUESTION,
      showProposeForm: false,
      cacheAMForum: null,
      cacheAMForumText: null,
      limitNumberOfQuestions: true,
      questionLimit: null,
      defaultQuestionLimitWithUnsaliencedEntries: 7,
      defaultQuestionLimitWithCompletedSalience: 15,
      maximalNumberToSalience: 3,
      amForumRole: 1,
      detailView: true,
      filterTypes: constants.VAA_QUESTION_TYPES,
      AMs,
      temporarySelectedTopic: null,
    };
  },
  components: {
    Skeleton,
    SalienceList,
    PeerReviewListItem,
    ArtificialModeration,
    AlgorithmDisclaimer,
    VAATopicSelector,
    ProposeVAAQuestion,
    // ContentSalienceSlider,
    ComponentContentTree,
    SideMenu,
    ChartBar,
    ContentTreeChart,
  },

  computed: {
    amForumPosition() {
      return this.amForumRole % 2 ? "left" : "right";
    },

    sideMenuItems() {
      return [
        {
          // label: "Themenwahl",
          label: this.node ? this.node.content.title : "Themenwahl",
          caption: this.node ? "Themenwahl" : "",
          anchor: "TOPICSELECTION",
          customHightlighting: () => !this.node,
        },
        {
          label: "Aktueller Stand",
          anchor: "SALIENCE",
          visible: () => !!this.node && this.detailView,
        },
        {
          label: "Gutachten",
          anchor: "PEERREVIEW",
          visible: () => !!this.node && this.detailView,
        },
        {
          label: "Neuer Vorschlag",
          anchor: "PROPOSE",
          visible: () => !!this.node && this.detailView,
        },
        {
          label: "Zusammenfassung",
          anchor: "CHARTS",
          visible: () => !!this.node && this.detailView,
        },
      ];
    },

    // all VAA_Question stages
    VAAQuestionStages: function () {
      if (!this.routed_stage) {
        return;
      }
      return this.assembly_sorted_stages.filter(
        (stage) => stage.stage.group == this.routed_stage.stage.group
      );
    },

    // all VAA_Question stages
    VAAQuestionStagesAlerted: function () {
      return this.VAAQuestionStages.filter((stage) =>
        this.is_stage_alerted(stage)
      );
    },

    // the ramdom focus stage
    VAAQuestionStageRandomFocus: function () {
      return this.VAAQuestionStages.find(
        (stage) => !!stage.stage.custom_data?.RANDOM_FOCUS
      );
    },

    // the manual focus stage
    VAAQuestionStageManualFocus: function () {
      return this.VAAQuestionStages.find(
        (stage) => !stage.stage.custom_data?.RANDOM_FOCUS
      );
    },

    // Focused Topic of the manual focus stage
    VAAQuestionStageManualFocusTopic: function () {
      if (!this.VAAQuestionStageManualFocus) {
        return;
      }
      return this.getFocusedContent(this.VAAQuestionStageManualFocus);
    },

    // Focused Topic of the random focus stage
    VAAQuestionStageRandomFocusTopic: function () {
      if (!this.VAAQuestionStageRandomFocus) {
        return;
      }
      return this.getFocusedContent(this.VAAQuestionStageRandomFocus);
    },

    // Is the currently routed stage the random stage?.
    isRandomFocusStage() {
      // return this.VAAQuestionStageRandomFocus == this.next_scheduled_stage;
      return !!this.routed_stage.stage.custom_data?.RANDOM_FOCUS;
    },

    isManualFocusStage() {
      return (
        // this.VAAQuestionStageManualFocus == this.next_scheduled_stage &&
        !this.routed_stage.stage.custom_data?.RANDOM_FOCUS
      );
    },

    // Is the currently routed stage the random stage?.
    stagesIgnoredFromRandomSelection() {
      return this.routed_stage.stage.custom_data?.EXCLUDE_FROM_RANDOM;
    },

    // Which is the default content focused within the current stage.
    focusedContent() {
      if (!this.routed_stage) {
        return;
      }
      console.log("Retrieve FOCUSED CONTENT");
      return this.getFocusedContent(this.routed_stage);
    },

    // Has been set the focused content for this stage/day already?
    isFocusedContentAlreadySet() {
      if (!this.ready) {
        return;
      }
      return !!this.focusedContent;
    },

    milestoneSALIENCE() {
      return this.stageMilestoneLabels.includes("SALIENCE");
    },

    milestonePROPOSE() {
      return (
        this.milestonePEERREVIEW &&
        this.stageMilestoneLabels.includes("PROPOSE")
      );
    },

    milestonePEERREVIEW() {
      return (
        this.milestoneSALIENCE &&
        this.stageMilestoneLabels.includes("PEERREVIEW")
      );
    },

    milestoneCHARTS() {
      return (
        this.milestonePROPOSE && this.stageMilestoneLabels.includes("CHARTS")
      );
    },

    nodeChildrenExceptUserPeerreviews() {
      if (!this.nodeChildren || !this.$loaded(this.contents_to_peerreview)) {
        return;
      }

      // show only thoese questions that have not a pending insert-peerreview, in which the user is involved
      let questions = this.nodeChildren.filter((x) => {
        const rejected = x.content.rejected;
        const pending = x.content.pending_peerreview_for_insert;
        const assigned_to_the_user = Object.keys(
          this.contents_to_peerreview
        ).includes(`${x.content.id}`);
        return !rejected && (!pending || !assigned_to_the_user);
      });
      return questions;
    },

    areNodeChildrenLimited() {
      if (!this.$loaded(this.nodeChildrenExceptUserPeerreviewsLimited)) {
        return null;
      }

      return (
        this.nodeChildrenExceptUserPeerreviewsLimited.length <
        this.nodeChildrenExceptUserPeerreviews.length
      );
    },

    tooManyQuestions() {
      if (!this.$loaded(this.questionLimit)) {
        return false;
      }

      return (
        this.nodeChildrenExceptUserPeerreviews?.length > this.questionLimit
      );
    },

    nodeChildrenExceptUserPeerreviewsLimited() {
      if (!this.$loaded(this.questionLimit)) {
        return this.nodeChildrenExceptUserPeerreviews;
      }

      if (this.limitNumberOfQuestions && this.tooManyQuestions) {
        return this.nodeChildrenWhenLimited;
      }

      return this.nodeChildrenExceptUserPeerreviews;
    },

    nodeChildrenWhenLimited() {
      return this.nodeChildrenExceptUserPeerreviews.slice(
        0,
        this.questionLimit
      );
    },

    nofSalienceUncompleted() {
      // Overwrite default "salienceCompleted" method..
      if (!this.routed_stage) {
        return null;
      }
      if (!this.$loaded(this.nodeChildrenExceptUserPeerreviews)) {
        return null;
      }
      const unsalienced_children =
        this.nodeChildrenExceptUserPeerreviews.filter(
          (x) => !this.isSalienced(x)
        );
      return unsalienced_children.length;
    },

    salienceCompleted() {
      return this.nofSalienceUncompleted === 0;
    },

    peerreviewCompleted() {
      if (!this.routed_stage) {
        return null;
      }
      if (!this.$loaded(this.contents_to_peerreview)) {
        return null;
      }

      return this.areAllPeerReviewCompleted();
    },

    sortedChartEntries() {
      // TODO: please reload all data "MILESTONE" Data, when login with a new user...
      return this.nodeChildren.sort(
        (a, b) => b.progression?.salience - a.progression?.salience
      );
    },
    chartBarPersonalData() {
      return this.sortedChartEntries.map(
        (entry) => entry.progression?.salience
      );
    },
    chartBarLabels() {
      return this.sortedChartEntries.map((entry) => entry.content?.title);
    },

    contributedAtleastOneVAAQuestion() {
      if (!this.$loaded(this.nodeChildren)) {
        return null;
      }

      return !!this.nodeChildren.find(
        (x) => x.creator.id === this.public_profile.id
      );
    },

    numberOfQuestionsInCurrentTopic() {
      return this.nodeChildren.length;
    },

    contents_to_peerreview() {
      if (
        !this.loadedPeerreviewContententtrees.includes(`${this.contenttreeID}`)
      ) {
        return null;
      }

      const peerreviews = this.get_user_peerreviews_by_parent_and_content;
      if (!this.$loaded(peerreviews) || !this.$loaded(this.node)) {
        return;
      }

      if (this.node && peerreviews[this.node.content.id]) {
        return peerreviews[this.node.content.id];
      } else {
        return {};
      }
    },

    askToProposeNewQuestion() {
      if (!this.routed_stage) {
        return null;
      }

      if (!this.$loaded(this.contents_to_peerreview)) {
        return null;
      }

      if (!this.milestoneSALIENCE) {
        return null;
      }

      // dont ask, when one submitted one proposals...
      if (
        this.numberOfQuestionsInCurrentTopic > 5 ||
        this.contributedAtleastOneVAAQuestion
      ) {
        return false;
      }

      return true;
    },

    ...mapGetters({
      public_profile: "publicprofilestore/get_public_profile",
      loadedPeerreviewContententtrees:
        "peerreviewstore/loadedPeerreviewContententtrees",
      get_uncompleted_user_peerreviews:
        "peerreviewstore/get_uncompleted_user_peerreviews",
      get_user_peerreviews_by_parent_and_content:
        "peerreviewstore/get_user_peerreviews_by_parent_and_content",
      assembly_sorted_stages: "assemblystore/assembly_sorted_stages",
      next_scheduled_stage: "assemblystore/next_scheduled_stage",
    }),

    lastMonitorUpdate() {
      return this.$store.state.monitor_date;
    },
  },

  methods: {
    // Which is the default content focused within this stage.
    getFocusedContent(stage) {
      if (!stage.progression?.focused_content_id) {
        console.log("NO FOCUESED CONTENT SET");
        return;
      }
      if (!this.contenttree?.entries) {
        console.log("CONTENTTREE NOT YET LOADED");
        return null;
      }
      const focusedContentID = stage.progression.focused_content_id;
      console.assert(focusedContentID);
      const content =
        this.contenttree.entries[stage.progression.focused_content_id];
      console.assert(content);

      return content;
    },

    toggleProposeForm(value) {
      this.showProposeForm = value;

      if (!value) {
        this.milestone("PROPOSE", 3);
      }
    },

    areAllPeerReviewCompleted() {
      if (!this.routed_stage) {
        return null;
      }
      if (!this.$loaded(this.contents_to_peerreview)) {
        return null;
      }

      // ALL PROPOSAL RESPONDED?
      const first_content_with_unresponded_peerreview = Object.values(
        this.contents_to_peerreview
      ).find(
        (byContent) =>
          byContent[0].progression &&
          !this.$loaded(byContent[0].progression?.response) &&
          !byContent[0].peerreview?.rejected &&
          !byContent[0].peerreview?.approved
        // For VAA it is not possible to have multiple parallel ongoing peerreview for each topic.
        // Hence, check only the first in the list.
      );

      if (!first_content_with_unresponded_peerreview) {
        this.milestone("PEERREVIEW", 3);
      }

      // console.log("ALL RESPONDED?", first_content_with_unresponded_peerreview);
      return !first_content_with_unresponded_peerreview;
    },

    applyFocusedContent(topic) {
      // NOTIFY BACKEND
      const data = {
        stageID: this.routed_stage.stage.id,
        contentID: topic.content.id,
      };

      console.log("FOCUSEDCONTENT HAS BEEN WRITTEN (not yet)");

      // UPDATE Vuex
      this.updateFocusedContent({
        stageID: this.routed_stage.stage.id,
        contentID: topic.content.id,
      });

      this.$root.monitorLog(constants.MONITOR_STAGE_FOCUSED_CONTENT, data);
    },

    initRoutedContent() {
      console.log("INIT ROUTED CONTENT");
      if (!this.nodeChildrenExceptUserPeerreviews?.length) {
        return;
      }

      // Question limit to show as default.
      // how many questions to show (when limited view is enabled...)?
      // however, make sure that at least <maximalNumberToSalience> unsalienced questions are shown...
      let tempQuestionLimitToShow = 0;
      let nofUnsalienced = 0;

      if (!this.is_stage_alerted(this.routed_stage) || this.salienceCompleted) {
        this.milestone("SALIENCE", 4);
      }

      // What if there are unsalienced entries...
      if (!this.salienceCompleted) {
        const howManyToSalience =
          this.maximalNumberToSalience - this.numberOfCurrentlySaliencedEntries;

        this.nodeChildrenExceptUserPeerreviews.forEach((q, index) => {
          if (!this.isSalienced(q)) {
            nofUnsalienced++;
          }
          // Update Limit as long as maximum is not reached
          if (nofUnsalienced <= howManyToSalience && !this.isSalienced(q)) {
            tempQuestionLimitToShow = index + 1;
          }
        });

        this.questionLimit = Math.max(
          this.defaultQuestionLimitWithUnsaliencedEntries,
          tempQuestionLimitToShow
        );
      } else {
        this.questionLimit = this.defaultQuestionLimitWithCompletedSalience;
      }
    },

    // TOPIC SELECTOR!!!!
    selectTopicPrepare(contentID) {
      this.detailView = false;
      this.contentID = contentID;
      this.temporarySelectedTopic = null;

      if (!this.isRandomFocusStage && !this.isFocusedContentAlreadySet) {
        const topic = this.contenttree.entries[contentID];
        console.assert(topic);
        this.temporarySelectedTopic = topic;
        return;
      }

      this.debouncedSelectTopic(contentID);
    },

    selectTopic(contentID) {
      // console.log("SELECTED....................................", contentID);

      if (!this.isRandomFocusStage && !this.isFocusedContentAlreadySet) {
        console.assert(contentID);
        const topic = this.contenttree.entries[contentID];
        this.applyFocusedContent(topic);
        // this.initRoutedContent();
      }
      // console.log("SELECTED....................................2");

      // console.log("TOPIC SELECTED");
      this.detailView = false;
      // this.contentID = contentID;
      const route = {
        name: contentID ? "VAA_QUESTIONS_ENTRY" : "VAA_QUESTIONS",
        hash: "#TOPICSELECTION",
        params: {
          // savePosition: true,
          contentID: contentID,
          stageID: runtimeStore.stageID,
          assemblyIdentifier: runtimeStore.assemblyIdentifier,
        },
      };
      this.$router.pushI(route);
      // console.log("SELECTED....................................4");

      this.$root.scrollToAnchor(`TOPICSELECTION`, 3);
      // console.log("SELECTED....................................4");
      setTimeout(() => {
        this.detailView = true;
        this.$root.scrollToAnchor(`TOPICSELECTION`, 3);
      }, 200);

      // this.initRoutedContent();
    },

    redirectToFocusedTopicIfRequired() {
      const contentID = this.$router.currentRoute.params.contentID;
      if (!this.$loaded(this.rootElements)) {
        // not yet ready..
        return;
      }

      // no contentID selected (but focues content is alrady set...).
      if (this.isFocusedContentAlreadySet === false) {
        if (this.isRandomFocusStage) {
          // focusedContent is not yet set...
          console.log(
            "SAMPLE RANDOM FOCUSED CONTENT, IF NECESSARY",
            this.routed_stage
          );
          console.assert(this.routed_stage);
          // this.randomSelectFocusedContent();
          // this.selectTopic(this.focusedContent.content.id);
          this.$root.monitorFire(
            constants.MONITOR_STAGE_RANDOM_SAMPLING_CONTENT
          );
          console.log("RANDOM SAMPLING TOPICS...");
          return;
        }
      }

      // mismatch focusContent != contentID selected
      if (this.focusedContent && contentID != this.focusedContent.content.id) {
        // This stage is not yet ready...
        if (this.is_stage_alerted(this.routed_stage)) {
          this.selectTopic(this.focusedContent.content.id);
          return;
        }

        // Check if Random-stage is still alerted? (if yes, redirect to this one..)
        if (this.is_stage_alerted(this.VAAQuestionStageRandomFocus)) {
          if (this.routed_stage === this.VAAQuestionStageRandomFocus) {
            // stage is correct: but not the topic
            this.selectTopic(this.focusedContent.content.id);
          } else {
            // goto the correct stage...
            this.gotoStage(this.VAAQuestionStageRandomFocus);
          }
          return;
        }

        // Check if Manual-stage is still alerted? (if yes, redirect to this one..)
        // console.log("is ALerted Manaul");
        if (this.is_stage_alerted(this.VAAQuestionStageManualFocus)) {
          if (this.routed_stage === this.VAAQuestionStageManualFocus) {
            // goto the correct stage...
            if (this.focusedContent.content.id) {
              // stage is correct: but not the topic
              // console.log("select Manaul ");
              this.selectTopic(this.focusedContent.content.id);
            }
          } else {
            // console.log("goto Manaul ");
            this.gotoStage(this.VAAQuestionStageManualFocus);
          }
          return;
        }
      }
      this.contentID = this.$router.currentRoute.params.contentID;
      this.initRoutedContent();
      LayoutEventBus.$emit("hideLoading");
    },

    // // WHEN ANY SUBCONTENT HAS BEEN READ
    itemRead(child) {
      // marc the topic as discussed as soon as a child has been read.
      this.markDiscussed(this.node);
    },

    toggleSalienceListLimit(val) {
      if (!val) {
        this.$root.monitorLog(constants.MONITOR_SALIENCELIST_SHOW_ALL);
      }

      this.limitNumberOfQuestions = val;
    },

    ...mapActions("assemblystore", ["updateFocusedContent"]),
  },

  watch: {
    ready(to, from) {
      this.redirectToFocusedTopicIfRequired();
    },

    focusedContent(to, from) {
      // this.limitNumberOfQuestions = true;
      if (this.ready) {
        this.redirectToFocusedTopicIfRequired();

        if (to) {
          // As soon as focues content ist set. Ensure that peerreviews are up to date...
          this.$store.dispatch("peerreviewstore/syncPeerreviews", {
            assemblyIdentifier: runtimeStore.assemblyIdentifier,
            contenttreeID: this.routed_stage.stage.contenttree_id,
            oauthUserID: this.oauth.userid,
          });
        }
      }
    },

    $route(to, from) {
      this.limitNumberOfQuestions = true;
      if (this.ready) {
        this.redirectToFocusedTopicIfRequired();
      }
    },

    numberOfCurrentlySaliencedEntries(val) {
      if (
        this.focusedContent &&
        val &&
        val >= Math.min(this.maximalNumberToSalience, this.questionLimit)
      ) {
        if (!this.milestoneSALIENCE) {
          this.milestone("SALIENCE", 4);
        }
      }
    },

    salienceCompleted(val) {
      if (this.focusedContent && val) {
        console.log("ADD MILESTONE SALIENCE....");
        if (!this.milestoneSALIENCE) {
          this.milestone("SALIENCE", 4);
        }
      }
    },

    askToProposeNewQuestion(val) {
      if (this.focusedContent && val === false) {
        // console.log("ADD MILESTONE PROPOSE....");
        if (!this.milestonePROPOSE) {
          this.milestone("PROPOSE", 3);
        }
      }
    },

    contents_to_peerreview(val) {
      if (
        this.focusedContent &&
        this.$loaded(val) &&
        Object.values(val).length === 0
      ) {
        console.log("ADD MILESTONE PEERREVIEW (wathc)....");
        if (!this.milestonePEERREVIEW) {
          this.milestone("PEERREVIEW", 3);
        }
      }
    },

    peerreviewCompleted(val) {
      if (this.$loaded(this.contents_to_peerreview) && val) {
        console.assert(val === true);
        console.log("ADD MILESTONE PEERREVIEW (created)....");
        if (!this.milestonePEERREVIEW) {
          // this.milestone("PEERREVIEW", 3);
        }
      }
    },

    nodeChildren(val) {
      if (
        this.focusedContent &&
        this.$loaded(val) &&
        Object.keys(val).length === 0
      ) {
        if (!this.milestoneCHARTS) {
          this.milestone("CHARTS", 3);
        }
      }
    },

    lastMonitorUpdate(val) {
      console.log("UPDATE MONITOR: so update also peerreviews");
      this.$store.dispatch("peerreviewstore/syncPeerreviews", {
        assemblyIdentifier: runtimeStore.assemblyIdentifier,
        contenttreeID: this.contenttreeID,
        oauthUserID: this.oauth.userid,
      });
    },
  },

  created() {
    if (this.ready) {
      this.redirectToFocusedTopicIfRequired();
    }

    // DEBOUNCE TOPIC SELECTION.: for content selector
    this.debouncedSelectTopic = debounce(this.selectTopic, 1000);

    if (this.focusedContent) {
      if (this.salienceCompleted) {
        console.log("ADD MILESTONE SALIENCE....");
        if (!this.milestoneSALIENCE) {
          this.milestone("SALIENCE", 4);
        }
      }

      if (this.askToProposeNewQuestion === false) {
        // console.log("ADD MILESTONE PROPOSE (in created)....");
        if (!this.milestonePROPOSE) {
          this.milestone("PROPOSE", 3);
        }
      }

      if (
        this.$loaded(this.contents_to_peerreview) &&
        (Object.values(this.contents_to_peerreview)?.length === 0 ||
          this.peerreviewCompleted)
      ) {
        console.log("ADD MILESTONE PEERREVIEW (created)....");
        if (!this.milestonePEERREVIEW) {
          this.milestone("PEERREVIEW", 3);
        }
      }

      // Only when focues stage is set...
      if (this.routed_stage?.stage.contenttree_id && this.oauth.userid) {
        this.$store.dispatch("peerreviewstore/syncPeerreviews", {
          assemblyIdentifier: runtimeStore.assemblyIdentifier,
          contenttreeID: this.routed_stage.stage.contenttree_id,
          oauthUserID: this.oauth.userid,
        });
      }
    }
  },
};
</script>
