<template>
  <span>

    <SalienceDetail
      v-if="content"
      :forceExpanded="true"
      :asModal="true"
      v-on:expandable-hide="$emit('close-modal')"
      :contenttreeID="contenttreeID"
      :focusedDescandent="content"
      :node="antecedent"
    />
  </span>
</template>

<script>
import SalienceDetail from "./SalienceDetail";
import AssemblyMixin from "src/mixins/assembly";
import StandaloneContenttreeMixin from "src/mixins/standalone.contenttree";
import StandaloneContentMixin from "src/mixins/standalone.content";
import { mapGetters } from "vuex";
import { runtimeMutations, runtimeStore } from "src/store/runtime.store";

export default {
  name: "PeerReviewDetailContainer",
  props: ["contentID", "notification"],
  mixins: [AssemblyMixin, StandaloneContenttreeMixin, StandaloneContentMixin],
  components: {
    SalienceDetail,
  },

  computed: {
    // contentID: function () {
    //   return this.peerreview.peerreview?.content_id;
    // },

    content() {
      console.log("CONTENT DETAIL LOADER");
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
      console.log("CONTENT LOADED", content);
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
      return this.content.path[0];
    },

    topic() {
      const content = this.get_content({
        contenttreeID: this.contenttreeID,
        contentID: this.topicID,
      });

      return content;
    },

    contenttreeID: function () {
      return this.notification?.contenttree_id;
    },

    assemblyIdentifier() {
      return runtimeStore.assemblyIdentifier;
    },

    antecedent() {
      if (!this.content) {
        console.log("NO CONTENT");
        return null;
      }

      // TODO: while loop path upwards
      const secondLevelID =
        this.content.path.length > 0 ? this.content.path[1] : null;
      const secondLevel = this.get_content({
        contenttreeID: this.contenttreeID,
        contentID: secondLevelID,
      });
      if (secondLevel?.content.type == "VAA_QUESTION") {
        return secondLevel;
      }

      const firstLevelID = this.content.path[0];
      const firstLevel = this.get_content({
        contenttreeID: this.contenttreeID,
        contentID: firstLevelID,
      });
      return firstLevel;
    },
    ...mapGetters({
      get_content: "contentstore/get_content",
    }),
  },

  mounted() {
    // TODO: This is only apt for one assembly concurently mode...
    runtimeMutations.setAssemblyIdentifier(
      this.notification.assembly_identifier
    );
  },
};
</script>