<template>
  <q-card flat v-if="node && isExpandedNode" class="full-width bg-none">
    <!-- :style="node.children.length || node.level===1 ? 'margin-left:1.4em' : ''" -->
    <q-card-section v-if="node.content.type === 'UPDATEPROPOSAL'">
      <div class="text-caption text-grey-9">
        {{ node.creator.U }} schlug vor die smartvote-Frage folgendermassen
        abzuändern:
        <p
          v-if="node.content.title !== '@NOCHANGE@'"
          class="q-ma-md text-notification"
        >
          "{{ node.content.title }}"
        </p>

        <div
          v-if="node.content.text && node.content.text !== '@NOCHANGE@'"
          class="text-caption text-grey-9"
        >
          <br />Dies wurde folgendermassen begründet:
          <p class="q-ma-md text-notification">"{{ node.content.text }}"</p>
        </div>
        <!-- <br><br> -->
        <!-- Dieser Vorschlag kann hier kommentiert werden. -->
      </div>
    </q-card-section>

    <q-card-section v-else>
      <div class="text-caption text-grey-9" v-text="node.content.text" />
    </q-card-section>

    <ContentToolbar :obj="node" />
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import ContentToolbar from 'src/pages/ContentTree/components/ContentToolbar.vue';
// import { mapGetters } from 'vuex';
import { INode } from 'src/composables/contenttree.composable';

export default defineComponent({
  name: 'ContentTreeQTreeBody',
  props: {
    node: { type: Object as PropType<INode> },
    isExpandedNode: { type: Boolean },
    isReadNode: { type: Boolean },
  },
  components: {
    ContentToolbar,
  },
  emits: ['popup-content-form'],
});
</script>
