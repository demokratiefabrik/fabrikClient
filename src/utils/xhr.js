/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/**
 * https://medium.com/locale-ai/architecting-http-clients-in-vue-js-applications-for-efficient-network-communication-991cf1df1cb2
 * 
 * Provides methods for XHR-calls using Axios.
 */
import Vue from 'vue'
import axios from 'axios'
// import { LayoutEventBus } from 'src/utils/eventbus'
import { oAuthEventBus } from 'src/plugins/VueOAuth2PKCE/eventbus'
import { runtimeStore } from 'src/store/runtime.store'

const HTTP_HEADER = 'Authorization'
const RequestOrigin = 'ApiService'

const ReloginOnStatus403 = (config = {}) => {
  return Object.prototype.hasOwnProperty.call(config, 'ReloginOnStatus403') && !config.ReloginOnStatus403 ?
    false : true
}
const Allow400Status = (config = {}) => {
  return Object.prototype.hasOwnProperty.call(config, 'Allow400Status') && config.Allow400Status ?
    true : false
}
// const WithoutAuthHeader = (config = {}) => {
//   return Object.prototype.hasOwnProperty.call(config, 'WithoutAuthHeader') && config.WithoutAuthHeader ?
//     true : false
// }

const ApiService = {

  init() {
    axios.defaults.timeout = 2000
    axios.defaults.baseURL = process.env.ENV_APISERVER_URL
  },

  /**
   * Sets the transmitted JWT token as current default authentication header
   */
  setHeader(token) {

    if (token) {
      // console.log('............NEW NEW JWT TOKEN: ', !!token, token.substring(token.length - 5))
      axios.defaults.headers.common[HTTP_HEADER] = `JWT ${token}`
    } else {
      // console.log('............Remove header jwt set: ', !!token)
      delete axios.defaults.headers.common[HTTP_HEADER]
    }
  },

  /**
   * Removes the JWT token as default authentication header
   */
  removeHeader() {
    axios.defaults.headers.common = {}
    console.log('Remove axios header')
  },

  /**
   * Returns currently set default authentication header (without prefix)
   */
  getHeader() {
    if (HTTP_HEADER in axios.defaults.headers.common) {
      let header = axios.defaults.headers.common[HTTP_HEADER]
      if (header) {
        // console.log(header)
        let parts = header.split(' ');
        return (parts[1]);
      }
    }
    return (null)
  },

  is_api_service_used_as_axios_wrapper: function (resource) {
    if (!('origin' in resource) || (resource['origin'] != RequestOrigin)) {
      console.assert('ERROR: Please use ApiService as Axios Wrapper...')
    }
  },

  async get(resource) {

    let options = {
      method: 'GET',
      url: resource
    }
    return (await this.customRequest(options))
  },

  async post(resource, data) {
    let fulldata = {
      method: 'POST',
      url: resource,
      data: data
    }

    return (await this.customRequest(fulldata))
  },

  async put(resource, data) {
    let fulldata = {
      method: 'PUT',
      url: resource,
      data: data
    }

    return (await this.customRequest(fulldata))
  },

  async delete(resource, data) {
    let fulldata = {
      method: 'DELETE',
      url: resource,
      data: data
    }

    return (await this.customRequest(fulldata))
  },

  /**
   * Perform a custom Axios request.
   **/
  async customRequest(data) {

    // Assert that header is set, when somebody is authenticated.
    // var temp_oauth_jwt = null

    data['origin'] = RequestOrigin
    data['timeout'] = 30000 // 30 seconds till timeout

    // if (WithoutAuthHeader(data)) {
    //   // cache the current header and remove it
    //   // console.log('remove XHR header')
    //   temp_oauth_jwt = this.getHeader()
    //   this.removeHeader()
    // }

    if (runtimeStore.brokenSession) {
      console.log('**** runtimeStore.brokenSession is set to TRUE: no ajax call is executed... ******')
      return (null)
    }


    var response = null
    response = await axios(data)

    // console.log('DEBUG1 ', response)

    // TOKEN SHOULD BE ALRIGHT NOW:
    // DO the secont attempt

    // retoken parameter is set within the interceptor on 403 errors.
    // At this point, the jwt token is already refreshed (within the interceptor) 
    if (response.retoken) {
      console.log('PERMISSION ERROR: Initiate a secont attempt')

      // Re-axios (same as before...)
      // (token should already be refreshed...)
      // console.log('Second attempt....')
      response = await axios(data)

      // What if the second attempt fails?
      if (response.retoken) {
        console.log('token could not be renewed.. 2nd attempt failed.')
        this.emitter.emit('showAuthorizationError')
      }
      // Headers are set again. dont neet to this.
      // temp_oauth_jwt = null
    }

    // retry parameter is set within the interceptor on 400 errors.
    // => DB-Deadlock or Database Data-Integritiy Errors (two parallel requests, that insert a specific entry...)
    if (response.HTTP_ERROR_CODE) {

      console.log('HTTP ERROR: Initiate a second attempt', data.HTTP_ERROR_CODE, response.HTTP_ERROR_CODE)
      data.HTTP_ERROR_CODE = response.HTTP_ERROR_CODE
      // ReIssue the request
      console.assert(data.url)
      if (data.url.includes('?')) {
        data.url = `${data.url}&rty=1`
      } else {
        data.url = `${data.url}?rty=1`
      }
      // Why retry? Database e.g. Deadlocks or integrity errors (parallel requests...)
      response = await axios(data)
    }

    return (response)
  },



  /**
   * Refresh Token: if Api request returns 401
   * This is done by axios intercept method, which everytime checks response.status of each API call.
   */
  mountAxiosInterceptor(onRejected) {

    let onFullfilled = (response) => {
      return response;
    }

    axios.interceptors.response.use(
      onFullfilled,
      error => onRejected(error)
    )
  }
}


// AXIOS  INTERCEPTOR
/////////////////////////////////
const ERROR_CODES_TO_RETRY = [400, 500, 502, 503, 501]

const axiosErrorHandling = async function (error) {
  // enfoce that ApiService Wrapper is used, (and not pure Axios)

  const PREVIOUS_HTTP_ERROR_CODE = error?.config?.PREVIOUS_HTTP_ERROR_CODE
  const NEW_STATUS = error.response?.status ? parseInt(error.response?.status) : null
  console.log('XHR ERROR: PREVIOUS:', PREVIOUS_HTTP_ERROR_CODE, 'NEW:', NEW_STATUS)

  // No remote connection established
  // Invalid URL or Server not reachable...
  if (!NEW_STATUS && !error?.response) {

    console.log('Network error: empty response set', error)

    // check if two in a row...
    if (PREVIOUS_HTTP_ERROR_CODE != 'NETWORK') {
      // no, this is the first one..
      return ({ HTTP_ERROR_CODE: 'NETWORK' })
    }
    this.emitter.emit('showNetworkError')
    return Promise.reject(error)

    // Server Error
  } else if (ERROR_CODES_TO_RETRY.includes(NEW_STATUS)) {
    console.log('error code retrieved', NEW_STATUS)
    // HTTP errors (parse errors, etc..)
    if (Allow400Status(error.config)) {
      // dont raise 400 errors, if this is desired explicitly
      console.log(`AXIOS: Pass Error ${PREVIOUS_HTTP_ERROR_CODE}`)
      return (true)
    }

    // check if two in a row...
    if (NEW_STATUS != PREVIOUS_HTTP_ERROR_CODE) {
      // no, this is the first one..
      console.log('ERROR CODES: first trial finished')
      return ({ HTTP_ERROR_CODE: NEW_STATUS })
    }
    this.emitter.emit('showServiceError')
    return Promise.reject(error)

    // 405 Authorization errors : probably not enough privileges...
  } else if (error.response.status == 405) {
    // 405 errors (parse errors)
    console.log('AXIOS: Pass Error 405')
    this.emitter.emit('showAuthorizationError')
    return Promise.reject(error)

    // 429 Too Many Requests...
  } else if (error.response.status == 429) {
    console.log('AXIOS: Pass Error 429')
    this.emitter.emit('showTooManyRequestsError')
    return Promise.reject(error)

    // 403 Permission errors : probaly token expired...
  } else if (error.response.status == 403) {
    console.log('403 Error')

    if (ReloginOnStatus403(error.config)) {
      console.log('AXIOS: ReloginOnStatus403')
      error.response.status = 449
      if (Vue.prototype.pkce.isAuthorized()) {
        await Vue.prototype.refresh_token()
        if (Vue.prototype.pkce.state && Vue.prototype.pkce.state.accessToken) {
          error.config.retoken = true
          return (error.config)
        }
      }

      // Token Refresh, seems not be possible / desired :-(
      console.log('Not Authenticated')
      this.emitter.emit('showAuthenticationWarning')
      return Promise.reject(error)
    }
  }

  // All other errors:
  console.log('Unknown API Request Error')
  console.log(`status: ${error.response.status}`)
  this.emitter.emit('showServiceError')
  return Promise.reject(error)
}


ApiService.mountAxiosInterceptor(axiosErrorHandling)

oAuthEventBus.$on('TokenChanges', jwt => {
  if (jwt) {
    ApiService.setHeader(jwt)
  } else {
    ApiService.removeHeader()
  }
})

export { ApiService, ReloginOnStatus403, Allow400Status };
export default ApiService