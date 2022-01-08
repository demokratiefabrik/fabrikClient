/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// /* eslint-disable @typescript-eslint/no-unsafe-return */
// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// https://stackoverflow.com/questions/63471824/vue-js-3-event-bus
import { getCurrentInstance } from 'vue'
// declare module '@vue/runtime-core' {
// }
// export interface ComponentCustomProperties {
//     emitter: typeof emitter
// }

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default function useEmitter(): emitter {
  const internalInstance = getCurrentInstance();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const emitter: emitter = internalInstance.appContext.config.globalProperties.emitter;

  return emitter;
}