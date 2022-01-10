import mitt from 'mitt';
const emitter = mitt();

export default function useOAuthEmitter() {
    return emitter;
}