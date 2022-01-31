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

    <q-card
      :key="item.name"
      v-for="(item, index) in Object.values(assemblyMenu)"
      flat
      :class="{
        'cursor-pointer':
          isAccessible(item) || item.expanded(item) || item.expandable,
        hovercraft: isAccessible(item),
        'bg-blue-1': isFocused(item) && !item.expanded(item),
      }"
      @click="
        item.expandable
          ? (item.manual_expanded = !item.manual_expanded)
          : clickItem(item)
      "
    >
      <q-tooltip max-width="300px" v-if="isDisabled(item)">
        {{ $t('menu.items.locked.tooltip') }}
      </q-tooltip>

      <q-card-section horizontal>
        <q-icon
          vertical-align="bottom"
          :color="isFocused(item) ? 'blue' : 'primary'"
          class="q-mt-lg"
          size="
            2.6em"
          :name="item.icon"
        >
          <q-badge
            v-if="isDisabled(item)"
            color="orange"
            style="position: absolute; top: 2em; right: 2em"
          >
            <q-icon name="mdi-clock-time-eleven-outline" size="1.2em" />
          </q-badge>

          <q-badge
            v-if="isCompleted(item)"
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
            v-if="isAccessible(item)"
            :color="isFocused(item) ? 'blue' : 'green'"
            icon="mdi-send"
            :label="isFocused(item) ? 'Öffnen' : 'Nochmals Ansehen'"
          />
          <q-btn
            flat
            size="lg"
            v-if="item.expandable && !item.expanded(item)"
            :color="isFocused(item) ? 'blue' : 'green'"
            :icon="item.manual_expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"
          />
        </q-card-actions>
      </q-card-section>

      <!-- SUB-ITEMS -->
      <q-list v-if="item.expanded(item)" class="q-pb-lg">
        <q-item
          v-for="stage in stages_by_groups[item.name]"
          :key="stage.stage.id"
          clickable
          v-ripple
          :disabled="!is_stage_accessible(stage)"
          class="text-subitle2 q-pl-xl"
          :class="{
            'cursor-pointer': is_stage_accessible(stage),
            hovercraft: is_stage_accessible(stage),
            'bg-blue-1': stage == next_scheduled_stage,
          }"
          @click="is_stage_accessible(stage) && gotoStage(stage)"
        >
          <q-tooltip
            max-width="300px"
            v-if="is_stage_scheduled(stage) && !is_stage_accessible(stage)"
          >
            {{ $t('menu.items.locked.tooltip') }}
          </q-tooltip>

          <q-item-section avatar top middle class="q-pt-sm">
            <q-icon
              v-if="!is_stage_scheduled(stage)"
              color="green"
              name="mdi-check-bold"
            />
            <q-icon
              v-if="stage == next_scheduled_stage"
              color="blue"
              name="mdi-bell"
            />
            <q-icon
              v-if="is_stage_scheduled(stage) && !is_stage_accessible(stage)"
              color="orange"
              name="mdi-clock-time-eleven-outline"
            />
          </q-item-section>

          <!-- <div class="text-caption text-grey"><b>{{stage.stage.title}}: </b> {{stage.stage.info}}</div> -->

          <q-item-section>
            <q-item-label lines="1">{{ stage.stage.title }}</q-item-label>
            <q-item-label caption>{{ stage.stage.info }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-btn
              flat
              v-if="is_stage_accessible(stage)"
              :color="stage == next_scheduled_stage ? 'blue' : 'green'"
              icon="mdi-send"
              style="width: 100px"
              :label="
                stage == next_scheduled_stage ? 'Öffnen' : 'Nochmals Ansehen'
              "
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useAssemblyComposable from 'src/composables/assembly.composable';
import useCIRComposable from './composables/cir.composable';
import { mapGetters } from 'vuex';
import AMs from 'src/pages/Assembly/ArtificialModeration.js';
import ArtificialModeration from 'src/components/artificial_moderation/ArtificialModeration.vue';
import useStagesComposable from 'src/composables/stages.composable';

export default defineComponent({
  setup() {
    // console.log('DEBUG: INDEX:VUE');
    const { assemblyMenu } = useCIRComposable();
    const { groupsScheduled, next_scheduled_stage } = useStagesComposable();
    const { gotoAssemblyHome, assemblyIdentifier } = useAssemblyComposable();
    return {
      groupsScheduled,
      next_scheduled_stage,
      gotoAssemblyHome,
      assemblyIdentifier,
      assemblyMenu,
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

    scheduledItem(): null | IStageGroup {
      const group = this.next_scheduled_stage?.stage.group;
      if (!group) {
        return null
      }
      return this.assemblyMenu[group];
    },
    ...mapGetters('assemblystore', [
      'assembly',
      'is_stage_alerted',
      'is_stage_scheduled',
      'is_stage_accessible',
    ]),
  },

  methods: {
    isAccessible(item) {
      return (
        !this.isDisabled(item) &&
        !item.expandable &&
        !this.isScheduledForLater(item)
      );
    },

    isDisabled(item) {
      return !this.groupsAccessible.value.includes(item.name);
    },

    isCompleted(item) {
      return !this.groupsScheduled.value.includes(item.name);
    },

    isScheduledForLater(item) {
      return (
        this.groupsScheduled.value.includes(item.name) && !this.isFocused(item)
      );
    },

    isFocused(item) {
      return (
        this.next_scheduled_stage &&
        this.next_scheduled_stage.stage.group == item.name
      )
    },

    clickItem(item) {
      if (!this.isDisabled(item) && !item.expanded(item)) {
        this.$router.push(item.to());
      }
    },
  },
});
</script>
