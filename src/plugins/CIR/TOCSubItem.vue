<style scoped>
.hovercraft:hover {
  background-color: gainsboro;
}
</style>

<template>
  <q-item
    clickable
    v-ripple
    :disabled="!stage_accessible"
    class="text-subitle2 q-pl-xl"
    :class="{
      'cursor-pointer': stage_accessible,
      hovercraft: stage_accessible,
      'bg-blue-1': stage == next_scheduled_stage,
    }"
    @click="stage_accessible && gotoStage"
  >
    <q-tooltip max-width="300px" v-if="is_stage_scheduled && !stage_accessible">
      {{ $t('menu.items.locked.tooltip') }}
    </q-tooltip>

    <q-item-section avatar top middle class="q-pt-sm">
      <q-icon v-if="!is_stage_scheduled" color="green" name="mdi-check-bold" />
      <q-icon
        v-if="stage == next_scheduled_stage"
        color="blue"
        name="mdi-bell"
      />
      <q-icon
        v-if="is_stage_scheduled && !stage_accessible"
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
        v-if="is_stage_accessible"
        :color="stage == next_scheduled_stage ? 'blue' : 'green'"
        icon="mdi-send"
        style="width: 100px"
        :label="stage == next_scheduled_stage ? 'Öffnen' : 'Nochmals Ansehen'"
      />
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
// import useAssemblyComposable from 'src/composables/assembly.composable';
// import useCIRComposable from './composables/cir.composable';
// import { mapGetters } from 'vuex';
// import AMs from 'src/pages/Assembly/ArtificialModeration.js';
// import ArtificialModeration from 'src/components/artificial_moderation/ArtificialModeration.vue';
import useStagesComposable from 'src/composables/stages.composable';
import { mapGetters } from 'vuex';
import useAssemblyComposable from 'src/composables/assembly.composable';
// { IStageGroup }
export default defineComponent({
  setup() {
    // console.log('DEBUG: INDEX:VUE');
    // const { assemblyMenu } = useCIRComposable();
    const { push } = useRouter();
    const {gotoStage} = useAssemblyComposable();
    const { next_scheduled_stage, groupsAccessible, groupsScheduled } =
      useStagesComposable();
    // const { gotoAssemblyHome, assemblyIdentifier } = useAssemblyComposable();
    return {
      groupsScheduled,
      groupsAccessible,
      next_scheduled_stage,
      gotoStage,
      push,
      // gotoAssemblyHome,
      // assemblyIdentifier,
      // assemblyMenu,
    };
  },
  name: 'TOCSubItem',
  props: ['stage'],

  computed: {
    // scheduledItem(): null | IStageGroup {
    //   const group = this.next_scheduled_stage?.stage.group;
    //   if (!group) {
    //     return null;
    //   }
    //   return this.assemblyMenu[group];
    // },

    ...mapGetters('assemblystore', [
      'is_stage_alerted',
      'is_stage_scheduled',
      'is_stage_accessible',
    ]),

    stage_alerted() {
      return this.is_stage_alerted(this.stage)
    },

    stage_scheduled() {
      return this.is_stage_scheduled(this.stage)
    },

    stage_accessible() {
      return this.is_stage_accessible(this.stage)
    }
 },
});
</script>