
import mitt from 'mitt';
const emitter = mitt();


export default function useEmitter() {
    // const internalInstance = getCurrentInstance(); 
    // const emitter = internalInstance?.appContext.config.globalProperties.emitter;

    return emitter;
}