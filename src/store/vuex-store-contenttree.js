/* ContentTree are stored in LocalStorage. */

import Vue from 'vue'
import { LayoutEventBus } from 'src/utils/eventbus.js'
import api from 'src/utils/api'
import content from 'src/mixins/standalone.content'
// import { date } from 'quasar'


var state = {
  contenttree: {},
  expanded_branches: {}
}

const getters = {

  get_contenttree: (state) => ({ contenttreeID }) => {
    // return state.things.find(thing => thing.identifier === id)
    // console.log(contenttreeID)
    console.assert(contenttreeID)
    if (!(contenttreeID in state.contenttree)) {
      return (null)
    }

    return (state.contenttree[contenttreeID])
  },


  get_content: (state) => ({ contenttreeID, contentID }) => {
    // return state.things.find(thing => thing.identifier === id)
    // console.log(contenttreeID)
    console.assert(contenttreeID)
    console.assert(contentID)

    if (!(contenttreeID in state.contenttree)) {
      return (null)
    }
    console.log(contenttreeID, contentID)
    if (!(contentID in state.contenttree[contenttreeID].entries)) {
      return (null)
    }

    return (state.contenttree[contenttreeID].entries[contentID])
  },

  get_content_text_max_length: (state) => ({ contenttreeID, type }) => {
    // console.log(contenttreeID, type)
    const MAX_LENGTHS = state.contenttree[contenttreeID].configuration.CONTENT_TEXT_MAX_LENGTH_BY_TYPES
    if (type in MAX_LENGTHS) {
      return MAX_LENGTHS[type]
    }
    return (state.contenttree[contenttreeID].configuration.DEFAULT_CONTENT_TEXT_MAX_LENGTH)
  },

  get_content_title_max_length: (state) => ({ contenttreeID, type }) => {
    const MAX_LENGTHS = state.contenttree[contenttreeID].configuration.CONTENT_TITLE_MAX_LENGTH_BY_TYPES
    if (type in MAX_LENGTHS) {
      return MAX_LENGTHS[type]
    }
    return (state.contenttree[contenttreeID].configuration.DEFAULT_CONTENT_TITLE_MAX_LENGTH)
  },

  get_allowed_node_types: (state) => ({ contenttreeID, parentType }) => {

    // Allowed types by ontology
    let types = [];
    if (parentType === undefined) {
      types = state.contenttree[contenttreeID].configuration.CONTENTTYPES
    } else {
      types = state.contenttree[contenttreeID].configuration.ONTOLOGY[parentType]
    }

    return (types)
  },

  get_node_types_with_add_permission: (state) => ({ contenttreeID }) => {

    // Allowed types by ontology
    return (state.contenttree[contenttreeID].configuration.ALLOWED_CONTENT_TYPES_TO_ADD)
  },


  getExpandedBranches: (state) => ({ contenttreeID, rootNodeID }) => {
    let key = contenttreeID + '-' + rootNodeID
    if (!(key in state.expanded_branches)) {
      return null;
    }
    return state.expanded_branches[key]
  },

  get_content: (state) => ({ contenttreeID, contentID }) => {
    return state.contenttree[contenttreeID]?.entries[contentID]
  },

  isCommonPropertyByConentType: (state) => ({ contenttreeID, type }) => {

    if (!state.contenttree[contenttreeID].configuration.CONTENTTYPES.includes(type)) {
      return null;
    }

    return (state.contenttree[contenttreeID].configuration.COMMON_PROPERTY_CONTENT.includes(type))
  },


  monitorPathChange: (state) => ({ contentTuple }) => {
    // return yes, if parent_id changed or if path is not yet set.
    console.assert(contentTuple && contentTuple.content && contentTuple.content.id)
    const contenttreeID = contentTuple.content.contenttree_id
    console.assert(contenttreeID);
    const previousParentID = state.contenttree[contenttreeID].entries[contentTuple.content.id]?.content?.parent_id
    return previousParentID !== contentTuple.content.parent_id
  },

}

const actions = {

  /* Retrieve new version of the contenttree <assemblyIdentifier>.<contenttreeID>
  If timelag is set to true, the method will wait a few seconds to give priority the other 
  API-Requests. (e.g. RetrieveAssembly)
  TODO: is there a better way to queue API Requests. 
  (Consider also the problem of oAuth2 Token refreshs, that are then issued twice..)
  */
  retrieveContenttree({ commit }, { assemblyIdentifier, contenttreeID, timelag }) {

    console.log("with timelage", timelag)
    const timeout = timelag ? 5 : 0
    setTimeout(() => {

      // console.log('Retrieve contenttree from resource server' + contenttreeID)
      console.assert(contenttreeID)
      api.retrieveContenttree(assemblyIdentifier, contenttreeID)
        .then(
          response => {
            // update
            // console.log('save full contenttree to cache.')
            console.assert(response.data)
            console.assert('OK' in response.data)
            console.assert('contenttree' in response.data)
            let configuration = 'configuration' in response.data ? response.data.configuration : null

            commit('add_or_update_contenttree', {
              contenttreeID: contenttreeID,
              contenttree: response.data.contenttree,
              configuration: configuration
            });
          }
        )
        .catch((error) => {
          console.warn("Request Error", error)
        });
    })
  },


  /* Retrieve modifed content of the contenttree <assemblyIdentifier>.<contenttreeID>
  */
  updateContenttree({ commit, dispatch }, { assemblyIdentifier, contenttreeID, update_date, timelag }) {

    console.log("UPDATE CONTENTTREE; now! with timelage", timelag)
    commit('set_update_date_to_current', { contenttreeID });

    const timeout = timelag ? 1000 : 0
    setTimeout(() => {

      // console.log('Retrieve contenttree from resource server' + contenttreeID)
      console.assert(contenttreeID)
      api.updateContenttree(assemblyIdentifier, contenttreeID, update_date, timelag)
        .then(
          response => {

            console.log("RESPONSE OF CONTENTTREE UPDATE IS HERE...", response.data)
            console.assert(response?.data)
            console.assert('OK' in response.data)
            let modifiedContents = response.data.contents
            if (modifiedContents && Object.values(modifiedContents).length) {
              console.log("STORE MODIFIED CONTENT TO DISK", modifiedContents)
              dispatch('update_contents', {
                modifiedContents
              });
            }
          }
        )
        .catch((error) => {
          console.warn("Request Error", error)
        });
    })
  },

  add_or_update_contenttree({ commit }, { contenttreeID, contenttree, configuration }) {
    commit('add_or_update_contenttree', { contenttreeID, contenttree, configuration });
  },

  update_contents({ commit, getters, dispatch }, { modifiedContents }) {
    // in case content or progression changes (without changing hirarchy...)
    // console.log("RETRIEVED MODIFIED CONTENTS (2)", modifiedContents)
    console.assert(modifiedContents !== undefined)
    console.assert(modifiedContents !== null)
    const contentIdsToUpdateStructure = {}
    for (let contentTuple of Object.values(modifiedContents)) {
      console.assert(contentTuple !== undefined)
      console.assert(contentTuple !== null)

      // collect all Contents with parent_id modifications (grouped by contenttree)
      const contenttreeID = contentTuple.content.contenttree_id
      if (getters.monitorPathChange({ contentTuple })) {
        if (!contentIdsToUpdateStructure[contenttreeID]) {
          contentIdsToUpdateStructure[contenttreeID] = []
        }
        contentIdsToUpdateStructure[contenttreeID].push(contentTuple.content.id)
      }
      // console.log("contentIdsToUpdateStructure", contentIdsToUpdateStructure, "llllllllllll")
      commit('update_content', { contentTuple });
    }

    // UPDATE TREE STRUCTURE of parentID modified contents (grouped by contenttree)
    if (Object.values(contentIdsToUpdateStructure).length) {
      Object.entries(contentIdsToUpdateStructure).forEach(([contenttreeID, contentIdsToUpdate]) => {
        // console.log("PATH STRUCTURE IS TO UPDATE FOR ", contentIdsToUpdate, " contents")
        console.assert(contenttreeID)
        // dispatch('updateTreeStructure', { contenttreeID, contentIdsToUpdate });
        commit('updateTreeStructure', { contenttreeID, contentIdsToUpdate });
      })
    }
  },

  update_content({ commit, getters }, { contentTuple }) {
    // in case content or progression changes (without changing hirarchy...)
    console.assert(contentTuple !== undefined)
    console.assert(contentTuple !== null)
    // console.log("SEND TO mutate", contentTuple);

    const pathChanged = getters.monitorPathChange({ contentTuple });
    commit('update_content', { contentTuple });
    if (pathChanged) {
      // console.log("path changed");
      const contenttreeID = contentTuple.content.contenttree_id
      console.assert(contenttreeID)
      commit('updateTreeStructure', { contenttreeID, contentIdsToUpdate: [contentTuple.content.id] });
    }
  },

  update_rating({ commit }, { contenttreeID, contentID, topicID, rating }) {
    commit('update_rating', { contenttreeID, contentID, rating })
    if (topicID && topicID !== contentID) {
      console.log("update_discussed...topicID", topicID)
      commit('update_discussed', { contenttreeID, contentID: topicID })
    }
  },

  update_review({ commit }, { contenttreeID, contentID, reviewed }) {
    commit('update_review', { contenttreeID, contentID, reviewed })
  },
  update_salience({ commit }, { contenttreeID, contentID, topicID, salience }) {
    commit('update_salience', { contenttreeID, contentID, salience })
    if (topicID && topicID !== contentID) {
      commit('update_discussed', { contenttreeID, contentID: topicID })
    }
  },
  update_read({ commit }, { contenttreeID, contentID }) {
    commit('update_read', { contenttreeID, contentID })
  },

  update_discussed({ getters, commit }, { contenttreeID, contentID }) {
    console.assert(contentID)
    console.log("first step in updat_discussion", contenttreeID, contentID)
    // while (contentID) {

    const content = getters.get_content({ contenttreeID, contentID })
    if (content?.progression?.discussed) {
      // already discussed...
      return;
    }
    commit('update_discussed', { contenttreeID, contentID })
    // }
  },
  update_expanded_branches({ commit }, { contenttreeID, rootNodeID, expanded }) {
    // console.log(expanded)
    commit('update_expanded_branches', { contenttreeID, rootNodeID, expanded });
  },

  deleteContentStore({ commit }) {
    commit('deleteContentStore');
  },

  syncContenttree: ({ state, dispatch, localgetters, rootState, rootGetters }, { assemblyIdentifier, contenttreeID, oauthUserID }) => {

    // wrong user? and renew cache all x- minutes!
    const wrongUser = state.contenttree[contenttreeID] && oauthUserID != state.contenttree[contenttreeID]?.access_sub
    if (wrongUser) {
      // console.log('wrong user:-(')
      Vue.set(state, 'contenttree', {})
    }

    const emptyContenttree = !(state.contenttree[contenttreeID])
    const expired = !emptyContenttree && api.expiredCacheDate(state.contenttree[contenttreeID]?.access_date)
    if (!expired && !emptyContenttree && !wrongUser) {
      // CACHE IS UP TO DATE!
      // console.log('Contenttree Cache IS UP TO DATE')

      // console.log("CONTENTREE CACHE IS STILL VALID! DO WE NEED TO CHECK FOR NEW CONTENT? ")
      dispatch('checkToUpdateContenttree', { assemblyIdentifier, contenttreeID })
      return (true)
    }

    // too old or missing cache: load the data from resource server...
    console.log('Cache expired: reload contenttree', expired, wrongUser, emptyContenttree)
    dispatch('retrieveContenttree', {
      assemblyIdentifier: assemblyIdentifier,
      contenttreeID: contenttreeID,
      timelag: !emptyContenttree && !wrongUser
    })
  },

  checkToUpdateContenttree: ({ state, dispatch, localgetters, rootState, rootGetters }, { assemblyIdentifier, contenttreeID }) => {

    // Check for new content / Modified content, from time to time...
    const update_date = state.contenttree[contenttreeID]?.update_date;
    console.assert(update_date)
    const expiredUpdateTime = api.expiredUpdateDate(update_date)
    if (!expiredUpdateTime) {
      return (true)
    }

    // too old or missing cache: load the data from resource server...
    console.log('Its update time: check for modified / new contents')
    dispatch('updateContenttree', {
      assemblyIdentifier: assemblyIdentifier,
      contenttreeID: contenttreeID,
      update_date: update_date,
      timelag: true
    })
  }
}


const mutations = {

  add_or_update_contenttree(state, { contenttreeID, contenttree, configuration }) {

    // keep list of opened contents (if previously available)
    // console.log('update contenttree')
    let configuration_old = null;
    let expanded_old = null;

    if (contenttreeID in state.contenttree) {
      // expanded_old = state.contenttree[contenttreeID].expanded_by_default
      configuration_old = state.contenttree[contenttreeID].configuration
    }
    // console.log(configuration)

    contenttree.configuration = configuration ? configuration : configuration_old
    if (expanded_old) {
      contenttree.expanded = expanded_old
    }
    // console.log(contenttree)
    // console.log('new copy saved...')
    Vue.set(state.contenttree, contenttreeID, contenttree)
  },

  update_content(state, { contentTuple }) {
    // in case content or progression changes (without changing hirarchy...)
    console.assert(contentTuple !== undefined)
    console.assert(contentTuple !== null)

    let contenttreeID = contentTuple.content.contenttree_id
    let contentID = contentTuple.content.id

    // NEW ENTRIES
    if (!(contentID in state.contenttree[contenttreeID].entries)) {
      console.assert(contentTuple.content);
      console.assert(contentTuple.creator);
      Vue.set(state.contenttree[contenttreeID].entries, contentTuple.content.id, {
        progression: contentTuple.progression,
        content: contentTuple.content,
        creator: contentTuple.creator,
        path: contentTuple.path
      })
    } else {

      if (contentTuple.progression) {
        Vue.set(state.contenttree[contenttreeID].entries[contentID], 'progression', contentTuple.progression)
      }
      if (contentTuple.content) {
        Vue.set(state.contenttree[contenttreeID].entries[contentID], 'content', contentTuple.content)
      }
      if (contentTuple.creator) {
        Vue.set(state.contenttree[contenttreeID].entries[contentID], 'creator', contentTuple.creator)
      }
      if (contentTuple.path) {
        Vue.set(state.contenttree[contenttreeID].entries[contentID], 'path', contentTuple.path)
      }
    }
  },

  updateTreeStructure(state, { contenttreeID, contentIdsToUpdate }) {

    console.log("content that have changed their parent object", contentIdsToUpdate)
    const contentsToUpdate = Object.values(state.contenttree[contenttreeID].entries).filter(contentTuple => {
      return !contentTuple.path || contentTuple.path.some(r => contentIdsToUpdate.includes(r))
    })

    console.log("content that is affected by parent_id modifications", contentsToUpdate)
    contentsToUpdate.forEach(contentTuple => {
      console.log("UPDATE PATH FOR FOLLOGING CONTENTS", contentIdsToUpdate)
      let antecesdentID = contentTuple.content.id
      let antecesdent = state.contenttree[contenttreeID].entries[antecesdentID];
      let rootElementIds = state.contenttree[contenttreeID].rootElementIds;
      const isAmongRootElementIds = rootElementIds.includes(contentTuple.content.id)
      console.assert(!antecesdentID || antecesdent)
      let path = []
      while (antecesdent) {
        // Add at the beginning
        path.unshift(antecesdentID)

        // GET new Ancestore
        antecesdentID = antecesdent.content.parent_id
        if (antecesdentID) {
          antecesdent = state.contenttree[contenttreeID].entries[antecesdentID];
        } else {
          antecesdent = null;
        }
        console.assert(!antecesdentID || antecesdent)
        // console.log(".", antecesdentID)
      }
      // console.log("updated Path: ", contentTuple, ":", path)
      Vue.set(state.contenttree[contenttreeID].entries[contentTuple.content.id], "path", path)

      // Update RootNode Ids...
      if (contentTuple.content.parent_id && isAmongRootElementIds) {
        // REMOVE
        rootElementIds = rootElementIds.filter(x => x !== contentTuple.content.id)
        Vue.set(state.contenttree[contenttreeID], "rootElementIds", rootElementIds)
      }
      if (!contentTuple.content.parent_id && !isAmongRootElementIds) {
        // ADD
        rootElementIds.push(contentTuple.content.id)
        Vue.set(state.contenttree[contenttreeID], "rootElementIds", rootElementIds)
        // console.log("add ")
      }
      console.log("CURRENT ROOT ELEMENTS:, ", rootElementIds)
    })
  },

  update_expanded_branches(state, { contenttreeID, rootNodeID, expanded }) {
    // in case content or progression changes (without changing hierarchy...)
    let key = contenttreeID + '-' + rootNodeID
    Vue.set(state.expanded_branches, key, expanded)
  },

  delete_contenttree(state, { contenttreeID }) {
    Vue.set(state.contenttree, key, null)
  },

  set_update_date_to_current(state, { contenttreeID }) {
    const now = new Date()
    Vue.set(state.contenttree[contenttreeID], 'update_date', now)
  },


  update_rating(state, { contenttreeID, contentID, rating }) {
    // in case content or progression changes (without changing hierarchy...)
    if (rating === null || rating === undefined) {
      return (null)
    }

    let progression = state.contenttree[contenttreeID]?.entries[contentID]?.progression
    if (!progression) {
      progression = {
        read: true,
        discussed: true
      }
    }

    // store value
    progression.rating = rating

    Vue.set(state.contenttree[contenttreeID].entries[contentID], 'progression', progression)
  },

  update_review(state, { contenttreeID, contentID, reviewed }) {
    // in case content or progression changes (without changing hierarchy...)
    if (reviewed === null || reviewed === undefined) {
      return (null)
    }

    let content = state.contenttree[contenttreeID]?.entries[contentID]?.content
    console.assert(content)

    // store value
    content.reviewed = reviewed

    Vue.set(state.contenttree[contenttreeID].entries[contentID], 'content', content)
  },

  update_read(state, { contenttreeID, contentID }) {
    let progression = state.contenttree[contenttreeID]?.entries[contentID]?.progression
    if (!progression) {
      progression = {
        read: false,
        discussed: false,
        rating: null,
        salience: null
      }
    }

    // store value
    progression.read = true

    Vue.set(state.contenttree[contenttreeID].entries[contentID], 'progression', progression)
  },

  update_discussed(state, { contenttreeID, contentID }) {
    // console.log("update_discussed ############", contentID, contenttreeID)
    let progression = state.contenttree[contenttreeID]?.entries[contentID]?.progression
    if (!progression) {
      progression = {
        read: true,
        discussed: true,
        rating: null,
        salience: null
      }
      console.log("add progressison", progression)
      Vue.set(state.contenttree[contenttreeID].entries[contentID], 'progression', progression)
    } else {
      console.log("update.. progressison discussed", contentID)
      Vue.set(state.contenttree[contenttreeID].entries[contentID].progression, 'discussed', true)
    }
  },

  update_salience(state, { contenttreeID, contentID, salience }) {

    if (salience === undefined) {
      return (null)
    }

    // TARGET
    let progression = state.contenttree[contenttreeID]?.entries[contentID]?.progression
    if (!progression) {
      progression = {
        read: true,
        salience: salience,
        discussed: true,
        view: false
      }
      Vue.set(state.contenttree[contenttreeID].entries[contentID], 'progression', progression)
    } else {
      console.log("update.. progressison salienced", contentID, salience)

      Vue.set(state.contenttree[contenttreeID].entries[contentID].progression, 'salience', salience)
    }
  },

  deleteContentStore(state) {
    Vue.set(state, 'contenttree', {})
    Vue.set(state, 'expanded_branches', {})
  }
}

export const contentstore = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
