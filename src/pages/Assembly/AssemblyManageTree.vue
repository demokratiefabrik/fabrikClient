<template>

  <q-page
    class="doc_content"
    v-if="ready"
  >

    <q-chip
      clickable
      @click="$root.gotoAssemblyManage(assembly)"
    >Zurück zur Moderations-Übersicht</q-chip>

    <!-- DISABLED WARNING -->
    <q-banner
      dense
      inline-actions
      class="text-white bg-red"
      v-if="contenttree.disabled"
      style="padding:2em; margin-bottom:1em;"
    >
      This Contenttree is disabled and, therefore, not accessible for users.
    </q-banner>

    <h2>Inhalte der Stage "{{routed_stage.stage.title}}"</h2>

    <DefaultDiscussionBlock
      :alwaysExpanded="true"
      :accordion="true"
      :amEnabled="false"
    />
    <!-- discussionBlockLabel="" -->

  </q-page>
</template>


<script>
import ContentTreeMixin from "src/mixins/stage.contenttree";
import DefaultDiscussionBlock from "src/pages/ContentTree/components/DefaultDiscussionBlock";

export default {
  name: "VAATopics",
  mixins: [ContentTreeMixin],
  components: {
    DefaultDiscussionBlock,
  },
  data() {
    return {};
  },

  computed: {},

  methods: {},
};
</script>
