/* Public Index: the publically accessible list of all potential accessible assemblies:
- assemblies that are currently ongoing (require invitation)
- assemblies that have been published (accessible by the public)
*/
import Vue from 'vue'
import api from 'src/utils/api'
import { LayoutEventBus } from 'src/utils/eventbus.js'
import { Router } from 'src/router'
import { colors } from "quasar";
const { changeAlpha } = colors


var state = {
  randomSeed: null,
  publicProfile: {},
  notifications: {},
  oauthAcls: [],
  AMCache: {}
}

const getters = {

  randomLocalStorageSeed: (state) => {
    return (state.randomSeed)
  },

  is_in_testing_phase: (state) => {
    if (!state.publicProfile) {
      return (null)
    }
    return (state.publicProfile?.configuration?.t)
  },

  get_public_profile: (state) => {
    if (!state.publicProfile) {
      return (null)
    }
    return (state.publicProfile.user)
  },

  lightProfileColor: (state, getters) => {
    const profile = state.publicProfile?.user;
    if (!profile) {
      return "#CCCCCC"
    }
    return changeAlpha(profile.CO, 0.2);
  },

  profileColor: (state, getters) => {
    const profile = state.publicProfile?.user;
    if (!profile) {
      return "#AAAAAA"
    }
    return profile.CO;
  },

  oauthAcls: function (state) {
    console.log('get acls transmitted via JWT token')
    return (state.oauthAcls)
  },

  translateOauthAcls: (state, getters) => (assemblyIdentifier) => {

    const roles = getters.oauthAcls
    if (!roles) {
      return []
    }

    var assembly_roles = roles.filter(function (el) {
      return el.endsWith(`@${assemblyIdentifier}`);
    })

    var assembly_roles = assembly_roles.map(function (el) {
      return el.split('@')[0]
    })

    const assemblyAcls = []
    if (assembly_roles.includes('administrator')) {
      assemblyAcls.push('administrate', 'manage', 'observe')
    }
    if (assembly_roles.includes('manager')) {
      assemblyAcls.push('manage', 'observe')
    }

    if (assembly_roles.includes('delegate')) {
      assemblyAcls.push('delegate', 'modify', 'add', 'observe')
    }

    if (assembly_roles.includes('contributor')) {
      assemblyAcls.push('contribute', 'observe')
    }

    if (assembly_roles.includes('expert')) {
      assemblyAcls.push('expert', 'observe')
    }

    // TODO: Are visitors welcome within this assembly???
    if (Vue.prototype.pkce.isAuthorized()) {
      assemblyAcls.push('observe')
    }

    return (assemblyAcls)
  },

  // (stage) =>
  getAMCache: (state) => (cacheKey) => {
    return state.AMCache[cacheKey];
  },

  notifications: (state, getters) => {
    return state.notifications.entries;
  },

}

const actions = {

  touchRandomSeed({ commit }) {
    commit('set_random_seed')
  },

  setAMCache({ commit }, { cacheKey, itemId }) {
    commit('setAMCache', { cacheKey, itemId })
  },

  syncProfile: ({ state, dispatch, localgetters, rootState, rootGetters }, { oauthUserID, oauthUserEmail }) => {
    // return: necessity to fetch new version? true/false

    if (!oauthUserID) {
      // Not logged in. DELETE ALL
      dispatch('deletePublicProfile')
      return (null)
    }

    if (!state.publicProfile) {
      dispatch('retrievePublicProfile', { oauthUserID, oauthUserEmail })
      return (true)
    }

    // wrong user? and renew cache all x- minutes!
    const wrongUser = oauthUserID != state.publicProfile.access_sub
    if (wrongUser) {
      dispatch('deletePublicProfile')
    }

    const expired = api.expiredCacheDate(state.publicProfile?.access_date)
    if (expired || wrongUser) {
      console.log(' Public Profile not in sync  or wrong user...')
      dispatch('retrievePublicProfile', { oauthUserID, oauthUserEmail })
      return (true)
    }

    return (null)
  },

  checkToUpdateNotifications: ({ state, dispatch }) => {

    // Check for new content / Modified content, from time to time...
    const update_date = state.notifications.update_date;
    const expiredUpdateTime = update_date ? api.expiredUpdateDate(update_date) : true
    if (!expiredUpdateTime) {
      return (true)
    }

    // too old or missing cache: load the data from resource server...
    console.log('Its update time: check for modified / new contents')
    dispatch('updateNotifications', {
      update_date: update_date,
      timelag: true
    })
  },


  /* Retrieve modifed / new notificaionts */
  updateNotifications({ commit }, { update_date, timelag }) {

    console.log("UPDATE NOTIFICATIONS; now! with timelage", update_date, timelag)
    commit('set_notification_update_date_to_current');

    const timeout = timelag ? 5000 : 1
    setTimeout(() => {
      api.updateNotifications(update_date)
        .then(
          response => {
            console.log("RESPONSE OF Notification Updates are HERE....", response.data)
            console.assert(response.data)
            console.assert('OK' in response.data)
            let notifications = response.data.notifications
            commit('update_notifications', { notifications });
          }
        )
        .catch((error) => {
          console.warn("Request Error", error)
        });
    }, timeout)
  },

  update_notifications({ commit }, { notifications }) {
    commit('update_notifications', { notifications });
  },

  gotoProfile: ({ state, dispatch, localgetters, rootState, rootGetters }) => {
    // console.log(` goto public profile`)

    // CHECK Profile requierments
    const destination_route = Router.currentRouteObject();
    console.log(destination_route)

    if (destination_route.name == "profile") {
      LayoutEventBus.$emit("reload");
    } else {
      Router.push({
        name: "profile",
        params: { destination_route: destination_route },
      });
    }
  },

  deleteNotification({ commit }, { notificationID }) {
    console.log("deleteNotification1/2", notificationID)
    commit('deleteNotification', { notificationID })
  },

  deletePublicProfile({ commit }) {
    commit('storePublicProfile', {})
    commit('storeNotifications', {})
    commit('deleteAMCache')
  },

  retrievePublicProfile({ commit, dispatch }, { oauthUserID, oauthUserEmail }) {

    // console.log('Retrieve public profile from resource server', oauthUserEmail)
    api.publicProfile()
      .then(
        response => {

          // console.log('save retrieved profile to cache.')
          const data = response.data
          commit('storePublicProfile', { data })

          dispatch('checkToUpdateNotifications')
          return (null)
        }
      )
      .catch((error) => {
        console.warn(error)
        // Error Handling is done in Axios Interceptor
        console.warn('Request Error')
      })
  },

  // limitNotifications: ({ commit }, { firstEntryID }) => {
  //   commit('limitNotifications', { firstEntryID })
  // },

  storeOauthAcls: ({ commit }, { oauthAcls }) => {
    commit('storeOauthAcls', oauthAcls)
  },
}

const mutations = {

  storePublicProfile(state, { data }) {
    Vue.set(state, 'publicProfile', data)
  },

  storeOauthAcls(state, oauthAcls) {
    Vue.set(state, 'oauthAcls', oauthAcls)
  },

  set_random_seed(state) {
    // console.log('SET RANDOM SEED IF NOT YET DONE')
    if (!state.randomSeed) {
      // TODO: ???? Math.floor(99)
      let randomSeed = Math.floor(Math.random() * Math.floor(99)) + 1
      state.randomSeed = randomSeed
    }
  },

  /* Cache a currently selected AM intervention. */
  setAMCache(state, { cacheKey, itemId }) {
    state.AMCache[cacheKey] = itemId;
  },
  deleteAMCache(state) {
    state.AMCache = {};
  },

  storeNotifications(state, { data }) {
    Vue.set(state, 'notifications', {})
  },

  deleteNotification(state, { notificationID }) {
    console.log("deleteNotification 2/2", notificationID)
    Vue.delete(state.notifications.entries, notificationID)
  },

  set_notification_update_date_to_current(state) {
    const now = new Date()
    Vue.set(state.notifications, 'update_date', now)
  },

  update_notifications(state, { notifications }) {
    console.log("ENTRIES...")
    // NEW ENTRIES
    if (!('entries' in state.notifications)) {
      Vue.set(state.notifications, 'entries', {})
    }
    console.log("ENTRIES...II")

    Object.values(notifications).forEach(notification => {

      let notificationsID = notification.id
      if (!(notificationsID in state.notifications.entries)) {
        Vue.set(state.notifications.entries, notificationsID, {})
      }

      Vue.set(state.notifications.entries, notificationsID, notification)
    })
  },


  // limitNotifications: (state, { firstEntryID }) => {
  //   if (!state.notifications.entries) {
  //     return;
  //   }
  //   Object.keys(state.notifications.entries).forEach((notificationID) => {
  //     if (parseInt(notificationID) <= parseInt(firstEntryID)) {
  //       Vue.delete(state.notifications.entries, notificationID)
  //     }
  //   })
  // },

}

export const publicprofilestore = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
