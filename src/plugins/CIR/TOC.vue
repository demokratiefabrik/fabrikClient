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

    <template v-if="Object.values(assemblyMenu)">
      <TOCItem      
        :key="item.name"
        v-for="(item, index) in Object.values(assemblyMenu)" 
        :index="index"
        v-on:toggle-expand-state="item.manual_expanded = !item.manual_expanded"
        :item="item" />
    </template>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useAssemblyComposable from 'src/composables/assembly.composable';
import useCIRComposable from './composables/cir.composable';
// import { mapGetters } from 'vuex';
import AMs from 'src/pages/Assembly/ArtificialModeration.js';
import ArtificialModeration from 'src/components/artificial_moderation/ArtificialModeration.vue';
// import { IStageGroup } from 'src/composables/stages.composable';

export default defineComponent({
  setup() {
    // console.log('DEBUG: INDEX:VUE');
    const { assemblyMenu } = useCIRComposable();
    // const { groupsScheduled, next_scheduled_stage } = useStagesComposable();
    const { assembly } = useAssemblyComposable();
    return {
      // groupsScheduled,
      // next_scheduled_stage,
      // gotoAssemblyHome,
      // assemblyIdentifier,
      assemblyMenu,
      assembly
    };
  },
  name: 'AssemblyTOC',
  components: {
    ArtificialModeration,
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

    // scheduledItem(): null | IStageGroup {
    //   const group = this.next_scheduled_stage?.stage.group;
    //   if (!group) {
    //     return null;
    //   }
    //   return this.assemblyMenu[group];
    // },
    // ...mapGetters('assemblystore', [
    //   'assembly',
    //   'is_stage_alerted',
    //   'is_stage_scheduled',
    //   'is_stage_accessible',
    // ]),
  },

  methods: {
    // isAccessible(item) {
    //   return (
    //     !this.isDisabled(item) &&
    //     !item.expandable &&
    //     !this.isScheduledForLater(item)
    //   );
    // },

    // isDisabled(item) {
    //   return !this.groupsAccessible.value.includes(item.name);
    // },

    // isCompleted(item) {
    //   return !this.groupsScheduled.value.includes(item.name);
    // },

    // isScheduledForLater(item) {
    //   return (
    //     this.groupsScheduled.value.includes(item.name) && !this.isFocused(item)
    //   );
    // },

    // isFocused(item) {
    //   return (
    //     this.next_scheduled_stage &&
    //     this.next_scheduled_stage.stage.group == item.name
    //   );
    // },

    // clickItem(item) {
    //   if (!this.isDisabled(item) && !item.expanded(item)) {
    //     this.$router.push(item.to());
    //   }
    // },
  },
});
</script>
