<template>
  <div>
    <q-list
      popup
      class="expansionList"
    >
      <SalienceListItem
        v-for="node in contentList"
        :node="node"
        ref="salienceItems"
        @item-saliencing="itemSaliencing"
        @item-read="itemRead"
        :hideText="hideText"
        :key="`SL1${node.content.id}`"
        :salienceCompleted="salienceCompleted"
        :salienceInstruction="salienceInstruction"
        :showBackgroundPage="showBackgroundPage"
        :itemIcon="itemIcon"
        :titlePrefix="titlePrefix"
        :discussionIntro="discussionIntro"
        :captionPrefix="captionPrefix"
      >
      </SalienceListItem>
    </q-list>

  </div>
</template>

<script>
import SalienceListItem from "./SalienceListItem";
import { defineComponent } from 'vue';

export default defineComponent({
  name: "SalienceList",
  data() {
    return {
      tab: null,
      lastSaliencedItem: null,
    };
  },
  props: [
    "contentList",
    "hideText",
    "salienceCompleted",
    "salienceInstruction",
    "showBackgroundPage",
    "discussionIntro",
    "itemIcon",
    "titlePrefix",
    "captionPrefix",
  ],
  components: {
    SalienceListItem,
  },

  methods: {
    itemSaliencing(node) {
      if (this.node !== this.lastSaliencedItem) {
        this.$emit("item-saliencing", node);
      }
    },
    itemRead(node) {
      this.$emit("item-read", node);
    },
  },
});
</script>