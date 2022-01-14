import { boot } from 'quasar/wrappers';
import filters from 'src/utils/filters';
import useEmitter from 'src/utils/emitter';
import Constants from 'src/utils/constants';
import useLibraryComposable from 'src/utils/library';
// import {
//   useRoute,
//   useRouter,
//   NavigationFailure,
//   RouteLocationRaw,
// } from 'vue-router';

const emitter = useEmitter();
const library = useLibraryComposable();

/** extend global property */



declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $filters: typeof filters;
    $emitter: typeof emitter;
    $library: typeof library;
    $constants: typeof Constants;
  }
}

// Anonther Boot Hook.
export default boot(async ({ app }) => {
  console.log('DEBUG boot main.ts start');
  app.config.globalProperties.$emitter = emitter;
  app.config.globalProperties.$filters = filters;
  app.config.globalProperties.$constants = Constants;
  app.config.globalProperties.$library = library;
});
