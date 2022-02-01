<style scoped>
.hovercraft:hover {
  background-color: gainsboro;
}
</style>

<template>
  <q-card
    flat
    :class="{
      'cursor-pointer': isAccessible || expanded || item.expandable,
      hovercraft: isAccessible,
      'bg-blue-1': isFocused && !expanded,
    }"
    @click="clickItem()"
  >
    <q-tooltip max-width="300px" v-if="isDisabled">
      {{ $t('menu.items.locked.tooltip') }}
    </q-tooltip>

    <q-card-section horizontal>
      <q-icon
        vertical-align="bottom"
        :color="isFocused ? 'blue' : 'primary'"
        class="q-mt-lg"
        size="
            2.6em"
        :name="item.icon"
      >
        <q-badge
          v-if="isDisabled"
          color="orange"
          style="position: absolute; top: 2em; right: 2em"
        >
          <q-icon name="mdi-clock-time-eleven-outline" size="1.2em" />
        </q-badge>

        <q-badge
          v-if="isCompleted"
          color="green"
          style="position: absolute; top: 2em; right: 2em"
        >
          <q-icon name="mdi-check-bold" size="1.5em" />
        </q-badge>
      </q-icon>

      <q-card-section>
        <div class="text-overline text-orange-9">{{ index + 1 }}. Punkt</div>
        <div class="text-h5 q-mt-sm q-mb-xs">
          {{ item.toc_label ? item.toc_label : item.label }}
        </div>
        <div class="text-caption">{{ item.description }}</div>
      </q-card-section>

      <q-card-actions>
        <q-btn
          flat
          v-if="isAccessible"
          :color="isFocused ? 'blue' : 'green'"
          icon="mdi-send"
          :label="isFocused ? 'Öffnen' : 'Nochmals Ansehen'"
        />
        <q-btn
          flat
          size="lg"
          v-if="item.expandable && !expanded"
          :color="isFocused(item) ? 'blue' : 'green'"
          :icon="item.manual_expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        />
      </q-card-actions>
    </q-card-section>

    <!-- SUB-ITEMS -->
    <q-list v-if="expanded && stages_by_groups" class="q-pb-lg">
      <TOCSubItem
        v-for="stage in stages_by_groups[item.name]"
        :key="(stage as any).stage.id"
        :stage="stage"
      />
    </q-list>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import TOCSubItem from './TOCSubItem.vue';

// import useAssemblyComposable from 'src/composables/assembly.composable';
// import useCIRComposable from './composables/cir.composable';
// import { mapGetters } from 'vuex';
// import AMs from 'src/pages/Assembly/ArtificialModeration.js';
// import ArtificialModeration from 'src/components/artificial_moderation/ArtificialModeration.vue';
import useStagesComposable from 'src/composables/stages.composable';
// { IStageGroup }
export default defineComponent({
  setup() {
    // console.log('DEBUG: INDEX:VUE');
    // const { assemblyMenu } = useCIRComposable();
    const { push } = useRouter();
    const {
      next_scheduled_stage,
      groupsAccessible,
      groupsScheduled,
      stages_by_groups,
    } = useStagesComposable();
    // const { gotoAssemblyHome, assemblyIdentifier } = useAssemblyComposable('');
    return {
      groupsScheduled,
      groupsAccessible,
      next_scheduled_stage,
      stages_by_groups,
      push,
      // gotoAssemblyHome,
      // assemblyIdentifier,
      // assemblyMenu,
    };
  },
  name: 'AssemblyTOCItem',
  props: ['item', 'index'],
  components: { TOCSubItem },

  computed: {
    // scheduledItem(): null | IStageGroup {
    //   const group = this.next_scheduled_stage?.stage.group;
    //   if (!group) {
    //     return null;
    //   }
    //   return this.assemblyMenu[group];
    // },

    isAccessible() {
      return (
        !this.isDisabled && !this.item.expandable && !this.isScheduledForLater
      );
    },

    isDisabled() {
      return !this.groupsAccessible.value.includes(this.item.name);
    },

    isCompleted() {
      return !this.groupsScheduled.value.includes(this.item.name);
    },

    isScheduledForLater() {
      return (
        this.groupsScheduled.value.includes(this.item.name) && !this.isFocused
      );
    },

    isFocused(item) {
      return (
        this.next_scheduled_stage &&
        this.next_scheduled_stage.stage.group == item.name
      );
    },

    expanded() {
      return this.item.expanded(this.item)
    }
  },

  methods: {
    clickItem(): void {
      if (this.item.expandable) {
        this.$emit('toggle-expand-state');
      } else {
        // move to next stage
        if (!this.isDisabled && !this.expanded) {
          this.push(this.item.to());
        }
      }
    },
  },
});
</script>
