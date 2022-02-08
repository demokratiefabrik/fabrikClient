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

    <template v-if="assemblyMenuItems?.length">
      <TOCItem
        v-for="(item, index) in assemblyMenuItems"
        :key="index"
        :index="index"
        :nextScheduledStage="nextScheduledStage"
        :groupsAccessible="groupsAccessible"
        :groupsScheduled="groupsScheduled"
        :stages_by_groups="stages_by_groups"
        v-on:expand-stage-group="expandStageGroup($event)"
        v-on:goto-stage-group="gotoStageGroup($event)"
        v-on:goto-stage="gotoStage($event)"
        :item="item"
      />
    </template>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
// import useAssemblyComposable from 'src/composables/assembly.composable';
import TOCItem from './TOCItem.vue';
import AMs from 'src/pages/Assembly/ArtificialModeration';

import ArtificialModeration from 'src/pages/components/artificial_moderation/ArtificialModeration.vue';
import useStageComposable from 'src/composables/stage.composable';
import { IStageGroup } from 'src/models/stage';
// import useLibraryComposable from 'src/utils/library';
import library  from 'src/utils/library';

export default defineComponent({
  setup() {
    const { push } = useRouter();
    const { loaded } = library;
    // const { assembly, assemblyMenuData } = useAssemblyComposable();
    const {
      groupsScheduled,
      gotoStage,
      assembly,
      assemblyMenuData,
      groupsAccessible,
      stages_by_groups,
      nextScheduledStage,
    } = useStageComposable();

    return {
      assemblyMenuData,
      groupsScheduled,
      assembly,
      loaded,
      push,
      groupsAccessible,
      nextScheduledStage,
      gotoStage,
      stages_by_groups,
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
      // console.log(this.assemblyMenu)
      return this.loaded(this.assemblyMenuData);
    },

    nextScheduledStageGroup(): null | IStageGroup {
      const group = this.nextScheduledStage?.stage.group;
      if (!group || !this.assemblyMenuData) {
        return null;
      }

      // console.log('DEBUG; ', group, this.assemblyMenuData);
      return this.assemblyMenuData[group];
    },

    assemblyMenuItems(): IStageGroup[] {
      if (!this.assemblyMenuData) {
        return [];
      }
      return Object.values(this.assemblyMenuData);
    },
  },

  methods: {
    gotoStageGroup(item: IStageGroup) {
      this.push(item.to());
    },

    expandStageGroup(item) {
      item.manual_expanded = !item.manual_expanded
    }
  },
});
</script>
