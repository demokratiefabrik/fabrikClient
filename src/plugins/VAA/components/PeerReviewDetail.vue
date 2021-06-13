<style lang="sass" scoped>
// USED TO MARK FINALIZED PEERREVIEW
.finalized_peerreview
  opacity: 0.7
  position: absolute
  right: 80px
  top: 25px
  transform: rotate(-20deg)
  font-size: 1.4em
  line-height: 0.8em
  font-weight: bold
  &.approved
    color: blue
  &.rejected
    color: red
</style>

<template>

  <!-- :class="{'highlightedPeerreview': !peerreviewCompleted && !expanded}" -->
  <q-card flat>
    <span v-if="forceExpanded">
      <!-- <q-card-section avatar> -->
      <!-- </q-card-section> -->

      <q-toolbar>
        <q-avatar>
          <q-icon
            size="md"
            name="mdi-scale-balance"
          >
          </q-icon>
          <q-badge
            v-if="peerreviewCompleted"
            color="green"
            style="position:relative; top:-1em;"
          >
            <q-icon
              name="mdi-check"
              size="1.2em"
            />
          </q-badge>
        </q-avatar>

        <span
          class="
            finalized_peerreview approved"
          v-if="peerreview.peerreview.approved"
        >Angenommen<br></span>
        <span
          class="
            finalized_peerreview rejected"
          v-if="peerreview.peerreview.rejected"
        >Abgelehnt</span>

        <!-- </q-card-section>

      <q-card-section> -->

        <!-- {{peerreviews}} -->
        <span
          class="text-h4"
          v-if="isInsertProposal"
        >
          Gutachten #{{peerreview.peerreview.id}}: Vorschlag für eine neue Frage
        </span>
        <span
          v-else
          class="text-h4"
        >
          Gutachten #{{peerreview.peerreview.id}}: Verbesserungsantrag
        </span>
        <div
          caption
          v-if="peerreviewCompleted && peerreviewAssigned"
          class=""
        >
          Ihre Antwort: {{translateResponse(peerreview.progression)}}
        </div>

        <!-- <q-toolbar-title><span class="text-weight-bold">Quasar</span> Framework</q-toolbar-title> -->
        <q-space />

        <q-btn
          flat
          round
          dense
          icon="mdi-close"
          v-close-popup
        />
      </q-toolbar>
      <!-- 
      <div class="text-h6">

      </div> -->
      <!-- <q-btn
        top
        icon="mdi-close"
        flat
        round
        dense
        v-close-popup
      /> -->
      <!-- </q-card-section> -->

      <a :name="`PEERREVIEW${peerreview.peerreview.id}`" />
    </span>

    <q-tabs
      v-model="tab"
      dense
      class="bg-grey-1 shadow-3"
      active-color="primary"
      indicator-color="primary"
      align="left"
      narrow-indicator
    >
      <q-tab
        name="default"
        icon="mdi-text-search"
        label="Antrag"
      >

        <q-badge
          color="orange"
          style="left:20px; width:15px ;"
          class="absolute"
          v-if="!peerreviewCompleted && peerreviewAssigned"
        >
          <!-- EXPANDABLE-ALL: v-if="isExpanded !== false" -->
          <q-tooltip>Möchten Sie diesen Antrag gutheissen?</q-tooltip>
          !
        </q-badge>
      </q-tab>
      <q-tab
        name="discussion"
        icon="mdi-comment-text-multiple"
        :label="$q.screen.lt.md ? '' : `Diskussion ${nofDiscussionDescendants ? '('+nofDiscussionDescendants+')': ''}`"
      >
        <q-badge
          color="orange"
          style="left:20px; width:15px ;"
          class="absolute"
          v-if="discussionDescendantsUnread"
        >
          <!-- EXPANDABLE-ALL: v-if="isExpanded !== false" -->
          <q-tooltip>Die Beiträge in der Diskussion könnten für diese Entscheidung relevant sein!</q-tooltip>
          !
        </q-badge>
      </q-tab>

      <q-tab
        name="peerreviews"
        icon="mdi-scale-balance"
        label="Verlauf"
      />

    </q-tabs>

    <q-separator />

    <q-tab-panels
      v-model="tab"
      animated
    >
      <q-tab-panel name="default">

        <q-card-section
          class="text-h4 q-pa-md"
          v-if="isInsertProposal"
        >
          <div v-if="ownPeerreview">Sie haben folgende smartvote-Frage vorgeschlagen:</div>
          <div v-if="!ownPeerreview">User <i>{{peerreview.creator.U}}</i> hat folgende smartvote-Frage vorgeschlagen:</div>
        </q-card-section>

        <q-card-section
          class="q-mb-md q-ml-md "
          style="border-left: 1px solid grey"
          v-if="isInsertProposal"
        >
          <div class="text-h6 text-notification q-ma-md">{{peerreview.content.title}}</div>
        </q-card-section>
        <div class="q-pa-md">
          <!-- <div><b>Frage:</b><br>{{peerreview.content.title}}<br><br></div> -->
          <div>Die Begründung dazu kann im Register "Diskussion" gelesen und kommentiert werden.</div>
        </div>

        <q-card-section
          class="q-mb-md q-ml-md"
          v-if="!isInsertProposal"
        >

          <!-- <div class="text-h4">Betrifft die smartvote-Frage #{{peerreview.content.id}}</div> -->

          <p v-if="!titleChanges">Betrifft die Frage: {{peerreview.content.title}}</p>
          <q-splitter
            v-model="splitterModel"
            :horizontal="$q.screen.lt.md"
          >

            <template v-slot:before>
              <div class="q-pa-md">
                <div class="text-h6 q-mb-md ">BISHER</div>
                <div class="text-h6 q-mb-md">{{peerreview.content.title}}<br><br></div>
                <!-- <div v-if="textChanges"><b>Warum ist die Frage wichtig:</b><br> {{peerreview.content.text}}</div> -->
              </div>
            </template>

            <template v-slot:after>
              <div class="q-pa-md">
                <div class="text-h6 q-mb-md">ÄNDERUNGSVORSCHLAG</div>
                <div class="text-h6 q-mb-md">{{peerreview.peerreview.data_to_apply_on_success.title}} <br><br></div>
                <!-- <div v-if="textChanges"><b>Warum ist die Frage wichtig:</b><br> {{peerreview.peerreview.data_to_apply_on_success.text}}</div> -->
              </div>
            </template>

          </q-splitter>
        </q-card-section>

        <q-card-section v-if="peerreviewFinalized">
          <div class="text-notification">Die Entscheidung ist gefallen. Dieser Antrag wurde {{peerreview.peerreview.rejected ? 'abgelehnt' : 'angenommen'}}</div>
          Sie können die Details im Register "Verlauf" nachlesen.
          <br><br>
        </q-card-section>

        <q-card-section
          class="q-pa-md"
          v-if="!peerreviewFinalized && peerreviewAssigned && !peerreviewCompleted"
        >
          <div class="text-h4">Entscheidungskriterien</div>
          Entscheiden Sie anhand folgender Kriterien: Trifft folgendes zu
          <q-icon name="mdi-thumb-up" /> (1x klicken) oder trifft es nicht zu
          <q-icon name="mdi-thumb-down" /> (2x klicken)?<br>
        </q-card-section>

        <q-card-section
          v-if="isInsertProposal && !peerreviewFinalized && topic && peerreviewAssigned  && !peerreviewCompleted"
          style="border-left: 1px solid grey"
          class="q-mb-md q-ml-md "
          :class="!acceptAllAccept ? 'bg-orange-4' : ''"
        >
          <!-- <p>Was denken Sie: Soll diese Frage in den smartvote-Katalog aufgenommen werden? Entscheiden Sie aufgrund folgender Kriterien.</p> -->
          <div>
            <q-toggle
              v-model="accept1"
              :disable="peerreviewFinalized"
              color="green"
              size="lg"
              checked-icon="mdi-thumb-up"
              unchecked-icon="mdi-thumb-down"
              class="q-ma-none"
              :label="$t('common_properties.insert.criteria_accept.1')"
            />
            <ListOfOlderSameLevelEntries :current="peerreview" />
            <q-toggle
              class="q-ma-none"
              v-model="accept2"
              :disable="peerreviewFinalized"
              size="lg"
              color="green"
              checked-icon="mdi-thumb-up"
              unchecked-icon="mdi-thumb-down"
              :label="$t('common_properties.insert.criteria_accept.2', {topic: topic.content.title})"
            />

            <q-toggle
              class="q-ma-none"
              checked-icon="mdi-thumb-up"
              :disable="peerreviewFinalized"
              size="lg"
              color="green"
              unchecked-icon="mdi-thumb-down"
              v-model="accept3"
              :label="$t('common_properties.insert.criteria_accept.3')"
            />

            <SmartvoteCriteria />
            <br>&nbsp;
            <span v-if="!acceptAllAccept"><br>Beantworten Sie die 3 Fragen.</span>
          </div>

          <div v-if="acceptAllAccept">
            <span
              v-if="acceptedNumber<2"
              class="text-notification"
            >Sie können diesen Antrag nicht annehmen, weil er mehr als zwei Entscheidungskriterien nicht erfüllt.<br></span>
            <span
              v-else-if="acceptedNumber==3"
              class="text-notification"
            >Dieser Antrag ist wohl anzunehmen, denn er scheint alle relevanten Entscheidungskriterien zu erfüllen.<br></span>
            <span
              v-else-if="!accept1"
              class="text-notification"
            >Sie können diesen Antrag nicht annehmen, da die vorgeschlagene smartvote-Frage so oder ähnlich bereits im Fragenkatalog vorhanden ist.<br></span>
            <span
              v-else-if="!accept2"
              class="text-notification"
            >Sie können diesen Antrag nicht annehmen, da die vorgeschlagene smartvote-Frage nicht zum Thema passt.<br></span>
            <span
              v-else
              class="text-notification"
            >Sie können diesen Antrag annehmen, auch wenn ein Entscheidungskriterien nicht erfüllt ist. Mit Verbesserungsanträgen kann dies später noch korrigiert werden.<br></span>
          </div>
        </q-card-section>

        <q-card-section
          v-if="!isInsertProposal && !peerreviewFinalized && topic && peerreviewAssigned  && !peerreviewCompleted"
          :class="!acceptAllAccept ? 'bg-orange-4' : ''"
        >
          <div>
            <!-- <div class="text-h4">Formale Kriterien</div> -->

            <!-- Entscheiden Sie anhand folgender Kriterien: Trifft folgendes auf den Vorschlag zu?<br> -->
            <q-toggle
              v-model="accept1"
              color="green"
              size="lg"
              :disable="peerreviewFinalized"
              checked-icon="mdi-thumb-up"
              unchecked-icon="mdi-thumb-down"
              class="q-ma-none"
              :label="$t('common_properties.update.criteria_accept.1')"
            />
            <q-toggle
              class="q-ma-none"
              v-model="accept2"
              :disable="peerreviewFinalized"
              size="lg"
              color="green"
              checked-icon="mdi-thumb-up"
              unchecked-icon="mdi-thumb-down"
              :label="$t('common_properties.update.criteria_accept.2')"
            />

            <q-toggle
              class="q-ma-none"
              :disable="peerreviewFinalized"
              checked-icon="mdi-thumb-up"
              size="lg"
              color="green"
              unchecked-icon="mdi-thumb-down"
              v-model="accept3"
              :label="$t('common_properties.update.criteria_accept.3')"
            />

            <SmartvoteCriteria />
          </div>
          <br>&nbsp;
          <div v-if="acceptAllAccept">
            <span
              v-if="acceptedNumber<2"
              class="text-notification"
            >Sie können diesen Antrag nicht annehmen, weil er mehr als zwei Entscheidungskriterien nicht erfüllt.<br>
            </span>
            <span
              v-else-if="acceptedNumber==3"
              class="text-notification"
            >Dieser Antrag ist wohl anzunehmen, denn er scheint alle relevanten Entscheidungskriterien zu erfüllen.<br>
            </span>
            <span
              v-else-if="!accept1"
              class="text-notification"
            >Sie können diesen Antrag nicht annehmen, da die ursprüngliche Idee dieser Frage geändert wird.<br>
            </span>
            <span
              v-else-if="!accept2"
              class="text-notification"
            >Sie können diesen Antrag nicht annehmen, da es sich bei diesem Vorschlag um keine Verbesserung zu handeln scheint.<br>
            </span>
            <span
              v-else
              class="text-notification"
            >Sie können diesen Antrag annehmen, auch wenn ein Entscheidungskriterien nicht erfüllt ist. Mit Verbesserungsanträgen kann dies später noch korrigiert werden.<br>
            </span>
          </div>
        </q-card-section>

        <q-card-section
          v-if="acceptAllAccept && !peerreviewFinalized && peerreviewAssigned"
          class="q-ml-md"
        >
          <!-- discussionBlockIntro="Sie können hier die bisherige Diskussion zum Vorschlag nachverfolgen und Ihre Überlegungen mit anderen teilen." -->
          <!-- :initialFocusNode="discussionContent" -->
          <div class="text-h4">Ihre Antwort</div>
          <p v-if="!peerreviewCompleted">Sprechen Sie sich dafür aus, dass dieser Vorschlag angenommen wird?</p>
          <p v-if="peerreviewCompleted && !peerreview.progression.response">Sie haben sich dafür ausgesprochen, dass dieser Vorschlag abgelehnt wird.</p>
          <p v-if="peerreviewCompleted && peerreview.progression.response">Sie haben sich dafür ausgesprochen, dass dieser Vorschlag angenommen wird.</p>

          <!-- <p>Wir fragen Sie nun nach Ihrer ganz persönlichen Meinung: </p> -->
          <PeerReviewResponse
            :peerreview="peerreview"
            instruction=""
            v-if="!peerreviewCompleted"
            ref="previewResponse"
            :accept1="accept1"
            :accept2="accept2"
            :accept3="accept3"
          />

        </q-card-section>

        <q-card-section
          class="q-ml-md"
          v-if="acceptAllAccept && isInsertProposal && !peerreviewRejected && peerreview.progression"
        >
          <!-- && $loaded(peerreview.progression.response) -->
          <div class="text-h4">Bewertung</div>
          <p>
            Wie wichtig ist Ihnen diese Frage für den smartvote-Fragebogen? Bitte verschieben Sie den Regler.
          </p>
          <!-- Wie wichtig wäre diese vorgeschlagene Frage für Sie persönlich, um sich eine Meinung über eine Kandidatin/einen Kandidaten machen? Bitte verschieben Sie den Regler.</p> -->
          <!-- <p>Wir fragen Sie nun nach Ihrer ganz persönlichen Meinung: </p> -->
          <ContentSalienceSlider
            :content="content"
            instruction=""
          />
        </q-card-section>

      </q-tab-panel>

      <q-tab-panel
        name="discussion"
        v-if="tab == 'discussion'"
      >
        <br>
        <div class="text-h6">Diskussion über diesen Antrag</div>
        <p>Sie können hier die bisherige Diskussion zum Vorschlag nachverfolgen und Ihre Überlegungen mit anderen teilen:</p>
        <DefaultDiscussionBlock
          v-if="peerreview"
          :initialFocusNode="isInsertProposal ? null : firstDiscussionContent"
          :amEnabled="false"
          :node="peerreview"
          :discussionBlockLabel="isInsertProposal ? 'Diskussion zur vorgeschlagenenen Frage' : 'Diskussion zum Verbesserungsvorschlag'"
          :alwaysExpanded="true"
          :ctx="this"
        />
        <!-- :customAM="AMs.indexTopPeerReview" -->
        <p
          class="text-notification"
          v-if="!firstDiscussionContent"
        >Das Forum kann aktuell nicht geöffnet werden. Da ist ein Fehler aufgetreten.</p>

      </q-tab-panel>

      <q-tab-panel
        name="peerreviews"
        v-if="tab == 'peerreviews'"
      >
        <PeerReviewHistory
          :contentID="peerreview.content.id"
          :topic="topic"
        ></PeerReviewHistory>
      </q-tab-panel>
    </q-tab-panels>

    <q-card-actions align="right">

      <q-btn
        icon="mdi-chevron-up"
        flat
        right
        @click="closeExpandedItem"
      >Gutachten schliessen
        <q-tooltip>So bekommen Sie wieder den Überblick über die ganze Liste.</q-tooltip>
      </q-btn>

    </q-card-actions>
  </q-card>

</template>

<script>
import ContentSalienceSlider from "src/pages/ContentTree/components/ContentSalienceSlider";
import PeerReviewResponse from "src/pages/ContentTree/components/PeerReviewResponse";
import DefaultDiscussionBlock from "src/pages/ContentTree/components/DefaultDiscussionBlock";
import AMs from "../../../pages/ContentTree/ArtificialModeration.js";
import SmartvoteCriteria from "./SmartvoteCriteria";
import PeerReviewHistory from "./PeerReviewHistory";
import ListOfOlderSameLevelEntries from "./ListOfOlderSameLevelEntries";

import { mapGetters } from "vuex";
import constants from "src/utils/constants";
import { runtimeStore } from "src/store/runtime.store.js";

export default {
  name: "PeerReviewListItem",
  inject: ["CONTENTTREE", "markDiscussed", "markRead", "getDescendantsOf"],
  data() {
    return {
      tab: "default",
      AMs,
      accept1: null,
      accept2: null,
      accept3: null,
      splitterModel: 50,
    };
  },
  props: ["peerreview", "content", "contenttreeID", "forceExpanded", "topic"],
  components: {
    PeerReviewHistory,
    SmartvoteCriteria,
    ContentSalienceSlider,
    DefaultDiscussionBlock,
    PeerReviewResponse,
    ListOfOlderSameLevelEntries,
  },
  computed: {
    firstDiscussionContent() {
      return this.isInsertProposal ? this.peerreview : this.discussionContent;
    },
    acceptAllAccept() {
      const allAccept = !(
        this.accept1 === null ||
        this.accept2 === null ||
        this.accept3 === null
      );
      return allAccept;
    },

    acceptedNumber() {
      let acceptedNumber = 0;
      if (this.accept1 == true) {
        acceptedNumber++;
      }
      if (this.accept2 == true) {
        acceptedNumber++;
      }
      if (this.accept3 == true) {
        acceptedNumber++;
      }
      return acceptedNumber;
    },

    isInsertProposal() {
      return this.peerreview.peerreview.operation === "INSERT";
    },
    titleChanges() {
      return this.$loaded(
        this.peerreview.peerreview?.data_to_apply_on_success.title
      );
    },
    textChanges() {
      return this.$loaded(
        this.peerreview.peerreview?.data_to_apply_on_success.text
      );
    },
    discussionContent() {
      if (
        this.isInsertProposal ||
        !this.peerreview.peerreview?.discussion_content_id
      ) {
        return this.content;
      }
      console.assert(this.peerreview.peerreview?.discussion_content_id);
      const discussionContent = this.get_content({
        contenttreeID: this.contenttreeID,
        contentID: this.peerreview.peerreview?.discussion_content_id,
      });
      return discussionContent ? discussionContent : this.content;
    },

    discussionDescendants() {
      if (this.discussionContent) {
        return this.getDescendantsOf(this.discussionContent);
      }
    },

    nofDiscussionDescendants() {
      if (!this.discussionDescendants) {
        return;
      }
      return Object.keys(this.discussionDescendants).length;
    },

    discussionDescendantsUnread() {
      return Object.values(this.discussionDescendants).find(
        (x) => !this.isRead(x)
      );
    },

    peerreviewCompleted() {
      if (!this.$loaded(this.content?.progression)) {
        return null;
      }

      if (this.peerreview.peerreview.rejected) {
        return true;
      }

      if (this.isInsertProposal) {
        if (!this.$loaded(this.content?.progression?.salience)) {
          return false;
        }
      }

      if (!this.$loaded(this.peerreview.progression?.response)) {
        return false;
      }

      this.$emit("completed-peerreview");
      return true;
    },

    peerreviewFinalized() {
      // Rejected or Approved by majority of peerreview group!
      return (
        this.peerreview.peerreview.approved ||
        this.peerreview.peerreview.rejected
      );
    },
    peerreviewRejected() {
      // Rejected or Approved by majority of peerreview group!
      return this.peerreview.peerreview.rejected;
    },
    peerreviewAssigned() {
      // Rejected or Approved by majority of peerreview group!
      return !!this.peerreview.progression;
    },

    ownPeerreview() {
      return this.peerreview.creator.id == this.public_profile.id;
    },

    peerreviewHistory() {
      const peerreviews = this.get_peerreview_by_content({
        contentID: this.peerreview?.peerreview?.content_id,
      });

      const sortedPeerreviews = [...peerreviews];
      // console.log(sortedPeerreviews);
      return sortedPeerreviews.sort(
        (a, b) => b.peerreview.id - a.peerreview.id
      );
    },

    nofPeerreviewInsertOperation() {
      const inserts = this.peerreviewHistory.filter(
        (x) => x.peerreview.operation == "INSERT"
      );
      return inserts ? inserts.length : 0;
    },

    ...mapGetters({
      get_content: "contentstore/get_content",
      get_peerreview_by_content: "peerreviewstore/get_peerreview_by_content",
      get_contenttree: "contentstore/get_contenttree",
      public_profile: "publicprofilestore/get_public_profile",
      profileColor: "publicprofilestore/profileColor",
    }),

    assemblyIdentifier() {
      return runtimeStore.assemblyIdentifier;
    },
  },
  methods: {
    translateResponse(progression) {
      if (progression?.response === true) {
        return "Antrag soll angenommen werden";
      }
      if (progression?.response === false) {
        return "Antrag ist abzulehnen";
      }

      return "---";
    },

    isRead: function (content) {
      return !!content?.progression?.read;
    },
    closeExpandedItem() {
      const expandable = this.$refs.expandable;
      this.$emit("expandable-hide");
      this.$root.scrollToAnchor(`PEERREVIEW${this.peerreview.peerreview.id}`);
    },
  },

  watch: {
    tab(value) {
      console.log(value);
      const data = {
        contentID: this.content?.content?.id,
        peerreviewID: this.peerreview.peerreview.id,
        value,
      };
      if (value == "discussion") {
        this.$root.monitorLog(constants.MONITOR_DISCUSSION_SHOW, data);
      }
      if (value == "proposal") {
        this.$root.monitorLog(constants.MONITOR_SHOW_PROPOSE_UPDATE, data);
      }
      if (value == "peerreviews") {
        this.$root.monitorLog(constants.MONITOR_SHOW_HISTORY, data);
      }
    },
  },

  mounted() {
    this.accept1 = this.peerreview?.progression?.criteria_accept1;
    this.accept2 = this.peerreview?.progression?.criteria_accept2;
    this.accept3 = this.peerreview?.progression?.criteria_accept3;
    if (this.forceExpanded) {
      this.expanded = true;
    }
    console.log(runtimeStore.assemblyIdentifier);
  },
};
</script>