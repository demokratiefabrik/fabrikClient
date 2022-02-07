/** DEMOKRATIFABRIK RUNTIME VARIABLES */
import useEmitter from 'src/utils/emitter';
// RouteLocationNormalizedLoaded
import { useRouter, useRoute, RouteLocationRaw, RouteLocationNormalizedLoaded } from 'vue-router';
import { ref, computed } from 'vue';

const emitter = useEmitter();
const instanceNr = ref<number>(0);
const assemblyIdentifier = ref<string | null>(null);
const lastRouteString = ref<RouteLocationRaw | null>(null); // the last visited url 
const currentRouteString = ref<RouteLocationRaw | null>(null); // the last visited url 
const stageID = ref<number | null>(null);

let output: null | any = null;

export default function useRouterComposable() {
  const setup = () => {
    console.log('DEBUG: useRouterComposable::SETUP');

    const router = useRouter();
    const currentRoute = useRoute();
    

    
    /* Reset Notifications when routing...Ensure that all (error) messages disappear, when route changes.. */
    // TODO: assure that this is only run once...
    // watch(currentRoute, (_to, from) => {
    //     lastRoute.value = from
    //     // console.log(lastRoute, 'ROUTE CHANGED....')
    // })

    // to enforce reload of page container!
    const reload = () => {
      instanceNr.value += 1;
    };

    /* Reload the page when redirecting to the same page */
    const pushR = (route: RouteLocationRaw) => {
      // console.log(route, 'ROUTE in RESOLVE PUSHR');
      const target = router.resolve(route).href;
      // const currentRouteCleaned = ({ name: currentRoute.name, params: currentRoute.params }) as RouteLocationRaw;
      const current = router.resolve(currentRoute).href;
      if (target === current) {
        // Reload
        emitter.emit('reload');
      } else {
        router.push(route);
      }
    };

    /* Dont do anything when redirecting to the same page */
    const pushI = (route: RouteLocationRaw) => {
      const target = router.resolve(route).href;
      const current = router.resolve(currentRoute).href;
      if (target !== current) {
        router.push(route);
      }
      // TODO: promise error in router/index?'
      console.log('ignore push route (same site).. ');
    };

    const gotoHome = () => {
      pushR({ name: 'home' } as RouteLocationRaw);
    };

    const gotoProfile = () => {
      pushR({ name: 'profile' } as RouteLocationRaw);
    };

    const currentRouteMeta = computed(
      () => currentRoute?.meta
    );


    const setLastRoute = (route: RouteLocationNormalizedLoaded | null) => {
      
      if (route){
        const newRoute = {
          name: route.name,
          params: route.params,
        } as RouteLocationRaw

        lastRouteString.value = currentRouteString.value
        if (route) {
          currentRouteString.value = newRoute
          // router.resolve(route).href;
        }
      }
    }
    const setAssemblyIdentifier = (identifier: string | null) => assemblyIdentifier.value = identifier;
    const setStageID = (id: number | null) => (stageID.value = id);

    const clearSession = () => {
      // TODO: not necessary, right?
      setStageID(null);
      setAssemblyIdentifier(null);
    };

    return {
      pushR,
      pushI,
      gotoProfile,
      gotoHome,
      reload,
      clearSession,
      setAssemblyIdentifier,
      setStageID,
      setLastRoute,
      instanceNr,
      lastRouteString,
      assemblyIdentifier,
      stageID,
      currentRouteMeta
    };
  };

  if (output === null) {
    output = setup();
  }

  return output
}
