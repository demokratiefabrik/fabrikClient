<template>
  <PeerReviewDetail
    v-if="peerreview && assemblyIdentifier"
    :forceExpanded="true"
    :contenttreeID="contenttreeID"
    :content="content"
    :topic="topic"
    v-on:expandable-hide="$emit('close-modal')"
    :peerreview="peerreview"
  />
</template>

<script>
import PeerReviewDetail from "./PeerReviewDetail";
import AssemblyMixin from "src/mixins/assembly";
import StandaloneContenttreeMixin from "src/mixins/standalone.contenttree";
import StandaloneContentMixin from "src/mixins/standalone.content";
import { mapGetters } from "vuex";
import { runtimeMutations, runtimeStore } from "src/store/runtime.store";
// import {  } from "src/store/runtime.store";

export default {
  name: "PeerReviewDetailContainer",
  props: ["peerreviewID", "notification", "defaultRoute"],
  mixins: [AssemblyMixin, StandaloneContenttreeMixin, StandaloneContentMixin],
  components: {
    PeerReviewDetail,
  },

  computed: {
    peerreview() {
      return this.get_peerreview({
        contenttreeID: this.contenttreeID,
        peerreviewID: this.peerreviewID,
      });
    },
    contentID: function () {
      return this.peerreview?.peerreview?.content_id;
    },

    assemblyIdentifier() {
      return runtimeStore.assemblyIdentifier;
    },
    content() {
      const content = this.get_content({
        contenttreeID: this.contenttreeID,
        contentID: this.contentID,
      });

      if (!content) {
        // ERROR WHILE LOADING CONTENT: REMOVE LOG.
        console.log("CONTENT NOT FOUND");
        this.$emit("close-modal");

        this.$q.notify({
          type: "nFabrikWarning",
          message: "Der Beitrag wurde gelöscht.",
        });

        this.$store.dispatch("publicprofilestore/deleteNotification", {
          notificationID: this.notification.id,
        });
      }

      return content;
    },

    contenttree: function () {
      // retrieve from localStorage
      if (this.contenttreeID) {
        return this.get_contenttree({
          contenttreeID: this.contenttreeID,
        });
      }
    },

    topicID: function () {
      if (this.content?.path?.length) {
        return this.content?.path[0];
      }
    },

    topic() {
      const content = this.get_content({
        contenttreeID: this.contenttreeID,
        contentID: this.topicID,
      });
      return content;
    },

    contenttreeID: function () {
      console.log(this.notification);
      return this.notification?.contenttree_id;
    },

    ...mapGetters({
      get_peerreview: "peerreviewstore/get_peerreview",
      get_content: "contentstore/get_content",
    }),
  },

  mounted() {
    // TODO: This is only apt for one assembly concurently mode...
    if (!this.defaultRoute) {
      runtimeMutations.setAssemblyIdentifier(
        this.notification.assembly_identifier
      );
    }
  },
};
</script>