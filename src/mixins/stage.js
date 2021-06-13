import { mapGetters, mapActions } from 'vuex'
import AssemblyMixin from 'src/mixins/assembly'
import { ReactiveProvideMixin } from 'vue-reactive-provide'
import { LayoutEventBus } from 'src/utils/eventbus'
import { runtimeStore } from "src/store/runtime.store"
import constants from 'src/utils/constants'
import StandaloneContentTreeMixin from "src/mixins/standalone.contenttree";

export default {

  mixins: [
    AssemblyMixin,
    StandaloneContentTreeMixin,
    ReactiveProvideMixin({
      name: 'STAGE',
      include: ['routed_stage', 'contenttreeID'],
    })
  ],
  // provide() {
  //   return {
  //     openIndex: this.openIndex,
  //     // openArgument: this.openArgument,
  //   }
  // },
  computed: {

    routed_stage: function () {
      console.log("get routed_stage", runtimeStore.stageID)

      if (!runtimeStore.stageID) {
        return null
      }
      if (!this.assembly_stages) {
        console.log('assembly is not yet loaded')
        return (null)
      }

      if (!this.assembly_stages[runtimeStore.stageID]) {
        console.error('invalid stage in this assembly')
        this.$root.gotoAssemblyHome(this.assembly)
        return null
      }

      const stage = this.assembly_stages[runtimeStore.stageID]

      // console.error('stage found', stage)
      LayoutEventBus.$emit("EventStageLoaded", stage)
      return (stage)
    },

    contenttreeID: function () {
      // Mixin is only usable for pages with assemblyIdentifier in the URL
      console.log("load contenttreeID in contentree.computed")

      // console.log("RETRIEVE contenttreeID..", this.routed_stage)
      if (!this.routed_stage || !this.routed_stage?.stage?.contenttree_id) {
        console.log(" routed_stage not loaded")
        return (null)
      }

      console.log("contenttreeID", this.routed_stage?.stage?.contenttree_id)
      return (this.routed_stage?.stage?.contenttree_id)
    },

    ready() {
      const ready = this.$loaded(this.routed_stage)
      if (ready) {
        LayoutEventBus.$emit('hideLoading')
      }
      return ready;
    },


    isFirstText() {

      // console.log(this.assembly_sorted_stages)
      const firstTextStage = Object.values(this.assembly_sorted_stages).find(
        stage => stage.stage.type == 'TEXTSHEET'
      )
      return this.routed_stage == firstTextStage
    },


    highlightedItem() {
      return this.sideMenuItems.find(
        (item) => {
          if (item.customHightlighting) {
            return item.customHightlighting()
          }
          const weights = this.stageMilestoneWeigths[item.anchor];
          return !weights || weights < 3
        }
      );
    },

    // scrollToHighlightedItem() {
    //   const highlighted = this.highlightedItem
    //   if (highlighted) {
    //     this.$root.scrollToAnchor(highlighted.anchor)
    //   }
    // },

    ...mapGetters("assemblystore", [
      "stageMilestonesCompleted",
      "stageMilestoneLabels",
      "stageMilestoneWeigths",
      "assembly_sorted_stages",
      "is_stage_alerted",
      "get_stage_number_by_stage_id",
      "is_stage_accessible"
    ]),

  },

  methods: {

    milestone: function (milestoneLabel, weight, key) {
      console.assert(this.routed_stage)
      this.addMilestone({ label: milestoneLabel, weight, key })
      this.checkMilestones()
    },


    checkMilestones: function () {
      if (this.stageMilestonesCompleted) {
        // ignore this statement...
        if (this.is_stage_alerted(this.routed_stage)) {
          this.markUnAlert();
        }
        return;
      }
    },

    markUnAlert(stage) {
      // Notify stage as completed
      if (!stage) {
        stage = this.routed_stage
      }
      console.log("IDLE: unalert stage")
      console.assert(stage)
      this.storeStageProgressionAlertFlag({ stageID: stage.stage.id, alerted: false })

      // Fire (immediately), immediately
      const data = { stageID: parseInt(stage.stage.id) }
      this.$root.monitorLog(constants.MONITOR_STAGE_UNALERT, data)
      // setTimeout(x => {
      //   this.$root.monitorFire(constants.MONITOR_STAGE_UNALERT, data)
      // }, 1000)
    },

    markCompleted() {
      // Notify stage as completed
      console.log("COPLETED: mark completed stage", this.routed_stage.stage.id)
      console.assert(this.routed_stage)
      if (!this.routed_stage.progression?.completed) {
        this.$root.monitorLog(constants.MONITOR_STAGE_COMPLETED)
        this.storeStageProgressionCompleted({ stageID: this.routed_stage.stage.id, completed: true })
      }
    },

    // isStageAlerted: function (stage) {
    //   return (!stage.progression || stage.progression.alerted)
    // },


    // openIndex: function () {

    //   // REDIRECT TO ARGUMENT PAGE
    //   this.$router.push({
    //     name: this.routed_stage.stage.type, params: {
    //       assemblyIdentifier: runtimeStore.assemblyIdentifier,
    //       stageID: runtimeStore.stageID
    //       // contenttreeID: this.contenttreeID
    //     }
    //   })
    // },

    // openArgument: function (contentID) {

    //   if (this.standalone) {
    //     return
    //   }

    //   // REDIRECT TO ARGUMENT PAGE
    //   this.$router.push({
    //     name: this.routed_stage.stage.type,
    //     params: {
    //       assemblyIdentifier: runtimeStore.assemblyIdentifier,
    //       stageID: runtimeStore.stageID,
    //       contentID: contentID
    //     }
    //   })
    // },

    ...mapActions("assemblystore", [
      "storeStageProgressionAlertFlag",
      "storeStageProgressionCompleted",
      "addMilestone"
    ]),
  },
  watch: {
    contenttreeID(to, from) {
      if (to) {
        this.$store.dispatch('contentstore/syncContenttree', {
          assemblyIdentifier: runtimeStore.assemblyIdentifier,
          contenttreeID: to,
          oauthUserID: this.oauth.userid
        })
      }
    },
  },
  created() {
    this.checkMilestones()
  }
}
