// Mocks all files ending in `.vue` showing them as plain Vue instances
/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}


// declare module 'vue-router' {

//   // interface Router {
//   //   pushR: (RouteLocationRaw) => void
//   // }

// }


// declare module 'vue-router' {

//   interface IRouter extends Router {
//     pushR: () => []
//   }

// }


// declare module '@vue/runtime-core' {
//   export interface ComponentCustomProperties {
//     $filters: typeof filters;
//     $emitter: typeof emitter;
//     $library: typeof library;
//     $constants: typeof Constants;
//     // $auth: typeof authComposable;
//     $pushR: typeof pushR;
//   }
// }


// import { RouteRecordRaw } from 'vue-router';
// interface IDestinationRoute extends RouteRecordRaw {
// }

// interface IDestinationRoute = RouteRecordRaw{
//   name: string;
//   params: Record<string, unknown>;
// }