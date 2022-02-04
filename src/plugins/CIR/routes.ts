const meta4AssemblyDelegates = { assemblyAcl: ['delegate', 'observer']}
import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [

  {
    name: 'AssemblyHome_CIR',
    path: '/:assemblyIdentifier/cir/',
    component: () => import('/src/plugins/CIR/Layout.vue'),
    children: [
      // Note: Define a route for each stageGroup/=> /stageID/<stage.group>
      // { path: ':stageID/conclusion', name: 'CIR_CONCLUSION', component: () => import('./Conclusion'), meta: meta4AssemblyDelegates },
      // { path: ':stageID/arguments', name: 'CIR_ARGUMENTS', component: () => import('./Arguments'), meta: meta4AssemblyDelegates },
      { path: ':stageID/voice', name: 'CIR_VOICE', component: () => import('./voice.vue'), meta: meta4AssemblyDelegates },
      { path: '', name: 'CIR', component: () => import('/src/pages/Assembly/TOC/TOC.vue'), meta: { hideAssemblyMenu: true, ...meta4AssemblyDelegates } }
    ]
  }
]


export default routes
