/**
 * Do not catch errors in here...
 */
import ApiService from 'src/utils/xhr'
import { date } from 'quasar'
import usePKCEComposable from 'src/plugins/VueOAuth2PKCE/pkce.composable';
import useAuthComposable from 'src/composables/auth.composable';

const {refresh_token_if_required} = usePKCEComposable()

export default {

  /* checks if the date transmitted is still a valid cache date. */
  expiredCacheDate(timeDownloaded) {
    if (!timeDownloaded) { return (false) }
    timeDownloaded = new Date(timeDownloaded)
    const expiringDate = date.addToDate(timeDownloaded, { minutes: parseInt(process.env.ENV_APISERVER_CACHE_EXPIRATION_MINUTES) })
    return (new Date(Date.now()) > expiringDate)
  },

  /* checks if the date transmitted is still a valid cache date. */
  expiredUpdateDate(timeDownloaded) {
    if (!timeDownloaded) { return (false) }
    timeDownloaded = new Date(timeDownloaded)
    const pingDate = date.addToDate(timeDownloaded, { minutes: parseInt(process.env.ENV_APISERVER_PING_FOR_MODIFIED_CONTENT_MINUTES) })
    return (new Date(Date.now()) > pingDate)
  },


  // oAuth Server
  // *********************************
  /**
   * Get or Update Userprofile data..
   */
  async authProfile(profile) {

    console.log('API authProfile')

    // Renew token (if required)
    await refresh_token_if_required()

    /* Update Auth Profile => Emailadress/ Username etc... */
    profile.client_id = process.env.ENV_OAUTH_CLIENT_ID
    let url = `${process.env.ENV_OAUTH_BASE_URL}/accounts/emailupdate`
    const data = {
      method: 'post',
      url: url,
      data: profile,
      headers: {
        'content-type': 'application/json'
      }
    }
    return (ApiService.customRequest(data))
  },

  // API
  // ******************************
  /**
   * Get or Public-Profile Data.. (API)
   */
  async publicProfile() {

    console.log('API publicProfile')

    // Renew token (if required)
    // refresh_token method is done earlier, while launching app.
    // const {refresh_token_if_required} = usePKCEComposable()
    await refresh_token_if_required()

    /* Notify Resource Server about certain user activities in the client app. */
    let url = `${process.env.ENV_APISERVER_URL}/profile`
    // console.log('get public profile (API-Server)')
    return await ApiService.get(url)
  },
  /**
   * Testing: Reset user data 
   */
  async apireset(full) {

    console.log('API reset')

    // Renew token (if required)
    // refresh_token method is done earlier, while launching app.
    // const {refresh_token_if_required} = usePKCEComposable()
    await refresh_token_if_required()

    /* Notify Resource Server about certain user activities in the client app. */
    let url = ''
    if (full) {
      url = `${process.env.ENV_APISERVER_URL}/user/fullreset`
    } else {
      url = `${process.env.ENV_APISERVER_URL}/user/dayreset`
    }
    // console.log('get public profile (API-Server)')
    return ApiService.get(url)
  },

  /**
 * MODERATION: Send notification message to user 
 */
  async sendUserMessage(assemblyIdentifier, userID, message) {
    console.log('API: sendUserMessage')
    // Renew token (if required)
    // const {refresh_token_if_required} = usePKCEComposable()
    await refresh_token_if_required()
    const url = `${process.env.ENV_APISERVER_URL}/assembly/${assemblyIdentifier}/notifyuser`
    return ApiService.post(url, { user_id: userID, message })
  },
  /**
   * MODERATION: Lock user from the assembly 
   */
  async lockUserWithMessage(assemblyIdentifier, userID, message) {
    console.log('API: sendUserMessage')
    await refresh_token_if_required()
    const url = `${process.env.ENV_APISERVER_URL}/assembly/${assemblyIdentifier}/lockuser`
    return ApiService.post(url, { user_id: userID, message })
  },

  async monitorActivities(buffer, onlyWhenTokenValid) {
    const {refresh_token_if_required, brokenSession, authorized} = useAuthComposable()

    if (brokenSession.value) {
      console.log('**** authComposable.brokenSession is set to TRUE: no ajax call is executed... ******')
      return (false)
    }

    // Only precheck token (if this is not an APP Exit Event)
    if (onlyWhenTokenValid) {
      if (!authorized()) {
        return (false);
      }
      if (await expiredJWT()) {
        return (false)
      }
    }


    await refresh_token_if_required()

    // console.log("/api")
    /* Notify Resource Server about certain user activities in the client app. */
    let url = `${process.env.ENV_APISERVER_URL}/monitor`
    // console.log('monitor activies in API')
    const response = await ApiService.post(url, { buffer })
    return response.data

  },

  async retrievePublicIndex() {


    // Renew token (if required)
    // const {refresh_token_if_required} = usePKCEComposable()
    await refresh_token_if_required()

    console.log('API retrievePublicIndex')
    let url = `${process.env.ENV_APISERVER_URL}/assemblies`

    let data = {
      method: 'GET',
      url: url,
      WithoutAuthHeader: true
    }

    return await ApiService.customRequest(data)
  },

  // api.retrieveNotifications
  // api.updateNotifications


  async retrieveAssembly(assemblyIdentifier) {

    console.log('API retrieveAssembly')

    // Renew token (if required)
    // const {refresh_token_if_required} = usePKCEComposable()
    await refresh_token_if_required()

    let url = `${process.env.ENV_APISERVER_URL}/assembly/${assemblyIdentifier}`
    return await ApiService.get(url)
  },


  async addOrUpdateStage(assemblyIdentifier, stage) {

    // Renew token (if required)
    // const {refresh_token_if_required} = usePKCEComposable()
    await refresh_token_if_required()

    let url = `${process.env.ENV_APISERVER_URL}/assembly/${assemblyIdentifier}/stage`;
    if (stage.id) {
      url += `/${stage.id}`;
    }
    return ApiService.post(url, { stage })
  },

  async updateAssembly(assemblyIdentifier, assembly) {

    // Renew token (if required)
    // const {refresh_token_if_required} = usePKCEComposable()
    await refresh_token_if_required()

    let url = `${process.env.ENV_APISERVER_URL}/assembly/${assemblyIdentifier}/assembly/form/${assembly.id}`;
    console.assert(assembly.id);
    return ApiService.post(url, { assembly })
  },

  async retrieveContenttree(assemblyIdentifier, contenttreeID) {

    console.log('API retrieveContenttree')

    // Renew token (if required)
    // const {refresh_token_if_required} = usePKCEComposable()
    await refresh_token_if_required()

    let url = `${process.env.ENV_APISERVER_URL}/assembly/${assemblyIdentifier}/contenttree/${contenttreeID}/contenttree`
    return await ApiService.get(url)
  },

  async updateContenttree(assemblyIdentifier, contenttreeID, update_date) {

    console.log('API retrieveContenttree')

    // Renew token (if required)
    // const {refresh_token_if_required} = usePKCEComposable()
    await refresh_token_if_required()

    let url = `${process.env.ENV_APISERVER_URL}/assembly/${assemblyIdentifier}/contenttree/${contenttreeID}/update`
    return await ApiService.post(url, { content: { update_date } })
  },

  async saveContent(assemblyIdentifier, contenttreeID, data) {

    console.log('API saveContent')

    // Renew token (if required)
    // const {refresh_token_if_required} = usePKCEComposable()
    await refresh_token_if_required()

    // compose url
    let url = `${process.env.ENV_APISERVER_URL}/assembly/${assemblyIdentifier}`
    if (data.id) {
      // this is an update
      url += `/content/${data.id}/save`
    } else {
      url += `/contenttree/${contenttreeID}/addcontent`;
    }

    return await ApiService.post(url, { content: data })
  },

  async proposeContent(assemblyIdentifier, contenttreeID, data) {

    console.log('API saveContent', contenttreeID)

    // Renew token (if required)
    // const {refresh_token_if_required} = usePKCEComposable()
    await refresh_token_if_required()

    // compose url
    let url = `${process.env.ENV_APISERVER_URL}/assembly/${assemblyIdentifier}`
    if (data.id) {
      // this is an update
      url += `/content/${data.id}/propose`
    } else {
      url += `/contenttree/${contenttreeID}/propose`;
    }

    return await ApiService.post(url, { content: data })
  },

  async contentDetail(assemblyIdentifier, contentID) {

    console.log('API contentDetail', contentID)

    // Renew token (if required)
    // const {refresh_token_if_required} = usePKCEComposable()
    await refresh_token_if_required()

    // compose url
    let url = `${process.env.ENV_APISERVER_URL}/assembly/${assemblyIdentifier}/content/${contentID}/detail`
    return await ApiService.get(url)
  },

  async retrievePeerreviews(assemblyIdentifier, contenttreeID) {

    console.log('API retrievePeerreviews')

    // Renew token (if required)
    // const {refresh_token_if_required} = usePKCEComposable()
    await refresh_token_if_required()

    let url = `${process.env.ENV_APISERVER_URL}/assembly/${assemblyIdentifier}/contenttree/${contenttreeID}/peerreviews`
    return await ApiService.get(url)
  },


  async updatePeerreviews(assemblyIdentifier, contenttreeID, update_date) {

    console.log('API updatePeerreviews')

    // Renew token (if required)
    // const {refresh_token_if_required} = usePKCEComposable()
    await refresh_token_if_required()

    let url = `${process.env.ENV_APISERVER_URL}/assembly/${assemblyIdentifier}/contenttree/${contenttreeID}/peerreviewupdate`
    return await ApiService.post(url, { content: { update_date } })
  },


  async updateNotifications(update_date) {

    console.log('API updateNotifications')

    // Renew token (if required)
    // const {refresh_token_if_required} = usePKCEComposable()
    await refresh_token_if_required()

    let url = `${process.env.ENV_APISERVER_URL}/notifications`
    return await ApiService.post(url, { update_date })
  },
}
