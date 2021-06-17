/* Public Index: the publically accessible list of all potential accessible assemblies:
- assemblies that are currently ongoing (require invitation)
- assemblies that have been published (accessible by the public)
*/
import Vue from 'vue'
import api from 'src/utils/api'
import { LayoutEventBus } from 'src/utils/eventbus.js'
import { runtimeStore } from "src/store/runtime.store";
import { date } from 'quasar'

var state = {
  assemblydata: {},
  stages: {},
  milestones: {}
}

const getters = {

  assemblyTuple: (state, getters) => {

    if (!runtimeStore.assemblyIdentifier) {
      return null
    }

    return (state.assemblydata[runtimeStore.assemblyIdentifier])
  },

  assembly: (state, getters) => {

    if (!getters.assemblyTuple) {
      return null
    }

    return (getters.assemblyTuple.assembly)
  },

  assemblyName: (state, getters) => {

    if (getters.assembly) {
      return (getters.assembly.title)
    }
  },

  assemblyType: (state, getters) => {
    if (getters.assembly) {
      return (getters.assembly.type)
    }
  },

  assemblyConfiguration: (state, getters) => {
    if (!getters.assemblyTuple) {
      console.log('...assemblyTuple not ready')
      return null
    }
    return (getters.assemblyTuple.configuration)
  },

  assembly_userid: (state, getters) => {

    if (!getters.assemblyTuple) {
      console.log('...assemblyTuple not ready')
      return null
    }

    return (getters.assemblyTuple.access_sub)
  },


  assemblyProgression: (state, getters) => {

    if (!getters.assemblyTuple) {
      return null
    }
    // console.log(getters.assemblyTuple.progression)
    return (getters.assemblyTuple.progression)
  },

  assembly_stages: (state, getters) => {
    if (!getters.assemblyTuple) {
      console.log('...assemblyTuple not ready')
      return null
    }

    const stage_keys = getters.assemblyTuple.stages

    /** 
     * filter only the stages of the specific assembly
     * */
    // TODO: use Object.filter (defined in boot/index)
    const stages = Object.keys(state.stages)
      .filter(key => stage_keys.includes(`${key}`))
      .reduce((obj, key) => {
        obj[key] = state.stages[key];
        return obj;
      }, {})

    return stages
  },


  /**
   * oAuth Server delivers user roles in the format "<role>@<assemblyIdentifier>".
   * THis method translates thes roles in a list of acls for the given Assembly.
   * => such as  ['delegate', 'modify', 'observe']
   */
  assemblyAcls: (state, getters, rootState, rootGetters) => {

    if (!runtimeStore.assemblyIdentifier) {
      return null
    }
    const translateAclMethod = rootGetters["publicprofilestore/translateOauthAcls"]
    return translateAclMethod(runtimeStore.assemblyIdentifier)
  },

  IsManager: (state, getters) => {
    if (!getters.assemblyAcls) { return null }
    return getters.assemblyAcls.includes('manage')
  },
  IsObserver: (state, getters) => {
    if (!getters.assemblyAcls) { return null }
    return getters.assemblyAcls.includes('observe')
  },
  IsContributor: (state, getters) => {
    if (!getters.assemblyAcls) { return null }
    return getters.assemblyAcls.includes('add')
  },
  IsExpert: (state, getters) => {
    if (!getters.assemblyAcls) { return null }
    return getters.assemblyAcls.includes('expert')
  },
  IsDelegate: (state, getters) => {
    if (!getters.assemblyAcls) { return null }
    return getters.assemblyAcls.includes('delegate')
  },

  stageMilestones: (state, getters) => {
    console.log(">> NOTE: stageMilestones")

    if (!runtimeStore.stageID) {
      console.log('...stageID not ready')
      return null
    }
    const day = getters.assemblyProgression?.number_of_day_sessions;
    console.assert(day && day > 0)
    const stateMilestones = state.milestones[day]
    if (!stateMilestones) {
      return []
    }
    const milestones = stateMilestones[runtimeStore.stageID]
    return milestones ? milestones : []
  },

  stageMilestoneLabels: (state, getters) => {
    const milestones = getters.stageMilestones
    if (!milestones) {
      console.log("empty milestoness...............sldfls")
      return []
    }
    return milestones.map(milestone => milestone.label)
  },

  stageMilestoneWeigths: (state, getters) => {
    const milestones = getters.stageMilestones
    if (!milestones) {
      return {}
    }

    const weights = {}
    milestones.forEach(milestone => {
      if (!(milestone.label in weights)) {
        weights[milestone.label] = 0
      };
      weights[milestone.label] += parseInt(milestone.weight)
    });
    return weights;
  },

  stageMilestonesCompleted: (state, getters) => {

    // Every user needs to archieve 10 milestones weights for each stage a day. 
    const milestones = getters.stageMilestones
    console.assert(milestones !== null)
    var weights = milestones.reduce((n, milestone) => n + milestone['weight'], 0)
    // console.log(weights, "weights")
    return weights >= 12
  },

  stage: (state, getters, rootState, rootGetters, test1, test2) => {
    const stages = getters.assembly_stages
    return (stages[runtimeStore.stageID])
  },

  assembly_sorted_stages: (state, getters) => {
    // console.log(">>..:Sort stages :")
    // console.trace()
    const stages = getters.assembly_stages
    if (!stages) {
      return null
    }

    if (stages) {
      return Object.values(stages).sort((a, b) => a.stage.order_position < b.stage.order_position ? -1 : a.stage.order_position > b.stage.order_position ? 1 : 0)
    }
  },


  /** Which stage is  the next scheduled stage (if empty, no stages available or no scheduled stage available) */
  next_scheduled_stage: (state, getters) => {
    // console.log(">> next_scheduled_stage")
    // console.log(getters.assembly_sorted_stages)
    const stages = getters.assembly_sorted_stages
    if (!stages) {
      console.log('assemmbly is not yet loaded')
      return null
    }
    // console.log("sorted stages,", stages)
    // console.log(getters.is_stage_scheduled(stages[1]))
    const last_accessible_stage = stages.find(stage => true &&
      getters.is_stage_scheduled(stage) &&
      !getters.is_stage_disabled(stage) &&
      !getters.is_stage_completed(stage))
    // console.trace()
    return last_accessible_stage
  },

  /** Which stage is  the last one that is freely open / accessible */
  last_accessible_stage: (state, getters) => {

    const nextScheduledStage = getters.next_scheduled_stage
    const stages = getters.assembly_sorted_stages

    if (!stages) {
      console.log('assemmbly is not yet loaded')
      return null
    }

    if (!nextScheduledStage) {
      // it seems that all stages are open! => take the last one...
      return (stages[stages.length - 1])
    }

    // console.log('current stage: ', nextScheduledStage)
    return nextScheduledStage
  },

  /* Return all stages, that are still to absolve */
  assembly_scheduled_stages: (state, getters) => {
    const sorted_stages = getters.assembly_sorted_stages
    if (!sorted_stages) {
      console.log('assemmbly is not yet loaded')
      return null
    }
    return sorted_stages.filter(stage => getters.is_stage_scheduled(stage))
  },

  /** Which stages are freely open / accessible */
  assembly_accessible_stages: (state, getters) => {
    const sorted_stages = getters.assembly_sorted_stages
    if (!sorted_stages) {
      console.log('assemmbly is not yet loaded')
      return null
    }
    // console.assert(sorted_stages)
    const last_accessible_stage = getters.last_accessible_stage
    console.assert(last_accessible_stage)

    // Return all stages until the last_accessible_stage
    return sorted_stages.filter(stage => true &&
      stage.stage.order_position <= last_accessible_stage.stage.order_position &&
      !getters.is_stage_disabled(stage) &&
      !getters.is_stage_completed(stage))
  },


  /** Which stages are freely open / accessible */
  assembly_accessible_stage_ids: (state, getters) => {
    const accessible_stages = getters.assembly_accessible_stages

    if (!accessible_stages) {
      return null
    }

    return accessible_stages.map(stage => stage.stage.id)
  },

  get_stage_number_by_stage: (state, getters) => (stage) => {
    console.assert(stage)
    const sorted_stages = getters.assembly_sorted_stages
    console.assert(sorted_stages)
    const sorted_stage_ids = sorted_stages.map(stage => stage.stage.id)
    // console.log(sorted_stage_ids)
    const stage_number = sorted_stage_ids.indexOf(stage.stage.id)
    // console.log(stage_number, "stage_number of stage: ", stage)
    // console.log("sorted_stage: ", sorted_stages)
    console.assert(stage_number > -1)

    return (stage_number)
  },


  get_stage_number_by_stage_id: (state, getters) => (stageID) => {
    if (!stageID) {
      return (null)
    }
    // assembly loaded?
    const sorted_stages = getters.assembly_sorted_stages
    if (!sorted_stages) {
      return (null)
    }

    console.assert(sorted_stages)
    const sorted_stage_ids = sorted_stages.map(stage => stage.stage.id)
    const stage_number = sorted_stage_ids.indexOf(stageID)
    // console.log("find stage", stageID, " in ", sorted_stage_ids)
    console.assert(stage_number > -1)

    return (stage_number)
  },



  find_next_accessible_stage: (state, getters) => (previous_stage) => {
    // console.log("previous stage: moveon ", previous_stage)
    console.assert(previous_stage)
    const next_stage = getters.assembly_accessible_stages.find(stage => true &&
      stage.stage.order_position > previous_stage.stage.order_position)
    // console.log("new stage found", next_stage)
    return next_stage
  },


  is_stage_first: (state, getters) => (stage) => {
    console.assert(stage)
    const sorted_stages = getters.assembly_sorted_stages
    return (sorted_stages[0] == stage)
  },

  is_stage_last: (state, getters) => (stage) => {
    console.assert(stage)
    console.assert(stage.stage)

    const sorted_stages = getters.assembly_sorted_stages
    console.assert(sorted_stages[sorted_stages.length - 1])
    return (sorted_stages[sorted_stages.length - 1]?.stage.id == stage.stage.id)
  },

  /* Is there still an activity required on this stage? */
  is_stage_scheduled: (state, getters) => (stage) => {
    console.assert(stage)
    if (getters.is_stage_completed(stage)) {
      return (false)
    }
    
    // for observers and other users...
    if (!getters.IsDelegate) {
      return false
    }

    // only for delegates....
    return getters.is_stage_alerted(stage) || getters.is_stage_new(stage)
  },

  /** Which stage is new => no progression entry is available */
  is_stage_new: (state) => (stage) => {
    console.assert(stage)
    // when progression entry not yet exists...
    return !stage.progression
  },

  /**
   * Not scheduled, not new, not completeed => just idle
   */
  is_stage_alerted: (state) => (stage) => {
    // when progression entry not yet exists or when alerted flag is set...
    return !stage.progression || stage.progression.alerted
  },

  is_stage_idle: (state, getters) => (stage) => {
    console.assert(stage)
    return !getters.is_stage_scheduled(stage) &&
      !getters.is_stage_completed(stage) &&
      !getters.is_stage_disabled(stage)
  },

  is_stage_skipped: (state) => (stage) => {
    console.assert(stage)
    return stage.progression?.skipped
  },

  is_stage_disabled: (state) => (stage) => {
    console.assert(stage)
    return (false);
    // only admins see deleted attribute.
    // return (stage.progression?.dis)
    // TODO: not anymore available, right? return (stage.stage.disabled || stage.stage.deleted)
  },

  /** All stages that are not alerted, and are not new are skippable, right? */
  // is_stage_skippable: (state, getters) => (stage) => {
  //   console.assert(stage)
  //   return (!getters.is_stage_alerted(stage) && !getters.is_stage_new(stage))
  // },

  is_stage_completed: (state) => (stage) => {
    console.assert(stage)
    return (stage.progression?.completed === true)
  },

  is_stage_accessible: (state, getters) => (stage) => {
    console.assert(stage)
    const accessible_stage_ids = getters.assembly_accessible_stage_ids
    return accessible_stage_ids.includes(stage.stage.id)
  },

  is_stage_done: (state, getters) => (stage) => {
    console.log(stage)
    console.assert(stage)
    return getters.is_stage_accessible(stage) ||
      getters.is_stage_completed(stage)
  },

  // TODO rename: is_first_day_of_stage (..._of_assembly)
  is_first_day: (state, getters) => (stage) => {
    // console.log(stage.progression.date_created)
    return date.isSameDate(stage.progression.date_created, Date.now(), 'day')
  }
}

const actions = {

  syncAssembly: ({ state, dispatch, getters, rootState, rootGetters }, { oauthUserID, assemblyIdentifier }) => {
    console.log(` sync assembly ${assemblyIdentifier}`)
    if (!state.assemblydata[assemblyIdentifier]) {
      // no cached version exists: load the data from resource server...
      dispatch('retrieveAssembly', { assemblyIdentifier: assemblyIdentifier })
      // console.log(' not yet fetched...')
      return (null)
    }

    // wrong user? and renew cache all x- minutes!
    const wrongUser = oauthUserID != state.assemblydata[assemblyIdentifier].access_sub
    const expired = !(state.assemblydata[assemblyIdentifier]) || api.expiredCacheDate(state.assemblydata[assemblyIdentifier].access_date)
    // console.log()
    if (expired || wrongUser) {
      console.log(' Assembly not in sync  or wrong user...', expired, state.assemblydata[assemblyIdentifier].access_date)
      dispatch('retrieveAssembly', { assemblyIdentifier: assemblyIdentifier })
      return null
    }

    // console.log("AssemblyLoaded: Assembly retrieved from localStorage")
    LayoutEventBus.$emit('AssemblyLoaded')
    return (null)
  },

  deleteAssemblyStore({ commit }) {
    commit('deleteAssemblyStore');
  },

  retrieveAssembly({ commit }, { assemblyIdentifier }) {
    if (!assemblyIdentifier) {
      return null
    }

    // console.log('Retrieve assembly from resource server')
    api.retrieveAssembly(assemblyIdentifier)
      .then(
        response => {
          const data = response.data
          console.assert(data)
          commit('storeAssembly', { assemblyIdentifier, data })
          console.log("EVENT: AssemblyLoaded: Assembly retrieved from Resource Server")
          LayoutEventBus.$emit('AssemblyLoaded')
        }
      )
      .catch(error => {
        console.warn(error)
        // Error Handling is done in Axios Interceptor
        console.warn('Request Error')
      })
  },


  addOrUpdateStage({ commit }, { stage }) {
    const assemblyIdentifier = runtimeStore.assemblyIdentifier
    console.log("stage: ", stage, assemblyIdentifier)
    api.addOrUpdateStage(assemblyIdentifier, stage)
      .then(
        response => {

          console.log(response.data)
          const data = response.data

          // Store result
          console.assert(!!data.assembly)
          console.assert(!!data.stages)


          // UPDATE ASSEMBLY DATA and STAGE DATA
          // storeAssembly(state, { assemblyIdentifier, data }) {
          // commit('storeAssembly', { assemblyIdentifier, data })
          commit('storeAssemblyStage', { assemblyIdentifier, data })

          // ADD Stage Relations
          // if (stage.id) {
          // if (data.stages) {
          //   Object.values(data.stages).forEach((stage) => {
          //     console.assert(stage)
          //     console.log(stage)
          //     commit('updateStageContent', { stage })
          //   });
          // }
        }
      )
      .catch(error => {
        console.warn(error)
        // Error Handling is done in Axios Interceptor
        console.warn('Request Error')
      })
  },

  updateAssembly({ commit }, { assembly }) {
    const assemblyIdentifier = runtimeStore.assemblyIdentifier
    console.log("assembly: ", assembly)
    api.updateAssembly(assembly.identifier, assembly)
      .then(
        response => {

          console.log(response.data)
          const data = response.data

          // Store result
          console.assert(!!data.assembly)
          commit('storeAssemblyObject', { assemblyIdentifier, assembly: data.assembly })
        }
      )
      .catch(error => {
        console.warn(error)
        // Error Handling is done in Axios Interceptor
        console.warn('Request Error')
      })
  },

  addMilestone({ getters, commit }, { label, weight, key }) {
    console.assert(weight)
    console.assert(label)
    if (!key) { key = "default" }
    console.log("ADD MILESTONE", label, " WEIGHT:", weight, " KEY:", key)

    const day = getters.assemblyProgression?.number_of_day_sessions;
    const stageID = runtimeStore.stageID
    console.assert(stageID)

    const milestones = getters.stageMilestones
    console.assert(milestones !== null)
    if (milestones) {
      const already = milestones.find(milestone => milestone.label === label && milestone.key === key)
      if (already) {
        // milestone has been already archieved before    
        return false;
      }
    }

    // INSERT NEW MILESTONE
    commit('addMilestone', { label, weight, key, day, stageID })
    // abel, weight, day, stage
    return true;
  },

  incrementAssemblyActivityCounter({ commit }, { counterName }) {
    console.assert(['number_of_proposals_today', 'number_of_comments_today'].includes(counterName))
    commit('incrementAssemblyActivityCounter', {
      assemblyIdentifier: runtimeStore.assemblyIdentifier,
      counterName
    })
  },

  updateFocusedContent({ commit }, { stageID, contentID }) {
    console.assert(stageID)
    console.assert(contentID)
    commit('updateFocusedContent', { stageID, contentID })
  },

  storeStageProgressionAlertFlag({ commit }, { stageID, alerted }) {
    console.assert(stageID)
    commit('storeStageProgressionAlertFlag', { stageID, alerted })
  },


  storeStageProgressionCompleted({ commit }, { stageID, completed }) {
    console.assert(stageID)
    commit('storeStageProgressionCompleted', { stageID, completed })
  },
}

const mutations = {

  /**
   * Store full assembly Response (with configuration and stuff)
   */
  storeAssembly(state, { assemblyIdentifier, data }) {
    // console.log(`Store assembly ${assemblyIdentifier}`)

    // data.stages.forEach(stage)
    const stages = state.stages
    Vue.set(state, 'stages', Object.assign({}, stages, data.stages))

    // Vue.set  makes the change reactive!!
    // console.log(data.stages, "TESTTEST")
    data.stages = Object.keys(data.stages)
    // .map(stage => stage.stage.id)
    // console.log(data.stages, "TESTTEST")
    Vue.set(state.assemblydata, assemblyIdentifier, data)
  },

  storeAssemblyStage(state, { assemblyIdentifier, data }) {

    // data.stages.forEach(stage)
    // const stages = state.stages
    Vue.set(state, 'stages', data.stages)

    // Vue.set  makes the change reactive!!
    // console.log(data.stages, "TESTTEST")
    const deepCopy = JSON.parse(JSON.stringify(data.stages))
    const stageKeys = Object.keys(deepCopy)
    Vue.set(state.assemblydata[assemblyIdentifier], 'stages', stageKeys)
  },


  storeAssemblyObject(state, { assemblyIdentifier, assembly }) {
    // console.log(`Store assembly ${assemblyIdentifier} object`)
    if (!state.assemblydata[assemblyIdentifier]) {
      // happens when logout
      return null
    }
    Vue.set(state.assemblydata[assemblyIdentifier], 'assembly', assembly)
  },
  storeAssemblyProgression(state, { assemblyIdentifier, progression }) {
    // console.log(`Store assembly ${assemblyIdentifier} progressions`)
    if (!state.assemblydata[assemblyIdentifier]) {
      // happens when logout
      return null
    }
    Vue.set(state.assemblydata[assemblyIdentifier], 'progression', progression)
  },
  storeStageObject(state, { stageID, stage }) {
    // console.log(`Store stage ${stageID} object`)
    if (!state.stages[stageID]) {
      // happens when logout
      return null
    }
    Vue.set(state.stages[stageID], 'stage', stage)
  },
  storeStageProgression(state, { stageID, progression }) {
    // console.log(`Store stage ${stageID} progression`, progression)
    if (!state.stages[stageID]) {
      // happens when logout
      return null
    }
    Vue.set(state.stages[stageID], 'progression', progression)
  },

  storeStageProgressionAlertFlag(state, { stageID, alerted }) {

    console.log("STORE ALERTED FLAG")

    if (!state.stages[stageID]?.progression) {
      const progression = {
        alerted: alerted
      }
      Vue.set(state.stages[stageID], 'progression', progression)
    } else {
      Vue.set(state.stages[stageID].progression, 'alerted', alerted)

    }

    // const progression = state.stages[stageID].progression
    // if (!progression) {
    //   // wait on  feedback of server
    //   // progression = {}  // seems to be readonly...
    //   return;
    // }

    // progression.alerted = alerted
    // Vue.set(state.stages[stageID], 'progression', progression)
    // Vue.set(state.stages[stageID].progression, 'alerted', alerted)
  },

  storeStageProgressionCompleted(state, { stageID, completed }) {

    console.log("STORE COMPLETED FLAG")

    if (!state.stages[stageID]?.progression) {

      const progression = {
        alerted: false,
        completed: completed
      }
      Vue.set(state.stages[stageID], 'progression', progression)

    } else {

      if (state.stages[stageID].progression.alerted && completed) {
        Vue.set(state.stages[stageID].progression, 'alerted', false)
      }
      Vue.set(state.stages[stageID].progression, 'completed', completed)

    }
  },


  incrementAssemblyActivityCounter(state, { assemblyIdentifier, counterName }) {
    // console.log(`Store assembly ${assemblyIdentifier} progressions`)
    if (!state.assemblydata[assemblyIdentifier]) {
      // happens when logout
      return null
    }
    const progression = state.assemblydata[assemblyIdentifier]?.progression
    console.assert(progression)
    let counter = 0
    if (progression[counterName] !== null) {
      counter = progression[counterName]
    }
    Vue.set(state.assemblydata[assemblyIdentifier].progression, counterName, counter + 1)
  },

  updateFocusedContent(state, { stageID, contentID }) {
    // console.log("FOCUSEDCONTENT HAS BEEN WRITTEN (not yet)")
    if (!state.stages[stageID]) {
      // seem to happen sometimes => for instance when logout and data is cleared???
      return null
    }

    if (!state.stages[stageID].progression) {
      const progression = {
        focused_content_id: contentID,
        alerted: true
      }
      Vue.set(state.stages[stageID], 'progression', progression)
    } else {
      // const progression = state.stages[stageID].progression
      // progression.focused_content_id = contentID
      // console.log("FOCUSEDCONTENT HAS BEEN WRITTEN")
      Vue.set(state.stages[stageID].progression, 'focused_content_id', contentID)
    }
  },



  deleteAssemblyStore(state) {
    Vue.set(state, 'assemblydata', {})
    Vue.set(state, 'stages', {})
    Vue.set(state, 'milestones', {})
  },

  addMilestone(state, { label, weight, key, day, stageID }) {
    console.assert(label);
    console.assert(weight);
    console.assert(day);
    console.assert(stageID);

    if (!(day in state.milestones)) {
      Vue.set(state.milestones, day, {})
    }

    console.assert(state.milestones[day] !== null)
    if (!(stageID in state.milestones[day])) {
      Vue.set(state.milestones[day], stageID, [])
    }

    const newMilestone = { label, weight, key }
    const currentLength = state.milestones[day][stageID].length
    Vue.set(state.milestones[day][stageID], currentLength, newMilestone)
  }
}

export const assemblystore = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
