/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* Public Index: the publically accessible list of all potential accessible assemblies:
- assemblies that are currently ongoing (require invitation)
- assemblies that have been published (accessible by the public)
*/
// import Vue from 'vue'
import api from 'src/utils/api'
// import { LayoutEventBus } from 'src/utils/eventbus.js'

var state = {
  publicIndex: null
}

const getters = {

  ongoing_assemblies: (state) => {
    const publicIndex = state.publicIndex
    if (publicIndex === null) {
      return (null)
    }

    const filtered_assemblies = Object.filter(state.publicIndex.assemblies, x => x.is_active)
    return (Object.values(filtered_assemblies))
  },

  published_assemblies: (state) => {
    if (state.publicIndex === null || state.publicIndex === undefined) {
      return (null)
    }

    const filtered_assemblies = Object.filter(state.publicIndex.assemblies, x => x.is_public)
    return (Object.values(filtered_assemblies))
  },


  UsersManagerAssemblies: (state, _getters, _rootState, rootGetters) => {


    // Check if there is at least one ongoing assembly.
    if (state.publicIndex.assemblies.length === 0) {
      return (false)
    }

    // Check permissions:
    const compare_func = rootGetters['publicprofilestore/translateOauthAcls']
    let accessibleAssemblies = Object.filter(state.publicIndex.assemblies, x => {
      const acls = compare_func(x.identifier)
      return acls.includes('manage');
    });
    return (Object.values(accessibleAssemblies))
  },

  
  UsersObserverAssemblies: (_state, getters, _rootState, rootGetters) => {

    // data not yet loaded
    if (getters.ongoing_assemblies === null) {
      return (null)
    }

    // Check if there is at least one ongoing assembly.
    if (getters.ongoing_assemblies.length === 0) {
      return (false)
    }

    // Check permissions:
    const compare_func = rootGetters['publicprofilestore/translateOauthAcls']
    let accessibleAssemblies = Object.filter(getters.ongoing_assemblies, x => {
      const acls = compare_func(x.identifier)
      return acls.includes('observe');
    });
    return (Object.values(accessibleAssemblies))
  },

  UsersDelegateAssemblies: (_state, getters, _rootState, rootGetters) => {

    // data not yet loaded
    if (getters.ongoing_assemblies === null) {
      return (null)
    }

    // Check if there is at least one ongoing assembly.
    if (getters.ongoing_assemblies.length === 0) {
      return (false)
    }

    // Check permissions:
    const compare_func = rootGetters['publicprofilestore/translateOauthAcls']
    let accessibleAssemblies = Object.filter(getters.ongoing_assemblies, x => {
      const acls = compare_func(x.identifier)
      return acls.includes('delegate');
    });
    return (Object.values(accessibleAssemblies))
  },

  IsUserDelegateOfOngoingAssembly: (_state, getters) => {
    // console.log("IsUserDelegateOfOngoingAssembly", getters.UsersDelegateAssemblies)
    const assemblies = getters.UsersDelegateAssemblies
    return (assemblies && Object.values(assemblies).length > 0)
  },

  IsUserObserverOfOngoingAssembly: (_state, getters) => {
    // console.log("IsUserObserverOfOngoingAssembly", getters.UsersDelegateAssemblies)
    const assemblies = getters.UsersObserverAssemblies
    return (assemblies && Object.values(assemblies).length > 0)
  },

  /* SHORTCUTS: mainly for artificial moderators */
  IsThereAnAssemblyInPublicState: (state) => {
    if (state.published_assemblies == null) {
      return (null)
    }
    return (state.published_assemblies.length > 0)
  },

  IsThereAnAssemblyOngoing: (_state, getters) => {
    if (getters.ongoing_assemblies === null) {
      return (null)
    }
    return (getters.ongoing_assemblies.length > 0)
  },

  IsThereNothingGoingOn: (_state, getters) => {
    if (getters.IsThereAnAssemblyInPublicState === false || getters.IsThereAnAssemblyInPublicState === false) {
      return (null)
    }

    return (!getters.IsThereAnAssemblyOngoing && !getters.IsThereAnAssemblyInPublicState)
  },

  isUserAssemblyManager: (_state, _getters, _rootState, rootGetters) => (assemblyIdentifier) => {

    // Check permissions:
    const aclFunc = rootGetters['publicprofilestore/translateOauthAcls']
    const acls = aclFunc(assemblyIdentifier)
    return acls.includes('manage')
  },

}

const actions = {

  syncPublicIndex: ({ state, dispatch }) => {
    // console.log("...is public index in sync?")
    if (state.publicIndex === null || state.publicIndex === undefined) {
      // no cached version exists: load the data from resource server...
      console.log('...public Index cache is empty')
      dispatch('retrievePublicIndex')
      return (null)
    }

    // renew cache all x- minutes
    const expired = api.expiredCacheDate(state.publicIndex.access_date)
    if (expired) {
      // too old cache: load the data from resource server...
      console.log('public Index cache is outdated')
      dispatch('retrievePublicIndex')
    }

    return (null)
  },


  retrievePublicIndex({ commit }) {
    console.log('Retrieve publicIndex from resource server')
    api.retrievePublicIndex()
      .then(
        response => {

          // save data
          // console.log('save PublicIndex to cache.', response)
          console.assert(response.data !== null && response.data !== undefined)
          commit('storePublicIndex', response.data)
        }
      )
      .catch((error) => {
        console.log(error)
        console.warn('Request Error')

      })
  }
}

const mutations = {

  storePublicIndex(state, publicIndex) {
    // Vue.set  makes the change reactive!!
    Vue.set(state, 'publicIndex', publicIndex)
  }
}

export const publicindexstore = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
