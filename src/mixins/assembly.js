import { mapGetters, mapActions } from 'vuex'
// import { scroll } from 'quasar'
import { LayoutEventBus } from 'src/utils/eventbus'
import { runtimeStore, runtimeMutations } from "src/store/runtime.store"
import constants from 'src/utils/constants'

// const { getScrollTarget, setScrollPosition } = scroll

/* Note: Make available all the properties and methods in any descendant object.*/
// const ReactiveProvidePropertiesMixin = ReactiveProvideMixin({
//   name: 'ABLY',
//   include: ['assemblyAcls']
// })

export default {

  provide() {
    return {
      gotoNextStageNr: this.gotoNextStageNr,
      getDailyContributionLimits: this.getDailyContributionLimits,
    }
  },
  // CONTENTTREE
  computed: {

    ...mapGetters(
      'assemblystore',
      ['assembly', 'assemblyProgression', "assemblyConfiguration", 'assembly_sorted_stages', 'is_stage_accessible', 'is_stage_scheduled',
        'last_accessible_stage', 'is_stage_idle',
        'is_stage_done', 'is_stage_disabled', 'is_stage_completed',
        'is_stage_new', 'is_stage_last',
        'is_stage_first', 'is_stage_alert', 'assembly_scheduled_stages', 'assembly_stages',
        'get_stage_number_by_stage_id', 'get_stage_number_by_stage', 'next_scheduled_stage',
        'find_next_accessible_stage', 'assembly_stages', 'IsDelegate', 'IsManager'
      ]
    ),

    daySessions() {
      return this.assemblyProgression?.number_of_day_sessions
    },


    ready() {
      const ready = this.$loaded(this.assembly)
      if (ready) {
        LayoutEventBus.$emit('hideLoading')
      }
      return ready;
    },

    stage_nr_last_visited: {
      get() {
        if (isNaN(runtimeStore.stageID) || runtimeStore.stageID === null) {
          return null
        }
        return this.get_stage_number_by_stage_id(runtimeStore.stageID)
      },
      set(stageNr) {
        if (stageNr === null || stageNr === undefined) {
          runtimeMutations.setStageID(null)
        } else {
          const stageID = this.assembly_sorted_stages[stageNr].stage.id
          // console.log("set stageID by stageNR", stageNr, stageID)
          runtimeMutations.setStageID(stageID)
        }
      }
    },

    stage_last_visited() {
      if (this.stage_nr_last_visited === null) {
        return null
      }
      return this.assembly_sorted_stages[this.stage_nr_last_visited]
    },

    limitForAddingProposalsReached() {
      let dailyContributionLimits = this.getDailyContributionLimits()
      if (!this.$loaded(dailyContributionLimits)) {
        return null
      }
      dailyContributionLimits = dailyContributionLimits.number_of_proposals
      return (
        dailyContributionLimits.current >= dailyContributionLimits.daylimit
      );
      return (true)
    },

    limitForAddingCommentsReached() {
      if (this.IsManager) {
        return false
      }

      let dailyContributionLimits = this.getDailyContributionLimits()
      if (!this.$loaded(dailyContributionLimits)) {
        return null
      }
      if (!this.$loaded(dailyContributionLimits)) {
        return null
      }
      dailyContributionLimits = dailyContributionLimits.number_of_comments
      return (
        dailyContributionLimits.current >= dailyContributionLimits.daylimit
      );
      return (true)
    },
  },

  methods: {

    clickBackToAssemblyListButton: function () {
      runtimeMutations.setAssemblyIdentifier(null)
      this.$router.push({ name: 'assemblies' })
    },

    stageTransition: function (newVal, oldVal) {
      //   // this.scrollToStage()
    },

    laggedScrollToStage: function () {
      setTimeout(() => {
        this.scrollToStage()
      }, 200)
    },

    gotoNextStageNr: function (stage) {
      console.assert(stage)
      console.log("gotoNextStageNr")
      const currentStageGroup = stage.stage.group

      const nextStage = this.find_next_accessible_stage(stage)
      if (!nextStage) {
        console.log("NOTE: Assembly seems to be completed!")
        return (null)
      }
      const nextStageGroup = stage.stage.group
      if (nextStageGroup !== currentStageGroup) {
        // different group: so make a new route...
        console.log("ROUTERROUTE")
        this.$router.push(`${nextStage.stage.id}/${nextStage.stage.group}`)
      } else {
        // just update , the "stage_nr_last_visited"
        // console.log(this.stage_nr_last_visited, "old stage")
        this.stage_nr_last_visited = this.get_stage_number_by_stage(nextStage)
        console.log(this.stage_nr_last_visited, "new stage")

      }

    },

    gotoStage(stage) {
      console.assert(stage)
      this.$router.push(this.getStageRoute(stage))
    },

    getStageRoute(stage) {
      console.assert(stage)
      var params = {
        assemblyIdentifier: runtimeStore.assemblyIdentifier,
        stageID: stage.stage.id,
        contenttreeID: stage.stage.contenttree_id,
      };

      return {
        name: stage.stage.type,
        params: params,
      };
    },


    // TODO: what is that for?
    gotoDefaultStageTeaser() {

      console.log("goto default stage teaser")
      if (runtimeStore.stageID !== null && runtimeStore.stageID !== undefined) {
        this.stage_nr_last_visited = this.get_stage_number_by_stage_id(runtimeStore.stageID)
      } else if (this.last_accessible_stage) {
        this.stage_nr_last_visited = this.get_stage_number_by_stage(this.last_accessible_stage)
      } else {
        this.stage_nr_last_visited = null
      }
    },


    getDailyContributionLimits() {
      const progression = this.assemblyProgression
      const configuration = this.assemblyConfiguration
      // console.log("Assembly PROG", progression)
      // console.log("Configuration", configuration)

      if (!configuration || !progression) {
        // can happen when logout
        return;
      }

      return ({
        number_of_proposals: {
          daylimit: configuration.MAX_DAILY_USER_PROPOSALS,
          current: progression.number_of_proposals_today === null ? 0 : progression.number_of_proposals_today
        },
        number_of_comments: {
          daylimit: configuration.MAX_DAILY_USER_COMMENTS,
          current: progression.number_of_comments_today === null ? 0 : progression.number_of_comments_today
        }
      })

    },

    ...mapActions({ setCachedStageID: 'assemblystore/setCachedStageID' })
  },

  mounted: function () {

    // console.log('>> APP LOADED: in assembly. Stage: ', this.stage_nr_last_visited)
    this.$store.dispatch('assemblystore/syncAssembly', {
      oauthUserID: this.oauth.userid,
      assemblyIdentifier: runtimeStore.assemblyIdentifier
    })
  }

}
