
// var routes = [

//   {
//     path: '/:assemblyIdentifier/profile/:stageID', name: 'PROFILEUPDATE', component: () => { console.log("kkkkk"); return import('./Index') }
//     // { path: '/sekretariat', name: 'profile', props: true, component: () => import(/* webpackPrefetch: true */ 'pages/Auth/Profile.vue') },

//   }
// ]

var routes = [

  {
    path: '/:assemblyIdentifier/profile/:stageID',
    name: 'PROFILEUPDATE', component: () => import('./Index')
  }


  // {
  //   path: '/:assemblyIdentifier/profileupdate/:stageID',
  //   component: () => import('./Layout.vue'),
  //   children: [
  //     { path: '', name: 'PROFILEUPDATE', component: () => { console.log("kkkkk"); return import('./Index') }
  //   ]
  // }
]


export default routes
