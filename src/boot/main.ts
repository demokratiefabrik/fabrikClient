import VueDOMPurifyHTML from 'vue-dompurify-html'

import { boot } from 'quasar/wrappers';
import filters from 'src/utils/filters';
import useEmitter from 'src/utils/emitter';
import Constants from 'src/utils/constants'
// import useLibraryComposable from 'src/utils/library'
const emitter = useEmitter();

const library = useLibraryComposable()


// CUSTOMMIZATION QUASAR COMPONENTS
//////////////////////////////////

// CONFIGURATION
// outside of a Vue component:
import { Screen } from 'quasar'
// lg: 1440
// md: 1024
// sm: 600
// xl: 1920
const defaultSizes = Screen.sizes;
defaultSizes.md = 950;
defaultSizes.sm = 450;
Screen.setSizes(defaultSizes)

import { Notify } from 'quasar'
import useLibraryComposable from 'src/utils/library';
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


// Anonther Boot Hook.
export default boot(async ({ app }) => {
  // Extensions
  app.use(VueDOMPurifyHTML); // SANITIZER

  // ROOT PROPERTIES
  app.config.globalProperties.emitter = emitter;
  app.config.globalProperties.$filters = filters;
  app.config.globalProperties.$constants = Constants;
  app.config.globalProperties.$library = library;
});

