/* eslint-disable @typescript-eslint/require-await */
import { boot } from 'quasar/wrappers'
// import { Notify} from 'quasar'

import filters from 'src/utils/filters'

export default boot(async ({ app }) => {   
//   const notifyError = () => {

//     Notify.create({
//           message: 'Jim just pinged you.',
//           color: 'primary',
//           avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
//           actions: [
//               { label: 'Reply', color: 'yellow', handler: () => { /* ... */ } },
//               { label: 'Dismiss', color: 'white', handler: () => { /* ... */ } }
//             ]
//           })

//   }

 app.config.globalProperties.$filters = filters 

})
