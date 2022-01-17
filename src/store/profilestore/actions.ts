// import { useRouter } from 'vue-router';
import api from 'src/utils/api';
// import useEmitter from 'src/utils/emitter';
// const emitter = useEmitter()

export const  touchRandomSeed = ({ commit }) => {
    commit('set_random_seed')
  }

 export const  setAMCache = ({ commit }, { cacheKey, itemId }) => {
    commit('setAMCache', { cacheKey, itemId })
  }

 export const  syncProfile = ({ state, dispatch }, { oauthUserID, oauthUserEmail }) => {
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
  }

 export const  checkToUpdateNotifications = ({ state, dispatch }) => {

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
  }

/* Retrieve modifed / new notificaionts */
 export const updateNotifications= ({ commit }, { update_date, timelag }) => {

    console.log('UPDATE NOTIFICATIONS; now! with timelage', update_date, timelag)
    commit('set_notification_update_date_to_current');

    const timeout = timelag ? 5000 : 1
    setTimeout(() => {
      api.updateNotifications(update_date)
        .then(
          response => {
            console.log('RESPONSE OF Notification Updates are HERE....', response.data)
            console.assert(response.data)
            console.assert('OK' in response.data)
            const notifications = response.data.notifications
            commit('update_notifications', { notifications });
          }
        )
        .catch((error) => {
          console.warn('Request Error', error)
        });
    }, timeout)
  }

 export const  update_notifications= ({ commit }, { notifications }) => {
    commit('update_notifications', { notifications });
  }


 export const  deleteNotification= ({ commit }, { notificationID }) => {
    console.log('deleteNotification1/2', notificationID)
    commit('deleteNotification', { notificationID })
  }

 export const  deletePublicProfile= ({ commit }) => {
    commit('storePublicProfile', {})
    commit('storeNotifications', {})
    commit('deleteAMCache')
  }

 export const  retrievePublicProfile= ({ commit, dispatch }, {}) => {

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
  }

//  export const  
  // limitNotifications: = ({ commit }, { firstEntryID }) => {
  //   commit('limitNotifications', { firstEntryID })
  // }

 export const storeOauthAcls = ({ commit }, { oauthAcls }) => {
    commit('storeOauthAcls', oauthAcls)
  }