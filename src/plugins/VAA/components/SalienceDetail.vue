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

  <q-card flat>
    <span v-if="forceExpanded">
      <q-card-section avatar>
        <q-icon
          size="md"
          name="mdi-scale-balance"
        >
        </q-icon>

        <q-badge
          color="grey"
          style="position:absolute; left:-10px; top:-5px; ;"
          class="absolut"
          v-if="node.content.common_property && node.content.pending_peerreview_for_insert"
        >Begutachtung ausstehend <q-tooltip>Diese Frage wird gerade von anderen Teilnehmenden begutachtet. </q-tooltip>
        </q-badge>
        <q-badge
          color="grey"
          style="position:absolute; left:-10px; top:-5px; ;"
          class="absolut"
          v-if="node.content.common_property && node.content.pending_peerreview_for_update"
        >Verbesserung vorgeschlagen<q-tooltip>Für diese Frage wurde eine Verbesserung vorgeschlagen, die gerade begutachtet wird. </q-tooltip>
        </q-badge>

        <q-icon
          :name="itemIcon"
          :class="node.content.pending_peerreview_for_insert ? 'text-grey-5' : ''"
          :style="node.content.common_property ? '' :'text-grey-9'"
        />

        <!-- {{peerreviews}} -->
        <span class="text-h4">
          {{node.content.title}} </span>

        <q-item-label
          caption
          v-if="isSalienced"
        >
          {{titlePrefix}} | Ihre Bewertung: {{getSlideLabel}}

          <span v-if="node.content.common_property">
            |
            <span v-if="!node.content.peerreviewed && !node.content.pending_peerreview_for_insert">Parteivorschlag</span>
            <span v-if="(node.content.peerreviewed || node.content.pending_peerreview_for_insert)">Vorschlag eines Teilnehmenden</span>
          </span>
        </q-item-label>
        <q-item-label
          caption
          v-else
        >
          {{titlePrefix}} | unbewertet |

          <span v-if="node.content.common_property && !node.content.peerreviewed && !node.content.pending_peerreview_for_insert">Parteivorschlag</span>
          <span v-if="node.content.common_property && (node.content.peerreviewed || node.content.pending_peerreview_for_insert)">Vorschlag eines Teilnehmenden</span>
        </q-item-label>
      </q-card-section>
      <!-- <a :name="`PEERREVIEW${peerreview.peerreview.id}`" /> -->
    </span>

    <q-tabs
      v-model="tab"
      dense
      align="left"
      class="bg-grey-1  text-grey-7 shadow-3"
      active-color="primary"
      inline-label
    >
      <!-- align="justify" -->
      <q-tab
        name="default"
        icon="mdi-home"
        :label="$q.screen.lt.md ? '' : 'Allgemein'"
      >
        <q-tooltip v-if="isSalienced(node)">Beschreibung und Bewertung</q-tooltip>
        <q-tooltip v-if="!isSalienced(node)">Bitte geben Sie an, wie wichtig Ihnen {{ titlePrefix=='smartvote-Frage' ? 'die Frage' : 'das Thema'}} erscheint.</q-tooltip>
        <q-badge
          color="orange"
          style="left:20px; width:15px ;"
          class="absolute"
          v-if="!isSalienced(node)"
        >!</q-badge>
      </q-tab>
      <q-tab
        name="discussion"
        :label="$q.screen.lt.md ? '' : `Diskussion`"
        icon="mdi-comment-text-multiple"
      >
        <q-tooltip>Diskussionen {{ titlePrefix=='smartvote-Frage' ? 'zur smartvote-Frage' : 'zum smartvote-Thema'}} </q-tooltip>

        <q-badge
          color="grey"
          style="left:20px; right:inherit;"
          class="absolute q-ma-none"
          v-if="nofDiscussionDescendants"
        >{{nofDiscussionDescendants ? ''+nofDiscussionDescendants : ''}}</q-badge>

      </q-tab>
      <q-tab
        v-if="node.content.common_property"
        name="proposal"
        icon="mdi-lightbulb-outline"
        :label="$q.screen.lt.md ? '' : 'Verbessern'"
      >
        <q-tooltip>Möchten Sie die Frage verbessern?</q-tooltip>
      </q-tab>
      <q-tab
        v-if="node.content.common_property"
        name="peerreviews"
        icon="mdi-clock-outline"
        :label="$q.screen.lt.md ? '' : 'Verlauf'"
      >
        <q-tooltip>Alle Anträge auf einen Blick</q-tooltip>
      </q-tab>

    </q-tabs>

    <q-separator />

    <q-tab-panels
      v-model="tab"
      animated
    >
      <q-tab-panel name="default">
        <div v-if="node.content.text && !hideText">
          {{node.content.text}}
        </div>

        <ContentSalienceSlider
          :content="node"
          @item-saliencing="$emit('item-saliencing', node)"
          :instruction="salienceInstruction"
        />

      </q-tab-panel>

      <q-tab-panel
        name="discussion"
        v-if="tab == 'discussion'"
      >
        <br>
        <div class="text-h6">Diskussionen {{ titlePrefix=='smartvote-Frage' ? 'zur smartvote-Frage' : 'zum smartvote-Thema'}} </div>

        <p v-if="discussionIntro">
          {{discussionIntro}}</p>

        <br>
        <br>
        <div style="border-left:1px solid #DDD">
          <DefaultDiscussionBlock
            :node="node"
            classBackgroundColor=""
            :alwaysExpanded="true"
          />
        </div>

      </q-tab-panel>

      <q-tab-panel
        name="proposal"
        v-if="tab == 'proposal'"
      >
        <br>
        <div class="text-h6"> Neuer Verbesserungsantrag</div>
        <p> Sie möchten eine Verbesserung für die Frage "<span class="text-purple">{{node.content.title}}</span>" vorschlagen?
          Wir sind gespannt!
        </p>

        <div v-if="node.content.pending_peerreview_for_insert">
          Doch leider können Sie für diesen Beitrag noch keinen Verbesserungsvorschlag einreichen. Die smartvote-Frage wurde noch nicht abschliessend begutachtet.
          Sie können vorläufig ihr Vorschlag als Kommentar im Register "Diskussion" unterbringen. Dann gehen Ihre Überlegungen nicht vergessen.
        </div>

        <div v-if="node.content.pending_peerreview_for_update">
          Doch leider wird für diesen Beitrag gerade einen anderen Verbesserungsantrag begutachtet. Wir müssen warten bis dieses Gutachten abgeschlossen wurde.
          Möchten Sie Ihre Überlegungen stattdessen im Reiter "Diskussion" teilen?
        </div>

        <ProposeVAAQuestionEdit
          :node="node"
          v-on:switch-tab="switchTab"
        />

      </q-tab-panel>

      <q-tab-panel
        name="peerreviews"
        v-if="tab == 'peerreviews'"
      >
        <PeerReviewHistory
          :contentID="node.content.id"
          :topic="topic"
        ></PeerReviewHistory>
      </q-tab-panel>
    </q-tab-panels>

    <q-card-actions align="right">

      <q-btn
        icon="mdi-chevron-up"
        flat
        v-if="!asModal"
        right
        @click="closeExpandedItem"
      >{{titlePrefix}} Einklappen
        <q-tooltip>So bekommen Sie wieder einen Überblick über die ganze Liste.</q-tooltip>
      </q-btn>

      <q-btn
        flat
        v-if="asModal"
        right
        @click="closeExpandedItem"
      >Schliessen
      </q-btn>
    </q-card-actions>

    <!-- TODO: Load component on runtime.. -->
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
import ProposeVAAQuestionEdit from "../QUESTIONS/components/ProposeVAAQuestionEdit";

import { mapGetters } from "vuex";
import constants from "src/utils/constants";

export default {
  name: "PeerReviewListItem",
  inject: [
    "CONTENTTREE",
    "markDiscussed",
    "markRead",
    "getDescendantsOf",
    "isSalienced",
  ],
  data() {
    return {
      tab: "default",
      AMs,
      accept1: null,
      accept2: null,
      accept3: null,
      splitterModel: 50,
      reviewInstruction:
        "Sprechen Sie sich dafür aus, dass dieser Vorschlag angenommen wird?",
    };
  },
  props: [
    "peerreview",
    "salienceInstruction",
    "titlePrefix",
    "discussionIntro",
    "node",
    "asModal",
    "hideText",
    "focusedDescandent",
    "contenttreeID",
    "forceExpanded",
    "topic",
  ],
  components: {
    ProposeVAAQuestionEdit,
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
    getSlideLabel() {
      if (this.$loaded(this.node.progression?.salience)) {
        return `${this.node.progression?.salience} von 100`; // PERCENT
      } else {
        return "";
      }
    },
    itemIcon() {
      return constants.ICON_VAA_QUESTION;
    },

    discussionDescendants() {
      return this.getDescendantsOf(this.node);
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

    peerreviewHistory() {
      const peerreviews = this.get_peerreview_by_content({
        contentID: this.node.content.id,
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
      this.$emit("expandable-hide");
    },

    switchTab(tab) {
      this.tab = tab;
    },
  },

  watch: {
    tab(value) {
      console.log(value);
      const data = { contentID: this.node.content.id, value };
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
    if (this.forceExpanded) {
      this.expanded = true;
    }
    if (this.focusedDescandent) {
      this.tab = "discussion";
    }
  },
};
</script>