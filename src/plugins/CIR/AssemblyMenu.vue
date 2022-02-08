<style scoped>
.trennbar {
  /* hyphens */
  -moz-hyphens: auto;
  -o-hyphens: auto;
  -webkit-hyphens: auto;
  -ms-hyphens: auto;
  hyphens: auto;
}
</style>

<template>
  <div v-if="ready && assemblyMenuData">
    <q-tabs
      v-model="currenttab"
      outside-arrows
      mobile-arrows
      v-if="stages_by_groups"
    >
      <q-route-tab
        v-for="item in Object.values(assemblyMenuData)"
        :key="item.name"
        :name="item.name"
        :disable="!groupsAccessible?.includes(item.name)"
        :to="item.to()"
        alert-icon="mdi-account-supervisor-circle"
        :alert="
          nextScheduledStage && nextScheduledStage.stage.group == item.name
            ? 'blue'
            : false
        "
        :class="{
          'q-tab--active': isRoutedPrepartionStage(item.name),
          trennbar: true,
        }"
        :icon="item.icon"
        :label="item.label"
      >
        <q-tooltip
          v-if="!groupsAccessible?.includes(item.name)"
          :offset="menuOffset"
          max-width="300px"
          >{{ $t('menu.items.locked.tooltip') }}</q-tooltip
        >

        <q-tooltip
          v-if="groupsAccessible?.includes(item.name)"
          :offset="menuOffset"
          max-width="300px"
          >{{ item.tooltip }}</q-tooltip
        >
        <q-badge
          v-if="!groupsAccessible?.includes(item.name)"
          color="orange"
          style="position: absolute; top: 2em; right: 2em"
        >
          <q-icon name="mdi-clock-time-eleven-outline" size="1.2em" />
        </q-badge>
      </q-route-tab>
    </q-tabs>
  </div>
</template>

<script lang="ts">
import useStageComposable from 'src/composables/stage.composable';
import useRouterComposable from 'src/composables/router.composable';
import library  from 'src/utils/library';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AssemblyMenu',
  props: ['menuOffset'],

  setup() {
    const { loaded } = library;
    const {
      stages_by_groups,
      routedStageGroup,
      nextScheduledStage,
      assemblyMenuData,
      groupsAccessible,
      getFirstOrRoutedStageIDByGroup,
    } = useStageComposable();
    const { pushR } = useRouterComposable();

    return {
      getFirstOrRoutedStageIDByGroup,
      stages_by_groups,
      routedStageGroup,
      assemblyMenuData,
      groupsAccessible,
      nextScheduledStage,
      loaded,
      pushR,
    };
  },
  data() {
    return {
      currenttab: '',
    };
  },
  computed: {
    ready(): boolean {
      return this.loaded(this.assemblyMenuData) && this.loaded(this.routedStageGroup);
    },
  },
  methods: {
    isRoutedPrepartionStage(name) {
      return name === 'preparation' && name === this.routedStageGroup;
    },
  },
});
</script>
