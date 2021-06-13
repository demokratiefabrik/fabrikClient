<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  height: 0px;
}
</style>
<template>
  <div class="full-width">
    <span
      v-on:click.stop
      v-if="standalone"
      style="float:right;"
    >
      <ContentToolbar :obj="node">
        <!-- @afterdeletion="openIndex()" -->
      </ContentToolbar>
    </span>

    <q-card
      class="q-ma-none full-width"
      flat
      v-if="node"
    >
      <q-card-section class="full-width q-px-none">
        <div class="col-12">
          <div
            v-if="node.content.title!= '@HIDDEN@'"
            :class="header_class"
          >{{heading_number}} {{node.content.title}}</div>
          <div
            class="text-body1 text-justify"
            v-if="node.content.text"
            v-dompurify-html="node.content.text"
          />
        </div>
      </q-card-section>
    </q-card>
    <!-- <DefaultDiscussionBlock
      v-if="node.content.text.length"
      :node="node"
      :customAM="discussionAM"
      :filterTypes="filterTypes"
      :discussionBlockLabel="discussionBlockLabel"
    /> -->
  </div>
</template>

<script>
import ContentToolbar from "src/pages/ContentTree/components/ContentToolbar";
// import DefaultDiscussionBlock from "src/pages/ContentTree/components/DefaultDiscussionBlock";

export default {
  name: "TextsheetCard",
  props: [
    "node",
    "standalone",
    "filterTypes",
    "heading_number",
    "discussionAM",
    "discussionBlockLabel",
  ],

  inject: ["CONTENTTREE"],
  components: { ContentToolbar },
  // DefaultDiscussionBlock
  computed: {
    header_class: function () {
      switch (this.node.content.type) {
        case "SECTION":
          return "text-h4 q-mt-lg q-mb-xs";
        case "SUBSECTION":
          return "text-subtitle1 q-mt-sm q-mb-xs";
        case "PARAGRAPH":
          return "text-subtitle2 q-mt-none q-mb-xs";
      }
    },
  },
};
</script>
