// eslint-disable-next-line @typescript-eslint/no-var-requires
const { OAuth2AuthCodePKCE } = require('@bity/oauth2-auth-code-pkce');
import { ref, computed, readonly } from 'vue';
import useOAuthEmitter from 'src/plugins/VueOAuth2PKCE/oauthEmitter';
// import { useRouter } from 'vue-router';
// import useRouterComposable from 'src/composables/router.composable';

/// POLYFILL (IE11 for oAuth2 PKCE Module)
// Note: does not work anymore when outsourced in seperate files..
(function (window) {
  if (typeof window.TextEncoder !== 'function') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const TextEncodingPolyfill = require('fast-text-encoding');
    // TODO: above encode has not been tested yet,. text-encoding ist deprecated
    // const TextEncodingPolyfill = require('text-encoding');
    window.TextEncoder = TextEncodingPolyfill.TextEncoder;
    window.TextDecoder = TextEncodingPolyfill.TextDecoder;
  }
  if (typeof window.crypto === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const webcryptoShim = require('webcrypto-shim');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { webcrypto } = webcryptoShim;
  }
  if (typeof window.fetch === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const whatwg = require('whatwg-fetch');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { fetch } = whatwg;
  }
})(window);

export interface IAccessToken {
  token: IAccessTokenPartial;
  scopes: string[];
}
export interface IAccessTokenPartial {
  value: string;
  expiry: Date;
}
export interface IPayload {
  exp: Date;
  iss: string;
  roles: string[];
  sub: number;
  userEmail: boolean;
}

/**
 * OAuth2AuthCodePKCE Configuration
 */
const pkce_config = {
  authorizationUrl: `${process.env.ENV_OAUTH_BASE_URL}/o/authorize/`,
  tokenUrl: `${process.env.ENV_OAUTH_BASE_URL}/o/token/`,
  clientId: process.env.ENV_OAUTH_CLIENT_ID,
  scopes: ['read'], // TODO
  redirectUrl: `${process.env.ENV_DOMAIN}${process.env.ENV_OAUTH_LOCAL_REDIRECTION_URI}`,
  onAccessTokenExpiry(refreshAccessToken) {
    console.log(
      'Expired! Access token needs to be renewed. (onAccessTokenExpiry)',
      refreshAccessToken
    );
    // dont do anything. Refresh when token is needed via api.js
    return false;
  },
  onInvalidGrant() {
    if (!appExitState.value) {
      console.log('TOKEN REFRESH FAILED');
      throw new Error('ErrorInvalidGrant');
    } else {
      // TOKEN Failed. However, user is up to leave the page. (so ignore it...)
      Promise.resolve();
    }
  },
};

// Global Properties and Computeds
const oauthEmitter = useOAuthEmitter();
const pkce = ref<any>(new OAuth2AuthCodePKCE(pkce_config));
// const jwt = computed => <null | string>(null);

const accessToken = ref<null | IAccessToken>(null);
const jwt = computed(() => {
  return accessToken?.value?.token?.value;
});

const brokenSession = ref<boolean>(false);
const appExitState = ref<boolean>(false); // set to true, if app is shutting down (no oauth error message is sent any more...)

const authorized = computed(() => {
  const _authorized = jwt.value && pkce.value.isAuthorized();
  return !!_authorized;
});

const ongoing = computed(() => {
  // During oauth setup: if its not yet clear, if user is logged in (i.e. login process is ongoing)
  return authorized.value === null || authorized.value === undefined;
});

const payload = computed(() => {
  if (!authorized.value || !jwt.value) {
    return null;
  }
  return JSON.parse(window.atob(jwt.value.split('.')[1]));
});

const userid = computed(() => {
  return payload.value?.sub;
});

// export default {
export default function usePKCEComposable() {
  // console.log('DEBUG usePKCEComposable start')
  // const router = useRouterComposable();

  const login = function (
    destination_route: Record<string, unknown> | null = null
  ) {
    // save destiantion route to localstorage
    localStorage.setItem(
      'oauth2authcodepkce-destination',
      JSON.stringify(destination_route)
    );
    pkce.value.fetchAuthorizationCode();
  };

  const refresh_token = async function () {
    // console.log("@@@ START TOKEN REFRESH")
    setOngoingTokenRefresh(true);
    try {
      await pkce.value.exchangeRefreshTokenForAccessToken();
    } catch (error) {
      const errorMessage = (error as Record<'message', string>)
        .message as string;
      switch (errorMessage) {
        case 'ErrorInvalidGrant':
          console.log('Error while refreshing token #83', error);
          oauthEmitter.emit('showAuthorizationInvalidToken');
          break;
        default:
          console.log('Error while refreshing token #84', error);
          oauthEmitter.emit('showServiceError', { nobuttons: true });
          break;
      }
    }
    // TOKEN REFRESH ENDS: Notify the computed properties
    const accessTokenPartial = pkce.value.state
      ?.accessToken as IAccessTokenPartial;
    oauthEmitter.emit('AccessTokenChanges', accessTokenPartial);
    // console.log('accessTokenChanges', accessTokenPartial)
    // oauthEmitter.emit('AfterPayloadChanges', payload.value);
    setOngoingTokenRefresh(false);
  };

  // WAIT FOR ONGOING TOKEN REQUESTS! (wait maximal 5 seconds!)
  const ensureNoRefreshTokenIsOngoing = async function () {
    let iter = 0;
    const maxSeconds = 4;
    return new Promise(function (resolve, reject) {
      (function waitForOngoingTokenRefresh() {
        const val = getOngoingTokenRefresh();
        if (!val) {
          return resolve(true);
        }
        iter++;
        if (iter >= maxSeconds * 10) {
          console.log('(infinity loop)');
          setOngoingTokenRefresh(false);
          return reject('infinity loop');
        }
        console.log('.');
        setTimeout(waitForOngoingTokenRefresh, 100);
      })();
    });
  };

  const getOngoingTokenRefresh = function () {
    const val = localStorage.getItem('oauth2authcodepkce-ongoingrefresh');
    return val == '1';
  };

  const setOngoingTokenRefresh = function (value: boolean) {
    return localStorage.setItem(
      'oauth2authcodepkce-ongoingrefresh',
      value ? '1' : '0'
    );
  };

  const expiredJWT = function () {
    if (!payload.value) {
      return;
    }
    return payload.value.exp < new Date().getTime() / 1000 + 5;
  };

  // Session / PROFILE METHODSbrokenSession.value = state
  const setBrokenSession = (state: boolean) => (brokenSession.value = state);
  const getBrokenSession = () => brokenSession.value;

  /* Refresh token already before a invalid request has been issued */
  const refresh_token_if_required = async function () {
    if (!pkce.value.isAuthorized()) {
      return true;
    }

    if (await expiredJWT()) {
      if (getOngoingTokenRefresh()) {
        await ensureNoRefreshTokenIsOngoing().catch((error) => {
          console.error(error);
          return false;
        });
      } else {
        setOngoingTokenRefresh(true);
      }
      if (expiredJWT()) {
        await refresh_token();
      }
      setOngoingTokenRefresh(false);
    }

    return true;
  };

  const logout = async function (silent = false) {
    console.log('$$$ LOGOUT IN PLUGIN', silent);
    pkce.value.reset();
    console.assert(!pkce.value.isAuthorized());
    pkce.value.setState({});
    accessToken.value = null;

    // wait few seconds...before deleting everything...
    // TODO: try without (a lot changed with Vue3)
    setTimeout(() => {
      // Run it twice: dont know why this is required... but sometimes...
      // console.log(pkce.value.state, 'oauth.logout performed => emit events');
      pkce.value.reset();
      pkce.value.setState({});
      accessToken.value = null;
      oauthEmitter.emit('AccessTokenChanged', null);
      // oauthEmitter.emit('AfterPayloadChanges', null);
      if (!silent) {
        oauthEmitter.emit('AfterLogout');
      }
    }, 10);
  };

  // SHOULD BE RUN ONLY ONCE...
  const initialize = async (): Promise<void> => {
    // Subsribe Event Listener(s)
    oauthEmitter.on('AccessTokenChanges', (localAccessTokenPartial) => {
      if (localAccessTokenPartial && accessToken.value) {
        accessToken.value.token =
          localAccessTokenPartial as IAccessTokenPartial;
      } else {
        accessToken.value = null;
      }
    });

    // Load Starting Value
    if (pkce.value?.state) {
      accessToken.value = {
        token: pkce.value?.state?.accessToken as IAccessTokenPartial,
        scopes: pkce.value?.state?.scopes,
      };

      // Check if initially loaded access token is expired:
      if (pkce.value.isAccessTokenExpired()) {
        await refresh_token();
        console.assert(!pkce.value.isAccessTokenExpired());
      }
    }

    // Catch: oauth server returns
    const hasAuthCode: boolean = await pkce.value
      .isReturningFromAuthServer()
      .catch((potentialError) => {
        console.log(potentialError, '#4385');
        Promise.reject(potentialError);
    });

    // Retrieve Access Token by auth codes
    let localAccessToken: IAccessToken | null = null;
    try {
      localAccessToken = (await pkce.value.getAccessToken()) as IAccessToken;
      // console.log('DEBUG: PKCE --- localAccessToken', !!localAccessToken)
    } catch (error) {
      // console.log('DEBUG: PKCE --- Not logged in, right?', error);
      Promise.resolve();
    }

    // NOTIFY APP That Token is available...
    oauthEmitter.emit('AccessTokenChanges', localAccessToken?.token);
    if (hasAuthCode) {
      oauthEmitter.emit('AfterLogin');
    }else{
      oauthEmitter.emit('RecycleLogin');
    }

    // // TODO: what is this???     // used to be in afterRoute.... 
    // setBrokenSession(false);
  };

  return {
    jwt: readonly(jwt),
    pkce: readonly(pkce),
    authorized: readonly(authorized),
    ongoing: readonly(ongoing),
    payload: readonly(payload),
    userid,
    getBrokenSession,
    setBrokenSession,
    expiredJWT,
    refresh_token_if_required,
    login,
    logout,
    initialize,
  };
}
