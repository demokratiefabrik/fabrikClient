# VueOAuth2PKCE - a Vue 2 Plugin for oAuth2/PKCE Authentification

A Vue-wrapper for @bity/oauth2-auth-code-pkce.\
See: https://www.npmjs.com/package/@bity/oauth2-auth-code-pkce

## Usage

# Install as Vue-Plugin

```
/////////////////////////////////

import VueOAuth2PKCE from 'src/utils/oauth2'

// Prepare Configuration Object
const pkce_config = {
  authorizationUrl: `${process.env.ENV_AUTHORIZE_URL}`,
  tokenUrl: `${process.env.TOKEN_URL}`,
  clientId: process.env.CLIENT_ID,
  scopes: ['read'],
  redirectUrl: `${process.env.ENV_REDIRECTION_URL}`,
  onAccessTokenExpiry(refreshAccessToken) {
    console.log('Expired! Access token needs to be renewed.')
    return refreshAccessToken()
  },
  onInvalidGrant(refreshAuthCodeOrRefreshToken) {
    console.log("TOKEN REFRESH FAILED")
    throw new Error("ErrorInvalidRefreshToken");
  }
}

// Embedd VueOAuth2PKCE plugin
Vue.use(VueOAuth2PKCE, pkce_config)

```

**Start Login Routine**

```
const destination_route = { name: "profile" };
this.oauth.login(destination_route);
```

**Payload**

```
console.log(this.oauth.payload) // full jwt-payload object
console.log(this.oauth.payload.sub) // jwt-payload sub attribute
```

**Logout**

```
Vue.prototype.pkce.reset();
```

**Check Token (and renew if requied)**

```
// Check and Renew token
await Vue.prototype.oauth.refresh_token_if_required()
```

Note: this ensures that not multiple renew-processes run simultaniously

## Hooking

Lifecycle

- **TokenChanges**: Is emitted eveytime, when token changes
- **AfterTokenChanged**: Is emitted eveytime, after token has changed
- **AfterLogin**: Is emitted after successfull Login processes
- **AfterLogout**: Is emitted after the Logout processes

**Hooking Example**

```
oAuthEventBus.$on('TokenChanges', jwt => {
  // Set Axios Authentication Header as soon as token is available
  if (jwt) {
    ApiService.setHeader(jwt)
  } else {
    ApiService.removeHeader()
  }
})
```
