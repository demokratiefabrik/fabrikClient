const meta4AssemblyDelegates = { assemblyAcl: ['delegate', 'observer']}
import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [

  {
    name: 'AssemblyHome_CIR',
    path: '/:assemblyIdentifier/CIR/',
    component: () => import('/src/plugins/CIR/Layout.vue'),
    children: [
      {
        path: 'textsheet/:stageID/:contenttreeID/',
        name: 'TEXTSHEET__CIR', component: () => import('/src/plugins/TEXTSHEET/Index.vue'), meta: { ...meta4AssemblyDelegates }
      },
      {
        path: 'survey/:stageID',
        name: 'SURVEY__CIR',
        component: () => import('/src/plugins/SURVEY/Index.vue'),
        meta: { ...meta4AssemblyDelegates }
      },
      { path: ':stageID/voice', name: 'VOICE__CIR', component: () => import('./voice.vue'), meta: meta4AssemblyDelegates },
      { path: '', name: 'CIR', component: () => import('/src/pages/Assembly/TOC/TOC.vue'), meta: { hideAssemblyMenu: true, ...meta4AssemblyDelegates } }

      // Note: Define a route for each stageGroup/=> /stageID/<stage.group>
      // { path: ':stageID/conclusion', name: 'CIR_CONCLUSION', component: () => import('./Conclusion'), meta: meta4AssemblyDelegates },
      // { path: ':stageID/arguments', name: 'CIR_ARGUMENTS', component: () => import('./Arguments'), meta: meta4AssemblyDelegates },

    ]
  }
]


export default routes
