
const meta4AssemblyPages = { topmenu: 'assemblies_ongoing_list' }
// , acls: ['observe']  // NOT IMPLEMENTED/ NOT NECESSARY=> VUEX 

var routes = [

  {
    path: '/:assemblyIdentifier/textsheet/:stageID/:contenttreeID/',
    name: 'TEXTSHEET', component: () => import('./Index'), meta: meta4AssemblyPages
  }
]

export default routes
