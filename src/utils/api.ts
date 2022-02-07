/**
 * Do not catch errors in here...
 */
// import xhr from 'src/utils/xhr'
import { date } from 'quasar'
import useXHR from 'src/utils/xhr';
import usePKCEComposable from 'src/plugins/VueOAuth2PKCE/pkce.composable';
const {refresh_token_if_required, expiredJWT, getBrokenSession} = usePKCEComposable()
const xhr = useXHR()

export default {

  /* checks if the date transmitted is still a valid cache date. */
  expiredCacheDate(timeDownloaded) {
    if (!timeDownloaded) { return (false) }
    timeDownloaded = new Date(timeDownloaded)
    const minutes = parseInt(process.env.ENV_APISERVER_CACHE_EXPIRATION_MINUTES as string)
    const expiringDate = date.addToDate(timeDownloaded, { minutes })
    return (new Date(Date.now()) > expiringDate)
  },

  /* checks if the date transmitted is still a valid cache date. */
  expiredUpdateDate(timeDownloaded) {
    if (!timeDownloaded) { return (false) }
    timeDownloaded = new Date(timeDownloaded)
    const minutes = parseInt(process.env.ENV_APISERVER_PING_FOR_MODIFIED_CONTENT_MINUTES as string)
    const pingDate = date.addToDate(timeDownloaded, { minutes })
    return (new Date(Date.now()) > pingDate)
  },


  // oAuth Server
  // *********************************
  /**
   * Get or Update Userprofile data..
   */
  async authProfile(profile): Promise<any> {

    console.log('API authProfile')

    // Renew token (if required)
    await refresh_token_if_required()

    /* Update Auth Profile => Emailadress/ Username etc... */
    profile.client_id = process.env.ENV_OAUTH_CLIENT_ID
    const url = `${process.env.ENV_OAUTH_BASE_URL}/accounts/emailupdate`
    const data = {
      method: 'post',
      url,
      data: profile,
      headers: {
        'content-type': 'application/json'
      }
    }
    return xhr.customRequest(data)
  },

  // API
  // ******************************
  /**
   * Get or Public-Profile Data.. (API)
   */
  async profile() {

    console.log('API profile')
    await refresh_token_if_required()
    const url = `${process.env.ENV_APISERVER_URL}/profile`
    return xhr.get(url)
  },
  /**
   * Testing: Reset user data 
   */
  async apireset(full) {

    console.log('API reset')
    await refresh_token_if_required()
    let url = ''
    if (full) {
      url = `${process.env.ENV_APISERVER_URL}/user/fullreset`
    } else {
      url = `${process.env.ENV_APISERVER_URL}/user/dayreset`
    }
    return xhr.get(url)
  },

  /**
 * MODERATION: Send notification message to user 
 */
  async sendUserMessage(assemblyIdentifier, userID, message) {
    console.log('API: sendUserMessage')
    await refresh_token_if_required()
    const url = `${process.env.ENV_APISERVER_URL}/assembly/${assemblyIdentifier}/notifyuser`
    return xhr.post(url, { user_id: userID, message })
  },
  /**
   * MODERATION: Lock user from the assembly 
   */
  async lockUserWithMessage(assemblyIdentifier, userID, message) {
    console.log('API: sendUserMessage')
    await refresh_token_if_required()
    const url = `${process.env.ENV_APISERVER_URL}/assembly/${assemblyIdentifier}/lockuser`
    return xhr.post(url, { user_id: userID, message })
  },

  
  /* Notify Resource Server about certain user activities in the client app. */
  async monitorActivities(buffer, onlyWhenTokenValid) {
    const {refresh_token_if_required, authorized} = usePKCEComposable()

    if (getBrokenSession()) {
      console.log('**** authComposable.brokenSession is set to TRUE: no ajax call is executed... ******')
      return (false)
    }

    // Only precheck token (if this is not an APP Exit Event)
    if (onlyWhenTokenValid) {
      if (!authorized) {
        return (false);
      }
      if (expiredJWT()) {
        return (false)
      }
    }

    await refresh_token_if_required()

    const url = `${process.env.ENV_APISERVER_URL}/monitor`
    const response =  await xhr.post(url, { buffer })
    return response.data
  },

  async retrievePublicIndex() {
    await refresh_token_if_required()
    console.log('API retrievePublicIndex')
    const url = `${process.env.ENV_APISERVER_URL}/assemblies`
    const data = {
      method: 'GET',
      url: url,
      WithoutAuthHeader: true
    }

    return xhr.customRequest(data)
  },


  async retrieveAssembly(assemblyIdentifier) {

    console.log('API retrieveAssembly')
    await refresh_token_if_required()
    const url = `${process.env.ENV_APISERVER_URL}/assembly/${assemblyIdentifier}`
    return xhr.get(url)
  },


  async addOrUpdateStage(assemblyIdentifier, stage) {
    await refresh_token_if_required()
    let url = `${process.env.ENV_APISERVER_URL}/assembly/${assemblyIdentifier}/stage`;
    if (stage.id) {
      url += `/${stage.id}`;
    }
    return xhr.post(url, { stage })
  },

  async updateAssembly(assemblyIdentifier, assembly) {
    await refresh_token_if_required()

    const url = `${process.env.ENV_APISERVER_URL}/assembly/${assemblyIdentifier}/assembly/form/${assembly.id}`;
    console.assert(assembly.id);
    return xhr.post(url, { assembly })
  },

  async retrieveContenttree(assemblyIdentifier, contenttreeID) {

    console.log('API retrieveContenttree')
    await refresh_token_if_required()
    const url = `${process.env.ENV_APISERVER_URL}/assembly/${assemblyIdentifier}/contenttree/${contenttreeID}/contenttree`
    return xhr.get(url)
  },

  async updateContenttree(assemblyIdentifier, contenttreeID, update_date) {

    console.log('API retrieveContenttree')
    await refresh_token_if_required()
    const url = `${process.env.ENV_APISERVER_URL}/assembly/${assemblyIdentifier}/contenttree/${contenttreeID}/update`
    return xhr.post(url, { content: { update_date } })
  },

  async saveContent(assemblyIdentifier, contenttreeID, data) {

    console.log('API saveContent')
    await refresh_token_if_required()
    let url = `${process.env.ENV_APISERVER_URL}/assembly/${assemblyIdentifier}`
    if (data.id) {
      // this is an update
      url += `/content/${data.id}/save`
    } else {
      url += `/contenttree/${contenttreeID}/addcontent`;
    }

    return xhr.post(url, { content: data })
  },

  async proposeContent(assemblyIdentifier, contenttreeID, data) {

    console.log('API saveContent', contenttreeID)
    await refresh_token_if_required()
    // compose url
    let url = `${process.env.ENV_APISERVER_URL}/assembly/${assemblyIdentifier}`
    if (data.id) {
      // this is an update
      url += `/content/${data.id}/propose`
    } else {
      url += `/contenttree/${contenttreeID}/propose`;
    }

    return xhr.post(url, { content: data })
  },

  async contentDetail(assemblyIdentifier, contentID) {

    console.log('API contentDetail', contentID)
    await refresh_token_if_required()
    const url = `${process.env.ENV_APISERVER_URL}/assembly/${assemblyIdentifier}/content/${contentID}/detail`
    return xhr.get(url)
  },

  async retrievePeerreviews(assemblyIdentifier, contenttreeID) {

    console.log('API retrievePeerreviews')
    await refresh_token_if_required()
    const url = `${process.env.ENV_APISERVER_URL}/assembly/${assemblyIdentifier}/contenttree/${contenttreeID}/peerreviews`
    return xhr.get(url)
  },


  async updatePeerreviews(assemblyIdentifier, contenttreeID, update_date, timelag=0) {

    console.log('API updatePeerreviews')
    await refresh_token_if_required()
    const url = `${process.env.ENV_APISERVER_URL}/assembly/${assemblyIdentifier}/contenttree/${contenttreeID}/peerreviewupdate`
    return xhr.post(url, { content: { update_date } })
  },


  async updateNotifications(update_date) {

    console.log('API updateNotifications')
    await refresh_token_if_required()
    const url = `${process.env.ENV_APISERVER_URL}/notifications`
    return xhr.post(url, { update_date })
  },
}
