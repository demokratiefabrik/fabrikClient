import Vue from 'vue'

// APP CONSTANTS
/////////////////////////////////
import { runtimeStore } from "src/store/runtime.store"
import Constants from 'src/utils/constants'
Vue.prototype.Constants = Constants

// CONFIGURATION
// outside of a Vue component:
import { Screen } from 'quasar'
// lg: 1440
// md: 1024
// sm: 600
// xl: 1920
const defaultSizes = Screen.sizes;
defaultSizes.md = 950;
// defaultSizes.md = 850;
defaultSizes.sm = 450;
Screen.setSizes(defaultSizes)
// console.log("kkkkkkkkkkkkkkkkkk", defaultSizes)
// 
// SANITIZER
/////////////////////////////////
import VueDOMPurifyHTML from 'vue-dompurify-html'
Vue.use(VueDOMPurifyHTML, {
  namedConfigurations: {
    'alink': {
      ADD_ATTR: ['target'],
    }
  }
})


// GLOBAL METHODS
/////////////////////////////////

// Add Object filter: helper...
//.filter only works for lists but not for objects...
Object.filter = (obj, predicate) => Object.keys(obj)
  .filter(key => predicate(obj[key]))
  .reduce((res, key) => (res[key] = obj[key], res), {});

/* Returns length of a object/list, while handling null as 0. 
TODO: same as object?.length rigth?
*/
Vue.prototype.$nLength = function (object1) {
  if (object1 === null) {
    return (0)
  }
  return (object1.length)
}
Vue.prototype.$loaded = function (object1) {
  return object1 !== null && object1 !== undefined
}

// 
Vue.prototype.$sample = function (array) {
  return array[Math.floor(Math.random() * array.length)];
}

Vue.prototype.$pushSorted = function (children, toAdd) {
  if (!toAdd.content.order_position) {
    children.push(toAdd);
    return (children);
  }
  function getIndex(children, toAdd) {
    const idx = children.findIndex(
      (x) => x.content.order_position > toAdd.content.order_position
    );
    return idx === -1 ? children.length : idx;
  }

  const ix = getIndex(children, toAdd);
  children.splice(ix, 0, toAdd);
  return children;
}


Vue.prototype.$getOffsetTop = element => {
  let offsetTop = 0;
  while (element) {
    offsetTop += element.offsetTop;
    element = element.offsetParent;
  }
  return offsetTop;
}


// CUSTOMMIZATION QUASAR COMPONENTS
//////////////////////////////////
import { Notify } from 'quasar'
Notify.registerType('nFabrikInfo', {
  icon: 'mdi-announcement',
  color: 'brown',
  textColor: 'white',
  classes: 'glossy'
})

Notify.registerType('nFabrikError', {
  icon: 'mdi-error',
  color: 'red',
  textColor: 'white',
  classes: 'glossy'
})

Notify.registerType('nFabrikWarning', {
  icon: 'mdi-warning',
  color: 'orange-5',
  textColor: 'white',
})


// LOAD AUTH
/////////////////////////////////
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
    console.log('Expired! Access token needs to be renewed. (onAccessTokenExpiry)', refreshAccessToken)
    // dont do anything. Refresh when token is needed via api.js
    // return refreshAccessToken()
    return false;
  },
  onInvalidGrant(refreshAuthCodeOrRefreshToken) {
    if (!runtimeStore.appExitState) {
      console.log("TOKEN REFRESH FAILED")
      throw new Error("ErrorInvalidGrant");
    } else {
      // TOKEN Failed. However, user is up to leave the page. (so ignore it...)
      Promise.resolve()
    }
  }
}
import VueOAuth2PKCE from 'src/plugins/VueOAuth2PKCE'
Vue.use(VueOAuth2PKCE, pkce_config)


// LOAD ASSEMBLY PLUGINS
Vue.prototype.$assemblyTypes = [];
import AssemblyPluginVAA from 'src/plugins/VAA'
Vue.use(AssemblyPluginVAA)
