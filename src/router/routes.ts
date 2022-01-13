import { RouteRecordRaw } from 'vue-router';

// const routes: RouteRecordRaw[] = [
//   {
//     path: '/',
//     component: () => import('src/layouts/MainLayout.vue'),
//     children: [{ path: '', component: () => import('pages/Index.vue') }],
//   },
//   // {
//   //   path: '/plot',
//   //   component: () => import('layouts/MainLayout.vue'),
//   //   children: [
//   //     // { path: 'swarm', component: () => import('pages/swarmplot.vue') },
//   //     // { path: 'bar', component: () => import('pages/barplot.vue') },
//   //     // { path: 'beeswarm', component: () => import('src/components/beeswarm/beeswarm.vue') },
//   //   ],
//   // },

//   // Always leave this as last one,
//   // but you can also remove it
//   {
//     path: '/:catchAll(.*)*',
//     component: () => import('pages/Error404.vue'),
//   },
// ];

// export default routes;


// import UserContentDefault from 'src/pages/ContentTree/Default'
import plugin_routes from './plugin_routes'
// const meta4AssemblyPages = { topmenu: 'assemblies_ongoing_list' }
// const meta4AssemblyDelegates = { assemblyAcl: ['delegate', 'observer']}
// const meta4AssemblyManagers = { assemblyAcl: 'manager' }

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [

      { path: '', name: 'home', component: () => import('pages/Index.vue') },
      { path: '/authorization', props: true, name: 'authorization', component: () => import(/* webpackPrefetch: true */ 'pages/Empty.vue') },
      { path: '/logout', name: 'logout', component: () => import(/* webpackPrefetch: true */ 'pages/Auth/Logout.vue') },

      // Encypted Pin (eg.g QC)
      { path: '/t/:ttoken', name: 'tokenlogin', component: () => import('src/plugins/VueOAuth2PKCE/TokenLogin.vue') },
      // Email Token
      { path: '/l/:ltoken', name: 'ltokenlogin', component: () => import('src/plugins/VueOAuth2PKCE/TokenLogin.vue') },

      // { path: '/sekretariat', name: 'profile', props: true, component: () => import(/* webpackPrefetch: true */ 'pages/Auth/Profile.vue') },
      { path: '/hintergrund', name: 'background', component: () => import(/* webpackPrefetch: true */ 'pages/Background.vue') },
      { path: '/news', name: 'news', component: () => import(/* webpackPrefetch: true */ 'pages/News.vue') },
      { path: '/pause', name: 'pause', component: () => import(/* webpackPrefetch: true */ 'pages/Construction.vue') },
      { path: '/impressum', name: 'impressum', component: () => import(/* webpackPrefetch: true */ 'pages/Impressum.vue') },
      // {
      //   path: '/:assemblyIdentifier/agenda/:stageID', name: 'assembly_home_stepper',
      //   component: () => import('pages/Assembly/AssemblyHome.vue'), meta: { ...meta4AssemblyPages, ...meta4AssemblyDelegates }
      // },
      // {
      //   path: '/:assemblyIdentifier/stage/:stageID', name: 'stage',
      //   component: () => import('pages/ContentTree/Default.vue'), meta: meta4AssemblyPages
      // },
      // {
      //   path: '/:assemblyIdentifier/stage/:stageID/:contenttreeID', name: 'contenttree',
      //   component: () => import('pages/ContentTree/Default.vue'), meta: meta4AssemblyPages
      // },
      // {
      //   path: '/:assemblyIdentifier/stage/:stageID/:contenttreeID/:contentID', name: 'content',
      //   component: () => import('pages/ContentTree/Default.vue'), meta: meta4AssemblyPages
      // },
      // {
      //   path: '/:assemblyIdentifier/notification/:contenttreeID/:contentID', name: 'notificationContent',
      //   component: () => import('pages/ContentTree/Notifications.vue')
      // },
      // {
      //   path: '/:assemblyIdentifier/notification/:contenttreeID/:contentID/:peerreviewID', name: 'notificationPeerreview',
      //   component: () => import('pages/ContentTree/Notifications.vue')
      // },

      ...plugin_routes,

      // {
      //   path: '/:assemblyIdentifier', name: 'assembly_home',
      //   component: () => import('pages/Assembly/AssemblyHome.vue'), meta: { ...meta4AssemblyPages, ...meta4AssemblyDelegates }
      // },

      // {
      //   path: '/:assemblyIdentifier/manage', name: 'assembly_manage',
      //   component: () => import('pages/Assembly/AssemblyManage.vue'), meta: meta4AssemblyManagers
      // },
      // {
      //   path: '/:assemblyIdentifier/manage/tree/:stageID/:contenttreeID', name: 'assembly_manage_tree',
      //   component: () => import('pages/Assembly/AssemblyManageTree.vue'), meta: meta4AssemblyManagers
      // },
      // {
      //   path: '/:assemblyIdentifier/manage/summary', name: 'assembly_manage_summary',
      //   component: () => import('pages/Assembly/AssemblyManageSummary.vue'), meta: meta4AssemblyManagers
      // },
      {
        path: '*',
        component: () => import('pages/Error404.vue')
      }
    ]
  }
]

export default routes
