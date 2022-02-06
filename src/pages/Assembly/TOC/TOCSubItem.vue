<style scoped>
.hovercraft:hover {
  background-color: gainsboro;
}
</style>

<template>
  <q-item
    clickable
    v-ripple
    :disabled="stage_accessible ? null : true"
    class="text-subitle2 q-pl-xl"
    :class="{
      'cursor-pointer': stage_accessible,
      hovercraft: stage_accessible,
      'bg-blue-1': stage == nextScheduledStage,
    }"
    @click="stage_accessible && gotoStage(stage)"
  >

    <q-tooltip max-width="300px" v-if="stage_scheduled && !stage_accessible">
      {{ $t('menu.items.locked.tooltip') }}
    </q-tooltip>

    <q-item-section avatar top middle class="q-pt-sm">
      <q-icon v-if="!stage_scheduled" color="green" name="mdi-check-bold" />
      <q-icon
        v-if="stage == nextScheduledStage"
        color="blue"
        name="mdi-bell"
      />
      <q-icon
        v-if="stage_scheduled && !stage_accessible"
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
        v-if="stage_accessible"
        :color="stage == nextScheduledStage ? 'blue' : 'green'"
        icon="mdi-send"
        style="width: 100px"
        :label="stage == nextScheduledStage ? 'Öffnen' : 'Nochmals Ansehen'"
      />
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useStageComposable from 'src/composables/stage.composable';
import { mapGetters } from 'vuex';
import useAssemblyComposable from 'src/composables/assembly.composable';

export default defineComponent({
  setup() {
    const { gotoStage } = useAssemblyComposable('');
    const { nextScheduledStage } = useStageComposable();
    return {
      nextScheduledStage,
      gotoStage,
    };
  },
  name: 'TOCSubItem',
  props: ['stage'],
  computed: {
    ...mapGetters('assemblystore', [
      'is_stage_alerted',
      'is_stage_scheduled',
      'is_stage_accessible',
    ]),

    stage_alerted() {
      return this.is_stage_alerted(this.stage);
    },

    stage_scheduled() {
      return this.is_stage_scheduled(this.stage);
    },

    stage_accessible() {
      return this.is_stage_accessible(this.stage);
    },
  },
});
</script>
