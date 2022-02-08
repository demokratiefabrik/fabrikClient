<style scoped>
.hovercraft:hover {
  background-color: gainsboro;
}
</style>

<template>
  <q-card
    flat
    :class="{
      'cursor-pointer': isAccessible && (!expanded || item.expandable), // or: ||
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
          :color="isFocused ? 'blue' : 'green'"
          :icon="item.manual_expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        />
      </q-card-actions>
    </q-card-section>

    <!-- SUB-ITEMS -->
    <q-list v-if="expanded && subStages.length" class="q-pb-lg">
      <TOCSubItem
        v-for="stage in subStages"
        v-on:goto-stage="$emit('goto-stage',$event)"
        :key="(stage as any).stage.id"
        :nextScheduledStage="nextScheduledStage"
        :stage="stage"
      />
    </q-list>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TOCSubItem from './TOCSubItem.vue';
import { IStageTuple } from 'src/models/stage';

export default defineComponent({
  name: 'AssemblyTOCItem',
  emits: ['goto-stage', 'expand-stage-group', 'goto-stage-group'],
  props: [
    'item',
    'index',
    'nextScheduledStage',
    'groupsAccessible',
    'groupsScheduled',
    'stages_by_groups',
  ],
  components: { TOCSubItem },

  computed: {
    subStages(): IStageTuple[] {
      if (!this.stages_by_groups) {
        return [];
      }
      const keys = Object.keys(this.stages_by_groups);
      if (keys?.includes(this.item.name)) {
        return this.stages_by_groups[this.item.name];
      }
      return [];
    },

    isAccessible(): boolean {
      return (
        !this.isDisabled && !this.item.expandable && !this.isScheduledForLater
      );
    },

    isDisabled(): boolean {
      return !this.groupsAccessible?.includes(this.item.name);
    },

    isCompleted(): boolean {
      return !this.groupsScheduled?.includes(this.item.name);
    },

    isScheduledForLater(): boolean | undefined {
      return this.groupsScheduled?.includes(this.item?.name) && !this.isFocused;
    },

    isFocused(): boolean | null {
      if (!this.item?.name) {
        return null;
      }
      return (
        this.nextScheduledStage &&
        this.nextScheduledStage.stage.group == this.item.name
      );
    },

    expanded(): boolean {
      return this.item.expanded(this.item);
    },
  },

  methods: {
    clickItem(): void {
      if (this.item.expandable) {
        this.$emit('expand-stage-group', this.item);
      } else {
        // move to next stage
        if (!this.isDisabled && !this.expanded) {
          this.$emit('goto-stage-group', this.item);
        }
      }
    },
  },
});
</script>
