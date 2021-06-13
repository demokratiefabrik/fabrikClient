
var routes = [

  {
    path: '/:assemblyIdentifier/survey/:stageID', name: 'SURVEY', component: () => import('./Index'), meta: { assemblyAcl: 'delegate' }
  }
]

export default routes
