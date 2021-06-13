/* ContentTree are stored in LocalStorage. */

import Vue from 'vue'
import api from 'src/utils/api'
import { date } from 'quasar'
import { runtimeStore } from "src/store/runtime.store"

var state = {
  peerreviews: {},
}

const getters = {


  // TODO: not used, right?
  all_peerreviews: (state) => {
    if (!Object.keys(state.peerreviews).length) {
      return (null)
    }
    const peerreviews = []
    Object.keys(state.peerreviews).forEach(contenttreeID => {
      const entries = state.peerreviews[contenttreeID].entries
      if (entries) {
        Object.values(entries).forEach(peerreview => {
          peerreviews.push(peerreview)
        })
      }
    })

    return (peerreviews)
  },

  loadedPeerreviewContententtrees: (state) => {
    return Object.keys(state.peerreviews)
  },

  load_all_peerreviews_by_content_id: (state) => {
    if (!Object.keys(state.peerreviews).length) {
      return (null)
    }
    const peerreviews = {}
    Object.keys(state.peerreviews).forEach(contenttreeID => {
      const entries = state.peerreviews[contenttreeID].entries
      if (entries) {
        Object.values(entries).forEach(peerreview => {
          if (!peerreview.disabled) {
            const content_id = peerreview.content.id
            if (!peerreviews[content_id]) {
              peerreviews[content_id] = []
            }
            peerreviews[content_id].push(peerreview)
          }
        })
      }
    })

    return (peerreviews)
  },


  // Open peerreviews assigned for the user...
  // Only one per content is allowed!
  get_uncompleted_user_peerreviews: (state) => {
    if (!Object.keys(state.peerreviews).length) {
      return (null)
    }
    const peerreviews = []
    Object.keys(state.peerreviews).forEach(contenttreeID => {
      const entries = state.peerreviews[contenttreeID].entries
      if (entries) {
        Object.values(entries).forEach(peerreview => {

          // NOT ASSIGNED OR disabled
          if (!peerreview.progression || peerreview.disabled) {
            return;
          }
          // Only those peerreviews that are still open
          // Priority for those peerreviews are not responded...
          if (!peerreview.peerreview.approved && peerreview.progression.response == null && !peerreview.peerreview.rejected) {
            peerreviews.push(peerreview)
          }
        })
      }
    })

    return (peerreviews)
  },

  // Open peerreviews assigned for the user...
  // Only one per content is allowed!
  get_user_peerreviews_by_content_id: (state) => {
    if (!Object.keys(state.peerreviews).length) {
      return (null)
    }
    const peerreviews = {}
    Object.keys(state.peerreviews).forEach(contenttreeID => {
      const entries = state.peerreviews[contenttreeID].entries
      if (entries) {
        Object.values(entries).forEach(peerreview => {
          // NOT ASSIGNED OR disabled
          if (!peerreview.progression || peerreview.disabled) {
            return;
          }

          // STILL OPEN / OR closed today!
          const openResponse = peerreview.progression && (!peerreview.progression.date_responded || date.isSameDate(new Date(), peerreview.progression.date_responded, 'day'))
          const notRejected = !peerreview.peerreview.rejected || date.isSameDate(new Date(), peerreview.peerreview.date_rejected, 'day')
          const notApproved = !peerreview.peerreview.approved || date.isSameDate(new Date(), peerreview.peerreview.date_approved, 'day')

          // Only those peerreviews that are still open
          // Priority for those peerreviews are not responded...
          // console.log(peerreview.peerreview.id, peerreview, notApproved, notRejected, openResponse, "VISIBLE?")
          if (openResponse && notRejected && notApproved) {
            const content_id = peerreview.content.id
            if (!peerreviews[content_id]) {
              peerreviews[content_id] = []
            }
            console.log("YYES")
            peerreviews[content_id].push(peerreview)
          }
        })
      }
    })

    return (peerreviews)
  },

  // All peerreviews assigned for the user...
  get_user_peerreviews_by_parent_and_content: (state, getters) => {
    if (getters.get_user_peerreviews_by_content_id === null) {
      return (null)
    }

    const peerreviews = {}
    for (const [contentID, contentPeerreviews] of Object.entries(getters.get_user_peerreviews_by_content_id)) {
      const first = contentPeerreviews[Object.keys(contentPeerreviews)[0]]
      const parentID = first.content.parent_id
      if (!peerreviews[parentID]) {
        peerreviews[parentID] = {}
      }
      peerreviews[parentID][contentID] = contentPeerreviews
    }

    return (peerreviews)
  },


  get_peerreview_by_content: (state, getters) => ({ contentID }) => {
    console.assert(contentID)
    console.log("load peerreview of contentID", contentID)
    const peerreviews_by_content = getters.load_all_peerreviews_by_content_id;
    console.assert(peerreviews_by_content != null)
    if (contentID in peerreviews_by_content) {
      return peerreviews_by_content[contentID]
    }
    return []
  },

  get_peerreview: (state) => ({ contenttreeID, peerreviewID }) => {
    console.log("load one specific peerreview")
    if (!state.peerreviews[contenttreeID]) {
      return;
    }
    return state.peerreviews[contenttreeID].entries[peerreviewID]
  }
}

const actions = {

  /* Retrieve new version of the previews
  If timelag is set to true, the method will wait a few seconds to give priority the other 
  API-Requests.
  */
  retrievePeerreviews({ commit }, { assemblyIdentifier, contenttreeID, timelag }) {

    // console.log("with timelage", timelag)
    const timeout = timelag ? 5 * 1000 : 0
    setTimeout(() => {

      console.assert(contenttreeID)
      api.retrievePeerreviews(assemblyIdentifier, contenttreeID)
        .then(
          response => {
            // update
            // console.log('save full contenttree to cache.')
            console.assert(response.data)
            console.assert('OK' in response.data)
            console.assert('peerreviews' in response.data)

            commit('add_or_update_peerreviews', {
              contenttreeID: contenttreeID,
              peerreviews: response.data.peerreviews
            });
          }
        )
        .catch((error) => {
          console.warn("Request Error", error)
        });
    }, timeout)
  },

  update_response({ commit }, { contenttreeID, peerreviewID, response, accept1, accept2, accept3 }) {
    commit('update_response', { contenttreeID, peerreviewID, response, accept1, accept2, accept3 })
  },


  /* Retrieve modifed content of the contenttree <assemblyIdentifier>.<contenttreeID>
  */
  updatePeerreviews({ commit }, { assemblyIdentifier, contenttreeID, update_date, timelag }) {

    console.log("UPDATE CONTENTTREE; now! with timelage", timelag)
    commit('set_update_date_to_current', { contenttreeID });

    const timeout = timelag ? 1000 : 0
    setTimeout(() => {

      // console.log('Retrieve contenttree from resource server' + contenttreeID)
      console.assert(contenttreeID)
      api.updatePeerreviews(assemblyIdentifier, contenttreeID, update_date, timelag)
        .then(
          response => {

            console.log("RESPONSE OF CONTENTTREE UPDATE IS HERE....", response.data)
            console.assert(response.data)
            console.assert('OK' in response.data)
            let modifiedReviews = response.data.contents
            if (modifiedReviews && Object.values(modifiedReviews).length) {
              console.log("STORE MODIFIED CONTENT TO DISK", modifiedReviews)
              commit('update_reviews', {
                peerreviewTuple: modifiedReviews
              });
            }
          }
        )
        .catch((error) => {
          console.warn("Request Error", error)
        });
    })
  },


  updatePeerreviewTuples({ commit, getters, dispatch }, { modifiedPeerreviews }) {
    // in case content or progression changes (without changing hirarchy...)
    console.log("RETRIEVED MODIFIED CONTENTS (2)", modifiedPeerreviews)
    console.assert(modifiedPeerreviews !== undefined)
    console.assert(modifiedPeerreviews !== null)
    for (let peerreviewTuple of Object.values(modifiedPeerreviews)) {
      console.assert(peerreviewTuple !== undefined)
      console.assert(peerreviewTuple !== null)
      dispatch('updatePeerreviewTuple', { peerreviewTuple })
    }
  },

  updatePeerreviewTuple({ commit }, { peerreviewTuple }) {
    console.log(peerreviewTuple)
    commit('update_reviews', {
      peerreviewTuple
    });
  },



  deletePeerreviewStore({ commit }) {
    commit('deletePeerreviewStore');
  },

  syncPeerreviews: ({ state, dispatch }, { assemblyIdentifier, contenttreeID, oauthUserID }) => {

    if (runtimeStore.logoutState) {
      // DO not sync after logout.
      return (null);
    }

    // wrong user? and renew cache all x- minutes!
    const wrongUser = state.peerreviews[contenttreeID] && oauthUserID != state.peerreviews[contenttreeID]?.access_sub
    if (wrongUser) {
      Vue.set(state, 'peerreviews', {})
    }

    const emptyPeerreviews = !(state.peerreviews[contenttreeID])
    const expired = !emptyPeerreviews && api.expiredCacheDate(state.peerreviews[contenttreeID]?.access_date)
    if (!expired && !emptyPeerreviews && !wrongUser) {
      // console.log("CONTENTREE CACHE IS STILL VALID! DO WE NEED TO CHECK FOR NEW CONTENT? ")
      dispatch('checkToUpdatePeerreviews', { assemblyIdentifier, contenttreeID })
      return (true)
    }

    // too old or missing cache: load the data from resource server...
    console.log('Cache expired: reload peerreviews', expired, wrongUser, emptyPeerreviews)
    dispatch('retrievePeerreviews', {
      assemblyIdentifier: assemblyIdentifier,
      contenttreeID: contenttreeID,
      timelag: true
    })
  },

  checkToUpdatePeerreviews: ({ state, dispatch }, { assemblyIdentifier, contenttreeID }) => {

    // Check for new content / Modified content, from time to time...
    const update_date = state.peerreviews[contenttreeID]?.update_date;
    console.assert(update_date)
    const expiredUpdateTime = api.expiredUpdateDate(update_date)
    if (!expiredUpdateTime) {
      return (true)
    }

    // too old or missing cache: load the data from resource server...
    console.log('Its update time: check for modified / new contents')
    dispatch('updatePeerreviews', {
      assemblyIdentifier: assemblyIdentifier,
      contenttreeID: contenttreeID,
      update_date: update_date,
      timelag: true
    })
  },
}


const mutations = {

  add_or_update_peerreviews(state, { contenttreeID, peerreviews }) {

    console.assert(contenttreeID)
    console.log("add_or_update_peerreviews", contenttreeID, peerreviews)
    // console.log('new copy saved...')
    Vue.set(state.peerreviews, contenttreeID, peerreviews)
  },


  update_reviews(state, { peerreviewTuple }) {
    // in case content or progression changes (without changing hirarchy...)
    // console.log(peerreviewTuple, "lllllllllllllll")
    console.assert(peerreviewTuple !== undefined)
    console.assert(peerreviewTuple !== null)
    // console.log("UPDATE PEERREVIEW TUPLE...")
    let contenttreeID = peerreviewTuple.peerreview.contenttree_id
    let peerreviewID = peerreviewTuple.peerreview.id

    // NEW ENTRIES
    if (!(peerreviewID in state.peerreviews[contenttreeID].entries)) {
      console.assert(peerreviewTuple.peerreview);
      console.assert(peerreviewTuple.creator);
      Vue.set(state.peerreviews[contenttreeID].entries, peerreviewID, {})
    }

    if (peerreviewTuple.peerreview) {
      Vue.set(state.peerreviews[contenttreeID].entries[peerreviewID], 'peerreview', peerreviewTuple.peerreview)
    }
    if (peerreviewTuple.progression) {
      Vue.set(state.peerreviews[contenttreeID].entries[peerreviewID], 'progression', peerreviewTuple.progression)
    }
    if (peerreviewTuple.content) {
      Vue.set(state.peerreviews[contenttreeID].entries[peerreviewID], 'content', peerreviewTuple.content)
    }
    if (peerreviewTuple.creator) {
      Vue.set(state.peerreviews[contenttreeID].entries[peerreviewID], 'creator', peerreviewTuple.creator)
    }
  },

  set_update_date_to_current(state, { contenttreeID }) {
    const now = new Date()
    Vue.set(state.peerreviews[contenttreeID], 'update_date', now)
  },

  update_response(state, { contenttreeID, peerreviewID, response, accept1, accept2, accept3 }) {
    // in case content or progression changes (without changing hierarchy...)
    if (response === null || response === undefined) {
      return (null)
    }
    console.log("UPDATE VUEX PREEVIEW")

    let progression = state.peerreviews[contenttreeID]?.entries[peerreviewID]?.progression
    if (progression) {
      Vue.set(state.peerreviews[contenttreeID].entries[peerreviewID].progression, 'response', response)
      Vue.set(state.peerreviews[contenttreeID].entries[peerreviewID].progression, 'criteria_accept1', accept1)
      Vue.set(state.peerreviews[contenttreeID].entries[peerreviewID].progression, 'criteria_accept2', accept2)
      Vue.set(state.peerreviews[contenttreeID].entries[peerreviewID].progression, 'criteria_accept3', accept3)
    } else {
      progression = {
        response,
        criteria_accept1: accept1,
        criteria_accept2: accept2,
        criteria_accept3: accept3
      }
      Vue.set(state.peerreviews[contenttreeID].entries[peerreviewID], 'progression', progression)
    }
  },

  deletePeerreviewStore(state) {
    console.log("delete peerreview store im mutations.")
    Vue.set(state, 'peerreviews', {})
  }
}

export const peerreviewstore = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
