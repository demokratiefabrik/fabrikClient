<template>
  <q-page class="doc_content" v-if="ready">
    <q-chip clickable @click="gotoAssemblyManage(assembly)"
      >Zurück zur Moderations-Übersicht</q-chip
    >

    <!-- DISABLED WARNING -->
    <q-banner
      dense
      inline-actions
      class="text-white bg-red"
      v-if="contenttree.disabled"
      style="padding: 2em; margin-bottom: 1em"
    >
      This Contenttree is disabled and, therefore, not accessible for users.
    </q-banner>

    <h2>Inhalte der Stage "{{ routed_stage.stage.title }}"</h2>

    <DefaultDiscussionBlock
      :alwaysExpanded="true"
      :accordion="true"
      :amEnabled="false"
    />
    <!-- discussionBlockLabel="" -->
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import ContentTreeMixin from 'src/mixins/stage.contenttree';
import DefaultDiscussionBlock from 'src/pages/ContentTree/components/DefaultDiscussionBlock.vue';
import useAssemblyComposable from 'src/composables/assembly.composable';
import useStageComposable from 'src/composables/stage.composable';
import useContenttreeComposable from 'src/composables/contenttree.composable';
// const {  } = useContenttreeComposable();
export default defineComponent({
  setup() {
    const { ready, gotoAssemblyManage, assembly } = useAssemblyComposable('');
    const { contenttree } = useContenttreeComposable();
    const { routed_stage } = useStageComposable();
    return { ready, routed_stage, gotoAssemblyManage, contenttree, assembly };
  },
  name: 'VAATopics',
  // mixins: [ContentTreeMixin],
  components: {
    DefaultDiscussionBlock,
  },
});
</script>
