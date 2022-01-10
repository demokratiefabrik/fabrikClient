/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
//  * Provides methods for XHR-calls using Axios.
//  */
import axios from 'axios';
import useOAuthEmitter from 'src/plugins/VueOAuth2PKCE/oauthEmitter';
import useEmitter from './emitter';
import useAuthComposable from 'src/composables/auth.composable';

axios.defaults.timeout = 2000;
axios.defaults.baseURL = process.env.ENV_APISERVER_URL;

const emitter = useEmitter();
const authComposable = useAuthComposable();
const HTTP_HEADER = 'Authorization';
const RequestOrigin = 'ApiService';
const ERROR_CODES_TO_RETRY = [400, 500, 502, 503, 501];

const ReloginOnStatus403 = (config: Record<string, undefined>) => {
  return Object.prototype.hasOwnProperty.call(config, 'ReloginOnStatus403') &&
    !config.ReloginOnStatus403
    ? false
    : true;
};
const Allow400Status = (config: Record<string, undefined>) => {
  return Object.prototype.hasOwnProperty.call(config, 'Allow400Status') &&
    config.Allow400Status
    ? true
    : false;
};

// Axios Interceptor: Authorization Error Handling
// ---------------------------

/**
 * Refresh Token: if Api request returns 401
 * This is done by axios intercept method, which everytime checks response.status of each API call.
 */
const mountAxiosInterceptor = (
  onRejected: (error: unknown) => Promise<boolean | Record<string, unknown>>
) => {
  const onFullfilled = (response) => {
    return response;
  };
  axios.interceptors.response.use(onFullfilled, (error: unknown) =>
    onRejected(error)
  );
};

const axiosErrorHandling = async function (
  error
): Promise<boolean | Record<string, unknown>> {
  // enfoce that ApiService Wrapper is used, (and not pure Axios)

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const PREVIOUS_HTTP_ERROR_CODE = error?.config?.PREVIOUS_HTTP_ERROR_CODE;
  const NEW_STATUS = error.response?.status
    ? parseInt(error.response?.status)
    : null;
  console.log(
    'XHR ERROR: PREVIOUS:',
    PREVIOUS_HTTP_ERROR_CODE,
    'NEW:',
    NEW_STATUS
  );

  // No remote connection established
  // Invalid URL or Server not reachable...
  if (!NEW_STATUS && !error?.response) {
    console.log('Network error: empty response set', error);

    // check if two in a row...
    if (PREVIOUS_HTTP_ERROR_CODE != 'NETWORK') {
      // no, this is the first one..
      return { HTTP_ERROR_CODE: 'NETWORK' };
    }
    emitter.emit('showNetworkError');
    return Promise.reject(error);

    // Server Error
  } else if (NEW_STATUS && ERROR_CODES_TO_RETRY.includes(NEW_STATUS)) {
    console.log('error code retrieved', NEW_STATUS);
    // HTTP errors (parse errors, etc..)
    if (Allow400Status(error.config)) {
      // dont raise 400 errors, if this is desired explicitly
      console.log(`AXIOS: Pass Error ${PREVIOUS_HTTP_ERROR_CODE}`);
      return true;
    }

    // check if two in a row...
    if (NEW_STATUS != PREVIOUS_HTTP_ERROR_CODE) {
      // no, this is the first one..
      console.log('ERROR CODES: first trial finished');
      return { HTTP_ERROR_CODE: NEW_STATUS };
    }
    emitter.emit('showServiceError');
    return Promise.reject(error);

    // 405 Authorization errors : probably not enough privileges...
  } else if (error.response.status == 405) {
    // 405 errors (parse errors)
    console.log('AXIOS: Pass Error 405');
    emitter.emit('showAuthorizationError');
    return Promise.reject(error);

    // 429 Too Many Requests...
  } else if (error.response.status == 429) {
    console.log('AXIOS: Pass Error 429');
    emitter.emit('showTooManyRequestsError');
    return Promise.reject(error);

    // 403 Permission errors : probaly token expired...
  } else if (error.response.status == 403) {
    console.log('403 Error');

    if (ReloginOnStatus403(error.config)) {
      console.log('AXIOS: ReloginOnStatus403');
      error.response.status = 449;

      // TODO: global pkce Variable
      // if (Vue.prototype.pkce.isAuthorized()) {
      //     await Vue.prototype.refresh_token()
      //     if (Vue.prototype.pkce.state && Vue.prototype.pkce.state.accessToken) {
      //     error.config.retoken = true
      //     return (error.config)
      //     }
      // }

      // Token Refresh, seems not be possible / desired :-(
      console.log('Not Authenticated');
      emitter.emit('showAuthenticationWarning');
      return Promise.reject(error);
    }
  }

  // All other errors:
  console.log('Unknown API Request Error');
  // console.log(`status: ${error.response.status}`)
  emitter.emit('showServiceError');
  return Promise.reject(error);
};

mountAxiosInterceptor(axiosErrorHandling);

export default function useXHR() {
  // console.log('SETUP Composable AXIOS API ');

  const oauthEmitter = useOAuthEmitter();

  //--- Authorization Header ---
  // ---------------------------

  /* is jwt authorization header set as axios default header*/
  const hasHeader = () => {
    return !!getHeader();
  };

  /**
   * Sets the transmitted JWT token as current default authentication header
   */
  const setHeader = (token: string) => {
    if (token) {
      axios.defaults.headers.common[HTTP_HEADER] = `JWT ${token}`;
    } else {
      delete axios.defaults.headers.common[HTTP_HEADER];
    }
  };

  /**
   * Removes the JWT token as default authentication header
   */
  const removeHeader = () => {
    axios.defaults.headers.common = {};
    console.log('Remove axios header');
  };

  /**
   * Returns currently set default authentication header (without prefix)
   */
  const getHeader = () => {
    if (HTTP_HEADER in axios.defaults.headers.common) {
      const header = axios.defaults.headers.common[HTTP_HEADER];
      if (header) {
        // console.log(header)
        const parts = header.split(' ');
        return parts[1];
      }
    }
    return null;
  };

  //--- Request Types ---
  // --------------------

  const get = async (resource: Record<string, undefined>) => {
    const options = {
      method: 'GET',
      url: resource,
    };
    return await customRequest(options);
  };

  const post = async (
    resource: Record<string, undefined>,
    data: Record<string, undefined>
  ) => {
    const fulldata = {
      method: 'POST',
      url: resource,
      data: data,
    };

    return await customRequest(fulldata);
  };

  const put = async (
    resource: Record<string, undefined>,
    data: Record<string, undefined>
  ) => {
    const fulldata = {
      method: 'PUT',
      url: resource,
      data: data,
    };

    return await customRequest(fulldata);
  };

  const del = async (
    resource: Record<string, undefined>,
    data: Record<string, undefined>
  ) => {
    // async function delete(resource, data) {
    const fulldata = {
      method: 'DELETE',
      url: resource,
      data: data,
    };

    return await customRequest(fulldata);
  };

  const customRequest = async (data: Record<string, unknown>) => {
    data.origin = RequestOrigin;
    data.timeout = 30000; // 30 seconds till timeout

    // if (WithoutAuthHeader(data)) {
    //   // cache the current header and remove it
    //   // console.log('remove XHR header')
    //   temp_oauth_jwt = this.getHeader()
    //   this.removeHeader()
    // }

    if (authComposable.brokenSession.value) {
      console.log(
        '**** authComposable.brokenSession is set to TRUE: no ajax call is executed... ******'
      );
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let response = (await axios(data)) as any;

    // TOKEN SHOULD BE ALRIGHT NOW: DO the secont attempt
    // retoken parameter is set within the interceptor on 403 errors.
    // At this point, the jwt token is already refreshed (within the interceptor)
    if (response.retoken) {
      console.log('PERMISSION ERROR: Initiate a secont attempt');

      // Re-axios (same as before...)  (token should already be refreshed...)
      response = await axios(data);

      // What if the second attempt fails?
      if (response.retoken) {
        console.log('token could not be renewed.. 2nd attempt failed.');
        emitter.emit('showAuthorizationError');
      }
    }

    // retry parameter is set within the interceptor on 400 errors.
    // => DB-Deadlock or Database Data-Integritiy Errors (two parallel requests, that insert a specific entry...)
    if (response.HTTP_ERROR_CODE) {
      console.log(
        'HTTP ERROR: Initiate a second attempt',
        data.HTTP_ERROR_CODE,
        response.HTTP_ERROR_CODE
      );
      data.HTTP_ERROR_CODE = response.HTTP_ERROR_CODE;
      // ReIssue the request
      console.assert(data.url);
      if (data?.url && typeof data.url == 'string' && data?.url.includes('?')) {
        data.url = `${data.url}&rty=1`;
      } else {
        data.url = `${data.url}?rty=1`;
      }
      // Why retry? Database e.g. Deadlocks or integrity errors (parallel requests...)
      response = await axios(data);
    }

    return response;
  };

  // Subscribe to token changes...
  oauthEmitter.on('TokenChanges', (jwt) => {
    if (jwt && typeof jwt === 'string') {
      setHeader(jwt);
    } else {
      removeHeader();
    }
  });

  return {
    axios,
    hasHeader,
    post,
    get,
    del,
    put,
    customRequest,
  };
}
