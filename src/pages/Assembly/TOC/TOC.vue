<style scoped>
.hovercraft:hover {
  background-color: gainsboro;
}
</style>

<template>
  <q-page class="doc_content" v-if="ready">
    <!-- Agenda -->
    <h2>Programm</h2>

    <p v-if="assembly" v-dompurify-html="assembly.info" />

    <ArtificialModeration :AM="AMs.toc" alignment="right" :ctx="that" />

    <template v-if="assemblyMenu && assemblyMenuItems?.length">
      <TOCItem
        v-for="(item, index) in assemblyMenuItems"
        :key="index"
        :index="index"
        v-on:toggle-expand-state="item.manual_expanded = !item.manual_expanded"
        :item="item"
      />
    </template>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useAssemblyComposable from 'src/composables/assembly.composable';
import TOCItem from './TOCItem.vue';
import AMs from 'src/pages/Assembly/ArtificialModeration.js';
import ArtificialModeration from 'src/pages/components/artificial_moderation/ArtificialModeration.vue';
import { IStageGroup } from 'src/composables/stages.composable';

export default defineComponent({
  setup() {
    const { assembly, assemblyMenu } = useAssemblyComposable();
    return {
      assemblyMenu,
      assembly,
    };
  },
  name: 'AssemblyTOC',
  components: {
    ArtificialModeration,
    TOCItem,
  },
  data() {
    return {
      AMs: AMs,
      that: this,
    };
  },

  computed: {
    ready(): boolean {
      return true;
    },

    assemblyMenuItems(): IStageGroup[] {
      return Object.values(this.assemblyMenu);
    },
  },
});
</script>
