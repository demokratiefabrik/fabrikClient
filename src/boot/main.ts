import VueDOMPurifyHTML from 'vue-dompurify-html';
import { boot } from 'quasar/wrappers';
import filters from 'src/utils/filters';
import useEmitter from 'src/utils/emitter';
import Constants from 'src/utils/constants';
import { Notify } from 'quasar';
import useLibraryComposable from 'src/utils/library';
import { Screen } from 'quasar'; // lg: 1440, md: 1024,sm: 600,xl: 1920
import {
  useRoute,
  useRouter,
  NavigationFailure,
  RouteLocationRaw,
} from 'vue-router';
const emitter = useEmitter();
const library = useLibraryComposable();

/** extend global property */


// CUSTOMMIZATION QUASAR COMPONENTS
//////////////////////////////////
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


const pushR = (
  to: RouteLocationRaw
): Promise<NavigationFailure | void | undefined> => {
  const router = useRouter();
  const target = router.resolve(to).href;
  const current = router.resolve(useRoute()).href;
  if (target !== current) {
    // Push
    return router.push(to);
  }
  console.log('same site route!! TODO: check this.');
  return Promise.resolve();
};

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $filters: typeof filters;
    $emitter: typeof emitter;
    $library: typeof library;
    $constants: typeof Constants;
    $pushR: typeof pushR;
  }
}


// Anonther Boot Hook.
export default boot(async ({ app }) => {

  console.log('DEBUG boot main.ts start')


  // Extensions
  app.use(VueDOMPurifyHTML); // SANITIZER

  // ROOT PROPERTIES
  app.config.globalProperties.$emitter = emitter;
  app.config.globalProperties.$filters = filters;
  app.config.globalProperties.$constants = Constants;
  app.config.globalProperties.$library = library;

  /* Reload Page, when redirecting to the same page */
  app.config.globalProperties.$pushR = pushR

  console.log('DEBUG boot main.ts end')

});
