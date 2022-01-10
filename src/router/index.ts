/* eslint-disable @typescript-eslint/ban-ts-comment */
import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import { StateInterface } from '../store';
import routes from './routes';

import useAppComposable from 'src/composables/app.composable';
import useEmitter from 'src/utils/emitter';
const appComposable = useAppComposable();
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */



const emitter = useEmitter();


export default route<StateInterface>(function (/* { store, ssrContext } */) {
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
    if (to.params?.assemblyIdentifier) {
      // console.log(process.env.ENV_UNDER_CONSTRUCTION, "kkkkkkk")
      // @ts-ignore
      if (parseInt(process.env.ENV_UNDER_CONSTRUCTION) == 1) {
        // ALL ASSEMBLY PAGES ARE UNDER CONSTRUCTION
        return next('/pause');
      }
    }

    return next();
  });

  Router.afterEach((to) => {
    if (to.params?.assemblyIdentifier) {
      // @ts-ignore
      appComposable.setAssemblyIdentifier(to.params.assemblyIdentifier);

      if (to.params?.stageID !== null && to.params?.stageID !== undefined) {
        // TODO: redirect to asembly home, when stage is invalid

        // console.log("router after each : new stage", to.params.stageID, to)
        // @ts-ignore
        appComposable.setStageID(to.params.stageID);
        emitter.emit('showLoading');
      }
    }

    // reset brokenSession Error
    // @ts-ignore
    appComposable.setBrokenSession(false);

    // console.log(to, from, store, Vue)
    // store.dispatch('assemblystore/monitor_route_changes', { to, from })
  });

  /* Get Object of current route/page (including name and params) */
  // @ts-ignore
  Router.currentRouteObject = function () {
    // @ts-ignore
    return { name: this.currentRoute.name, params: this.currentRoute.params };
  };

  /* Reload Page, when redirecting to the same page */
  // @ts-ignore
  Router.pushR = function (route) {
    const target = this.resolve(route).href;

    // @ts-ignore
    const current = this.resolve(this.currentRouteObject()).href;
    if (target === current) {
      // Reload
      emitter.emit('reload');
    } else {
      // Push
      this.push(route);
    }
  };

  /* Dont do anything when redirecting to the same page */
  // @ts-ignore
  Router.pushI = function (route) {
    const target = this.resolve(route).href;
    // @ts-ignore
    const current = this.resolve(this.currentRouteObject()).href;
    if (target !== current) {
      this.push(route);
    }
    console.log('TODO: promise error in router/index?');
    console.log('ignore push route (same site).. ');
  };

  /* Scroll To Anchor */
    // @ts-ignore
    Router.anchor = (anchor) => {
    // scroll to element
    const el = document.querySelector(`a[name=${anchor}]`);
    console.log(el, 'el');
    el && el.scrollIntoView();

    // account for fixed header
    const headerHeight = 200;
    const scrolledY = window.scrollY;
    if (scrolledY) {
      window.scroll(0, scrolledY - headerHeight);
    }
  };
  return Router;
});
