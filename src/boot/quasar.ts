import VueDOMPurifyHTML from 'vue-dompurify-html';
import { boot } from 'quasar/wrappers';
import { Notify } from 'quasar';
import { Screen } from 'quasar'; // lg: 1440, md: 1024,sm: 600,xl: 1920

/** configure / extend Quasar and vue */

const defaultSizes = Screen.sizes;
defaultSizes.md = 950;
defaultSizes.sm = 450;
Screen.setSizes(defaultSizes);

Notify.registerType('nFabrikInfo', {
  icon: 'mdi-announcement',
  color: 'brown',
  textColor: 'white',
  classes: 'glossy',
});
Notify.registerType('nFabrikError', {
  icon: 'mdi-error',
  color: 'red',
  textColor: 'white',
  classes: 'glossy',
});
Notify.registerType('nFabrikWarning', {
  icon: 'mdi-warning',
  color: 'orange-5',
  textColor: 'white',
});

// Anonther Boot Hook.
export default boot(async ({ app }) => {

  // Extensions
  app.use(VueDOMPurifyHTML); // SANITIZER

});
