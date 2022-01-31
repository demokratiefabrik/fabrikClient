import { RouteRecordRaw } from 'vue-router';

export default [

  {
    path: '/:assemblyIdentifier/profile/:stageID',
    name: 'PROFILEUPDATE', component: () => import('/src/plugins/PROFILEUPDATE/Index.vue')
  }
] as RouteRecordRaw[]
