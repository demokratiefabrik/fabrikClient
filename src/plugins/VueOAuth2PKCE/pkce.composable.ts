// eslint-disable-next-line @typescript-eslint/no-var-requires
const { OAuth2AuthCodePKCE } = require('@bity/oauth2-auth-code-pkce');
import { ref, computed } from 'vue';
import useOAuthEmitter from 'src/plugins/VueOAuth2PKCE/oauthEmitter';

/// POLYFILL (IE11 for oAuth2 PKCE Module)
// Note: does not work anymore when outsourced in seperate files..
(function (window) {
  if (typeof window.TextEncoder !== 'function') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const TextEncodingPolyfill = require('text-encoding');
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
const jwt = ref<null | string>(null);
const accessToken = ref<null | IAccessToken>(null);

const brokenSession = ref<boolean>(false);

const appExitState = ref<boolean>(false); // set to true, if app is shutting down (no oauth error message is sent any more...)

const authorized = computed(() => {
  // TODO: remove this (and test...)
  if (!jwt.value) {
    console.error('IS THIS NEEDED? jwt value backup');
    // THis should not be required, however, you never know;-)
    jwt.value = pkce.value?.state?.accessToken?.value;
  }
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
  console.log(jwt.value, jwt, 'jwt split??');
  return JSON.parse(window.atob(jwt.value.split('.')[1]));
});

const userid = computed(() => {
  return payload.value?.sub;
});

export interface IAccessToken {
  token: { value: string; expiry: Date };
  scopes: string[];
}

// export default {
export default function usePKCEComposable() {
  // console.log('DEBUG usePKCEComposable start')

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
    const jwt = pkce.value.state?.accessToken?.value;
    console.error(
      jwt,
      '......token change after refresh token: is format correct?',
      typeof jwt
    );
    oauthEmitter.emit('TokenChanges', jwt);
    oauthEmitter.emit('AfterTokenChanged', jwt);
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

    // console.log('EXPIRES IN ', Math.round(payload.value.exp - (new Date().getTime() / 1000)) / 60, ' minutes.')
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
    console.log(pkce.value.state);
    pkce.value.setState({});
    jwt.value = null;
    accessToken.value = null;

    // wait few seconds...before deleting everything...
    setTimeout(() => {
      // Run it twice: dont know why this is required... but sometimes...
      // console.log(pkce.value.state, 'oauth.logout performed => emit events');
      pkce.value.reset();
      pkce.value.setState({});
      jwt.value = null;
      accessToken.value = null;
      oauthEmitter.emit('AfterTokenChanged', null);
      if (!silent) {
        oauthEmitter.emit('AfterLogout');
      }
    }, 10);
  };

  // SHOULD BE RUN ONLY ONCE...
  const initialize = async (): Promise<void> => {
    // During Startup
    oauthEmitter.on('TokenChanges', (localAccessToken) => {
      accessToken.value = localAccessToken as IAccessToken | null;
      if (accessToken.value) {
        console.log('New TOKEN', accessToken.value.token.value);
        jwt.value = accessToken.value.token.value;
        console.log('............NEW NEW REFRESH TOKEN ');
      } else {
        jwt.value = null;
      }
    });

    const hasAuthCode = await pkce.value
      .isReturningFromAuthServer()
      .catch((potentialError) => {
        if (potentialError) {
          console.log(potentialError, '#4385');
          Promise.reject(potentialError);
        }
        console.log('catch without potentialError?', potentialError);
      });
    console.log('DEBUG: is returning from auth server:', hasAuthCode);

    // Retrieve Access Token
    let localAccessToken: IAccessToken | null = null;
    try {
      localAccessToken = (await pkce.value.getAccessToken()) as IAccessToken;
    } catch (error) {
      console.log('Not logged in, right?', error);
    }
    console.log('DEBUG: new access token', localAccessToken);

    // NOTIFY APP That Token is available...
    // TODO: dont send tokenChange events when token did not change...(i.e. in case of an error)
    console.log(jwt, '......token change during initizalization');
    oauthEmitter.emit('TokenChanges', localAccessToken);
    oauthEmitter.emit('AfterTokenChanged', localAccessToken);
    console.log(jwt, '......after notificaiton...');
    if (hasAuthCode) {
      oauthEmitter.emit('AfterLogin');
    }
  };
  console.log('DEBUG usePKCEComposable ends');

  return {
    jwt,
    pkce,
    oauthEmitter,
    authorized,
    ongoing,
    payload,
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
