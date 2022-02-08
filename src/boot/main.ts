import { boot } from 'quasar/wrappers';
import filters from 'src/utils/filters';
import useEmitter from 'src/utils/emitter';
import Constants from 'src/utils/constants';
import library  from 'src/utils/library';
import { pluginNames } from 'src/plugins';

// import {
//   useRoute,
//   useRouter,
//   NavigationFailure,
//   RouteLocationRaw,
// } from 'vue-router';

const emitter = useEmitter();
// const library = useLibraryComposable();

/** extend global property */

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $filters: typeof filters;
    $pluginNames: typeof pluginNames;
    $emitter: typeof emitter;
    $library: typeof library;
    $constants: typeof Constants;
  }
}

// Anonther Boot Hook.
export default boot(async ({ app }) => {
  app.config.globalProperties.$emitter = emitter;
  app.config.globalProperties.$filters = filters;
  app.config.globalProperties.$library = library;
  app.config.globalProperties.$pluginNames = pluginNames;
});
