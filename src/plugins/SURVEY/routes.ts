
import { RouteRecordRaw } from 'vue-router';
const routes: RouteRecordRaw[] = [


  {
    path: '/:assemblyIdentifier/:assemblyType/survey/:stageID', name: 'SURVEY', component: () => import('/src/plugins/SURVEY/Index.vue'), meta: { assemblyAcl: 'delegate' }
  }
]

export default routes
