const meta4AssemblyDelegates = { assemblyAcl: ['delegate', 'observer']}

var routes = [

  {
    name: 'AssemblyHome_VAA',
    path: '/:assemblyIdentifier/vaa/',
    component: () => import('./Layout.vue'),
    children: [
      // Note: Define a route for each stageGroup/=> /stageID/<stage.group>
      { path: ':stageID/conclusion', name: 'VAA_CONCLUSION', component: () => import('./Conclusion'), meta: meta4AssemblyDelegates },
      { path: ':stageID/questions/:contentID', name: 'VAA_QUESTIONS_ENTRY', component: () => import('./QUESTIONS/Questions'), meta: meta4AssemblyDelegates },
      { path: ':stageID/questions', name: 'VAA_QUESTIONS', component: () => import('./QUESTIONS/Questions'), meta: meta4AssemblyDelegates },
      { path: ':stageID/topics', name: 'VAA_TOPICS', component: () => import('./TOPICS/Topics'), meta: meta4AssemblyDelegates },
      { path: '', name: 'VAA', component: () => import('./TOC'), meta: { hideAssemblyMenu: true, ...meta4AssemblyDelegates } }
    ]
  }
]


export default routes
