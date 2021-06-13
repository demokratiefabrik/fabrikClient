// import StageMixin from 'src/mixins/stage'
import { mapGetters } from 'vuex'
import { runtimeStore } from "src/store/runtime.store"
import { LayoutEventBus } from 'src/utils/eventbus'

export default {
  data() {
    return {
    }
  },

  computed: {


    ready() {
      const ready = this.$loaded(this.assembly_stages)
      if (ready) {
        LayoutEventBus.$emit('hideLoading')
      }

      if (!this.IsManager) {
        if (this.routed_stage && !this.is_stage_accessible(this.routed_stage)) {
          this.$root.gotoAssemblyHome(this.assembly);
        }
      }

      return ready;
    },


    routed_stage: function () {
      if (!runtimeStore.stageID) {
        return null;
      }
      if (!this.assembly_stages) {
        return null
      }
      return (this.assembly_stages[runtimeStore.stageID])
    },

    groups() {
      return Object.keys(this.stages_by_groups)
    },

    stages_by_groups() {

      const stages_by_groups = {}
      if (!this.assembly_stages) {
        return null
      }

      Object.values(this.assembly_sorted_stages).forEach(stage => {
        if (!stages_by_groups[stage.stage.group]) {
          stages_by_groups[stage.stage.group] = []
        }
        stages_by_groups[stage.stage.group].push(stage)
      })

      return stages_by_groups
    },

    groupsAccessible: function () {
      if (!this.assembly_scheduled_stages) {
        return;
      }
      const groups = this.assembly_accessible_stages.map(stage => stage.stage.group)
      return groups;
    },

    groupsScheduled: function () {
      if (!this.assembly_scheduled_stages) {
        return;
      }
      const groups = this.assembly_scheduled_stages.map(stage => stage.stage.group)
      return groups;
    },

    currentGroup: function () {
      console.log("get Stage Group")
      if (!runtimeStore.stageID || !this.routed_stage) {
        return 'preparation'
      }
      return this.routed_stage.stage.group
    },

    ...mapGetters(
      'assemblystore',
      ['assembly_sorted_stages', 'assembly_stages', 'assembly_accessible_stages',
        'assembly_scheduled_stages', 'IsManager', 'assembly',
        'assembly_sorted_stages', 'is_stage_accessible', 'next_scheduled_stage']
    )
  },

  methods: {

    is_stage_first_shown(stage) {
      console.assert(stage)
      return stage === this.stages[length(this.stages) - 1]
    },

    is_stage_last_shown(stage) {
      console.assert(stage)
      return stage === this.stages[0]
    },

    getFirstOrRoutedStageIDByGroup: function (group) {
      console.assert(this.stages_by_groups)
      if (this.routed_stage) {
        if (this.stages_by_groups[group].find(x => this.routed_stage.stage.id === x.stage.id)) {
          return this.routed_stage.stage.id
        }
      }
      console.assert(this.stages_by_groups[group])
      console.assert(this.stages_by_groups[group][0])
      return this.stages_by_groups[group][0].stage.id
    }
  }
}