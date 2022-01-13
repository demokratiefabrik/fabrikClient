

import { route } from 'quasar/wrappers';
import useAppComposable from 'src/composables/app.composable';
import {
  // NavigationFailure,
  // RouteLocationRaw,
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
// import { StateInterface } from '../store';
import routes from './routes';
import useEmitter from 'src/utils/emitter';
import usePKCEComposable from 'src/plugins/VueOAuth2PKCE/pkce.composable';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

const emitter = useEmitter();
const {setBrokenSession} = usePKCEComposable()



export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;


  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(
      process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE
    ),
  });


  Router.beforeEach((to, from, next) => {
    // Under Construction
    if (to.params?.assemblyIdentifier) {
      if (parseInt(process.env.ENV_UNDER_CONSTRUCTION as string) == 1) {
        // ALL ASSEMBLY PAGES ARE UNDER CONSTRUCTION
        return next('/pause');
      }
    }
    return next();
  });

  Router.afterEach((to) => { 
    if (to.params?.assemblyIdentifier) {
      const appComposable = useAppComposable();
      appComposable.setAssemblyIdentifier(to?.params?.assemblyIdentifier as string | null);

      if (to.params?.stageID !== null && to.params?.stageID !== undefined) {
        // TODO: redirect to asembly home, when stage is invalid
        // console.log("router after each : new stage", to.params.stageID, to)
        appComposable.setStageID(parseInt(to.params.stageID as string));
        emitter.emit('showLoading');
      }
    }

    setBrokenSession(false);
    // TODO: should this be uncommented?
    // console.log(to, from, store, Vue)
    // store.dispatch('assemblystore/monitor_route_changes', { to, from })
  });

  return Router;
});
