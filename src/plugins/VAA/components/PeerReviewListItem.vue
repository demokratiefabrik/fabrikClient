<style lang="sass" scoped>
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
  <!-- :group="salienceCompleted ? 'accordeon' : `group${node}`" -->
  <q-expansion-item
    :group="'accordeon'"
    popup
    v-model="expanded"
    :ref="`expandable`"
    :header-class="['text-primary', 'text-h4', 'q-pa-lg',  expanded ? 'bg-grey-2': (!peerreviewCompleted ? 'bg-orange' : '')]"
  >
    <template
      template
      v-slot:header
    >
      <q-item-section avatar>
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

        <span
          class="
            finalized_peerreview approved"
          v-if="firstPeerreview.peerreview.approved"
        >Angenommen<br></span>
        <span
          class="
            finalized_peerreview rejected"
          v-if="firstPeerreview.peerreview.rejected"
        >Abgelehnt</span>

      </q-item-section>

      <q-item-section>

        <!-- {{peerreviews}} -->
        <q-item-label v-if="isInsertProposal">
          Gutachten #{{firstPeerreview.peerreview.id}}: Vorschlag für eine neue Frage
        </q-item-label>
        <q-item-label v-else>
          Gutachten #{{firstPeerreview.peerreview.id}}: {{peerreviews.length > 1 ? "Verbesserungsanträge" : "Verbesserungsantrag"}}
        </q-item-label>
        <q-item-label
          caption
          v-if="peerreviewCompleted"
          class=""
        >
          Ihre Antwort: {{translateResponse(firstPeerreview.progression)}}
        </q-item-label>
      </q-item-section>
      <a :name="`PEERREVIEW${firstPeerreview.peerreview.id}`" />

    </template>

    <!-- <q-dialog
      v-model="expanded"
      full-height
      :maximized="$q.screen.lt.md ? true : false"
    >

      <q-card
        class="full-height "
        style="width:95%; max-width: 800px"
      >
        <q-card-section
          class="scroll"
          v-if="selectedNotification"
        >
          <component
            :is="PeerreviewViewLoader"
            :defaultRoute="true"
            v-on:close-modal="closeModal"
            :peerreviewID="firstPeerreview.peerreview.id"
          />

        </q-card-section>

      </q-card>
    </q-dialog> -->

    <!-- :contentID="selectedContentID" -->
    <!-- :notification="selectedNotification" -->

    <PeerReviewDetail
      v-if="expanded && firstPeerreview"
      :contenttreeID="firstPeerreview.peerreview.contenttree_id"
      :content="contentTreeContent"
      :topic="topic"
      v-on:expandable-hide="$refs.expandable.hide"
      :peerreview="firstPeerreview"
    />
  </q-expansion-item>
</template>

<script>
import AMs from "../ArtificialModeration.js";
import PeerReviewDetail from "./PeerReviewDetail";

import { mapGetters } from "vuex";
import constants from "src/utils/constants";

export default {
  name: "PeerReviewListItem",
  data() {
    return {
      tab: "default",
      expanded: false,
      AMs,
      accept1: null,
      accept2: null,
      accept3: null,
      splitterModel: 50,
      reviewInstruction:
        "Sprechen Sie sich dafür aus, dass dieser Vorschlag angenommen wird?",
      salienceInstruction:
        "Wie wichtig wäre diese vorgeschlagene Frage für Sie persönlich, um sich eine Meinung über eine Kandidatin/einen Kandidaten machen? Bitte verschieben Sie den Regler.",
    };
  },
  props: ["topic", "peerreviews"],
  inject: [
    "CONTENTTREE",
    "CONTENT",
    "markDiscussed",
    "markRead",
    "isRead",
    "getDescendantsOf",
  ],
  components: {
    PeerReviewDetail,
  },
  computed: {
    PeerreviewViewLoader() {
      if (this.expanded) {
        return () =>
          import(`src/plugins/VAA/components/PeerReviewDetailLoader.vue`);
      }
    },

    firstDiscussionContent() {
      return this.isInsertProposal
        ? this.firstPeerreview
        : this.discussionContent;
    },
    acceptAllAccept() {
      const allAccept = !(
        this.accept1 === null ||
        this.accept2 === null ||
        this.accept3 === null
      );
      return allAccept;
    },

    firstPeerreview() {
      return this.peerreviews[Object.keys(this.peerreviews)[0]];
    },
    isInsertProposal() {
      return this.firstPeerreview.peerreview.operation === "INSERT";
    },
    titleChanges() {
      return this.$loaded(
        this.firstPeerreview.peerreview?.data_to_apply_on_success.title
      );
    },
    textChanges() {
      return this.$loaded(
        this.firstPeerreview.peerreview?.data_to_apply_on_success.text
      );
    },
    discussionContent() {
      if (
        this.isInsertProposal ||
        !this.firstPeerreview.peerreview?.discussion_content_id
      ) {
        return this.contentTreeContent;
      }
      const discussionContent = this.get_content({
        contenttreeID: this.firstPeerreview.content.contenttree_id,
        contentID: this.firstPeerreview.peerreview?.discussion_content_id,
      });
      return discussionContent ? discussionContent : this.firstPeerreview;
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

    contentTreeContent() {
      const contentTreeContent = this.get_content({
        contenttreeID: this.CONTENTTREE.contenttree.id,
        contentID: this.firstPeerreview?.peerreview?.content_id,
      });
      return contentTreeContent;
    },

    // responseCompleted() {
    //   if (!this.$loaded(this.firstPeerreview.progression?.response)) {
    //     return false;
    //   }
    //   return true;
    // },

    peerreviewCompleted() {
      if (this.firstPeerreview.peerreview.rejected) {
        return true;
      }

      if (this.isInsertProposal) {
        if (!this.$loaded(this.contentTreeContent.progression?.salience)) {
          return false;
        }
      }

      if (!this.$loaded(this.firstPeerreview.progression?.response)) {
        return false;
      }

      this.$emit("completed-peerreview");
      return true;
    },

    peerreviewFinalized() {
      // Rejected or Approved by majority of peerreview group!
      return (
        this.firstPeerreview.peerreview.approved ||
        this.firstPeerreview.peerreview.rejected
      );
    },
    peerreviewRejected() {
      // Rejected or Approved by majority of peerreview group!
      return this.firstPeerreview.peerreview.rejected;
    },

    peerreviewHistory() {
      const peerreviews = this.get_peerreview_by_content({
        contentID: this.firstPeerreview?.peerreview?.content_id,
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
      profileColor: "publicprofilestore/profileColor",
    }),
  },
  methods: {
    // TODO: used?
    // isSalienced: function (peerreview) {
    //   return this.$loaded(peerreview.progression?.salience);
    // },
    translateResponse(progression) {
      if (progression?.response === true) {
        return "Antrag soll angenommen werden";
      }
      if (progression?.response === false) {
        return "Antrag ist abzulehnen";
      }

      return "---";
    },
    closeModal() {
      this.expanded = false;
    },
    // closeExpandedItem() {
    //   const expandable = this.$refs.expandable;
    //   console.assert(expandable);
    //   expandable.hide();
    //   this.$root.scrollToAnchor(
    //     `PEERREVIEW${this.firstPeerreview.peerreview.id}`
    //   );
    // },
  },
  watch: {
    expanded(val) {
      if (val) {
        this.markDiscussed(this.CONTENT.node);
        this.markRead(this.firstPeerreview);
        const data = { peerreviewID: this.firstPeerreview.peerreview.id };
        this.$root.monitorLog(constants.MONITOR_PEERREVIEW_VIEW, data);
      }
    },
    topic(val) {
      // when topic change.. close it!!!
      this.expanded = false;
    },
  },
  mounted() {
    this.accept1 = this.firstPeerreview?.progression?.criteria_accept1;
    this.accept2 = this.firstPeerreview?.progression?.criteria_accept2;
    this.accept3 = this.firstPeerreview?.progression?.criteria_accept3;
  },
};
</script>