var routes = [

  {
    name: 'AssemblyHome_VAA',
    path: '/:assemblyIdentifier/vaa/',
    component: () => import('./Layout.vue'),
    children: [
      // Note: Define a route for each stageGroup/=> /stageID/<stage.group>
      { path: ':stageID/conclusion', name: 'VAA_CONCLUSION', component: () => import('./Conclusion'), meta: { assemblyAcl: 'delegate' } },
      { path: ':stageID/questions/:contentID', name: 'VAA_QUESTIONS_ENTRY', component: () => import('./QUESTIONS/Questions'), meta: { assemblyAcl: 'delegate' } },
      { path: ':stageID/questions', name: 'VAA_QUESTIONS', component: () => import('./QUESTIONS/Questions'), meta: { assemblyAcl: 'delegate' } },
      { path: ':stageID/topics', name: 'VAA_TOPICS', component: () => import('./TOPICS/Topics'), meta: { assemblyAcl: 'delegate' } },
      // { path: 'preparation', name: 'VAA_PREPARATION', component: () => import('./Preparation') },
      { path: '', name: 'VAA', component: () => import('./TOC'), meta: { hideAssemblyMenu: true, assemblyAcl: 'delegate' } }
    ]
  }
]


export default routes
