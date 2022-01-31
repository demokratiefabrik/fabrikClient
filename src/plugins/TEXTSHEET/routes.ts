
const meta4AssemblyPages = { topmenu: 'assemblies_ongoing_list' }
// , acls: ['observe']  // NOT IMPLEMENTED/ NOT NECESSARY=> VUEX 
import { RouteRecordRaw } from 'vue-router';
const routes: RouteRecordRaw[] = [
  {
    path: '/:assemblyIdentifier/textsheet/:stageID/:contenttreeID/',
    name: 'TEXTSHEET', component: () => import('/src/plugins/TEXTSHEET/Index.vue'), meta: meta4AssemblyPages
  }
]

export default routes
