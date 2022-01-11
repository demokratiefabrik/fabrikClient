import api from 'src/utils/api'

  /* Retrieve new version of the contenttree <assemblyIdentifier>.<contenttreeID>
  If timelag is set to true, the method will wait a few seconds to give priority the other 
  API-Requests. (e.g. RetrieveAssembly)
  TODO: is there a better way to queue API Requests. 
  (Consider also the problem of oAuth2 Token refreshs, that are then issued twice..)
  */
export const  retrieveContenttree = ({ commit }, { assemblyIdentifier, contenttreeID, timelag }) => {

    console.log('with timelag', timelag)
    const timeout = timelag ? 1000 : 0
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
            const configuration = 'configuration' in response.data ? response.data.configuration : null

            commit('add_or_update_contenttree', {
              contenttreeID: contenttreeID,
              contenttree: response.data.contenttree,
              configuration: configuration
            });
          }
        )
        .catch((error) => {
          console.warn('Request Error', error)
        });
    }, timeout)
  }

/* Retrieve modifed content of the contenttree <assemblyIdentifier>.<contenttreeID>
Timelag: postpone update call by one second...
  */
 export const updateContenttree = ({ commit, dispatch }, { assemblyIdentifier, contenttreeID, update_date, timelag }) => {

    console.log('UPDATE CONTENTTREE; now or with timelag', timelag)
    commit('set_update_date_to_current', { contenttreeID });

    const timeout = timelag ? 1000 : 0
    setTimeout(() => {

      // console.log('Retrieve contenttree from resource server' + contenttreeID)
      console.assert(contenttreeID)
      // assemblyIdentifier, contenttreeID, update_date
      api.updateContenttree(assemblyIdentifier, contenttreeID, update_date)
        .then(
          response => {
            console.log('RESPONSE OF CONTENTTREE UPDATE IS HERE...', response.data)
            console.assert(response?.data)
            console.assert('OK' in response.data)
            const modifiedContents = response.data.contents
            if (modifiedContents && Object.values(modifiedContents).length) {
              console.log('STORE MODIFIED CONTENT TO DISK', modifiedContents)
              dispatch('update_contents', {
                modifiedContents
              });
            }
          }
        )
        .catch((error) => {
          console.warn('Request Error', error)
        });
    }, timeout)
  }

 export const  add_or_update_contenttree = ({ commit }, { contenttreeID, contenttree, configuration }) => {
    commit('add_or_update_contenttree', { contenttreeID, contenttree, configuration });
  }

 export const  update_contents= ({ commit, getters }, { modifiedContents }) => {
    // in case content or progression changes (without changing hirarchy...)
    // console.log("RETRIEVED MODIFIED CONTENTS (2)", modifiedContents)
    console.assert(modifiedContents !== undefined)
    console.assert(modifiedContents !== null)
    const contentIdsToUpdateStructure = {}
    for (const contentTuple of Object.values(modifiedContents)) {
      console.assert(contentTuple !== undefined)
      console.assert(contentTuple !== null)

      // collect all Contents with parent_id modifications (grouped by contenttree)
      const contenttreeID = (contentTuple as any).content.contenttree_id
      if (getters.monitorPathChange= ({ contentTuple })) {
        if (!contentIdsToUpdateStructure[contenttreeID]) {
          contentIdsToUpdateStructure[contenttreeID] = []
        }
        contentIdsToUpdateStructure[contenttreeID].push((contentTuple as any).content.id)
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
  }

 export const  update_content= ({ commit, getters }, { contentTuple }) => {
    // in case content or progression changes (without changing hirarchy...)
    console.assert(contentTuple !== undefined)
    console.assert(contentTuple !== null)
    // console.log("SEND TO mutate", contentTuple);

    const pathChanged = getters.monitorPathChange= ({ contentTuple });
    commit('update_content', { contentTuple });
    if (pathChanged) {
      // console.log("path changed");
      const contenttreeID = contentTuple.content.contenttree_id
      console.assert(contenttreeID)
      commit('updateTreeStructure', { contenttreeID, contentIdsToUpdate: [contentTuple.content.id] });
    }
  }

 export const  update_rating= ({ commit }, { contenttreeID, contentID, topicID, rating }) => {
    commit('update_rating', { contenttreeID, contentID, rating })
    if (topicID && topicID !== contentID) {
      console.log('update_discussed...topicID', topicID)
      commit('update_discussed', { contenttreeID, contentID: topicID })
    }
  }

 export const  update_review= ({ commit }, { contenttreeID, contentID, reviewed }) => {
    commit('update_review', { contenttreeID, contentID, reviewed })
  }
  export const update_salience = ({ commit }, { contenttreeID, contentID, topicID, salience }) => {
    commit('update_salience', { contenttreeID, contentID, salience })
    if (topicID && topicID !== contentID) {
      commit('update_discussed', { contenttreeID, contentID: topicID })
    }
  }

  export const update_read = ({ commit }, { contenttreeID, contentID }) => {
    commit('update_read', { contenttreeID, contentID })
  }

 export const  update_discussed= ({ getters, commit }, { contenttreeID, contentID }) => {
    console.assert(contentID)
    console.log('first step in updat_discussion', contenttreeID, contentID)
    // while (contentID) {

    const content = getters.get_content({ contenttreeID, contentID })
    if (content?.progression?.discussed) {
      // already discussed...
      return;
    }
    commit('update_discussed', { contenttreeID, contentID })
    // }
  },
  update_expanded_branches= ({ commit }, { contenttreeID, rootNodeID, expanded }) => {
    // console.log(expanded)
    commit('update_expanded_branches', { contenttreeID, rootNodeID, expanded });
  }

 export const  deleteContentStore= ({ commit }) => {
    commit('deleteContentStore');
  }

 export const  syncContenttree = ({ state, dispatch }, { assemblyIdentifier, contenttreeID, oauthUserID }) => {

    // wrong user? and renew cache all x- minutes!
    const wrongUser = state.contenttree[contenttreeID] && oauthUserID != state.contenttree[contenttreeID]?.access_sub
    if (wrongUser) {
      // console.log('wrong user:-(')
      state.contenttree = {}
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
  }

 export const  checkToUpdateContenttree = ({ state, dispatch }, { assemblyIdentifier, contenttreeID }) => {

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