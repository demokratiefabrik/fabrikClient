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
  <div v-if="ready">

    <q-tabs
      v-model="currenttab"
      outside-arrows
      mobile-arrows
      v-if="stages_by_groups"
    >
      <q-route-tab
        v-for="item in Object.values(menu)"
        :key="item.name"
        :name="item.name"
        :disable="!groupsAccessible.includes(item.name)"
        :to="item.to()"
        alert-icon="mdi-account-supervisor-circle"
        :alert='next_scheduled_stage && next_scheduled_stage.stage.group == item.name ? "blue" : false'
        :class="{'q-tab--active': isRoutedPrepartionStage(item.name), trennbar: true}"
        :icon="item.icon"
        :label="item.label"
      >
        <q-tooltip
          v-if="!groupsAccessible.includes(item.name)"
          :offset="menuOffset"
          max-width="300px"
        >{{$t('menu.items.locked.tooltip')}}</q-tooltip>

        <q-tooltip
          v-if="groupsAccessible.includes(item.name)"
          :offset="menuOffset"
          max-width="300px"
        >{{item.tooltip}}</q-tooltip>
        <q-badge
          v-if="!groupsAccessible.includes(item.name)"
          color="orange"
          style="position:absolute; top:2em; right: 2em;"
        >
          <q-icon
            name="mdi-clock-time-eleven-outline"
            size="1.2em"
          />
        </q-badge>

      </q-route-tab>
    </q-tabs>

  </div>

</template>


<script>
import StageGroupMixin from "./stagegroup.mixin";
import { runtimeStore } from "src/store/runtime.store";

export default {
  name: "AssemblyMenu",
  mixins: [StageGroupMixin],
  props: ["menuOffset"],

  data() {
    return {
      currenttab: "",
      assemblyIdentifier: runtimeStore.assemblyIdentifier,
    };
  },

  computed: {
    // return this.$oauth.getOngoingTokenRefresh()
  },
  methods: {
    isRoutedPrepartionStage(name) {
      return name === "preparation" && name === this.currentGroup;
    },
  },
};
</script>