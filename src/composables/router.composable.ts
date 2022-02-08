/** DEMOKRATIFABRIK RUNTIME VARIABLES */
import useEmitter from 'src/utils/emitter';
// RouteLocationNormalizedLoaded
import { useRouter, useRoute, RouteLocationRaw, RouteLocationNormalizedLoaded } from 'vue-router';
import { ref, computed } from 'vue';

const emitter = useEmitter();
const instanceNr = ref<number>(0);
const lastRouteString = ref<RouteLocationRaw | null>(null); // the last visited url 
const currentRouteString = ref<RouteLocationRaw | null>(null); // the last visited url 

// TODO: rename to routedAssemblyIdentifier / routedStageID
const assemblyIdentifier = ref<string | null>(null);
const stageID = ref<number | null>(null);

let output: null | any = null;

export default function useRouterComposable() {
  const setup = () => {
    console.log('DEBUG: useRouterComposable::SETUP');

    const router = useRouter();
    const currentRoute = useRoute();

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

    
    const getAssemblyHomeRoute = (assembly): RouteLocationRaw => {
      if (!assembly) {
        return {
          name: 'home',
        } as RouteLocationRaw;
      }

      return {
        name: assembly.type,
        params: { assemblyIdentifier: assembly.identifier },
      } as RouteLocationRaw;
    };

    const getAssemblyManageRoute = (assembly): RouteLocationRaw => {
      if (!assembly) {
        return {
          name: 'home',
        } as RouteLocationRaw;
      }

      return {
        name: 'assembly_manage',
        params: { assemblyIdentifier: assembly.identifier },
      } as RouteLocationRaw;
    };

    const gotoAssemblyHome = (assembly) => {
      const route = getAssemblyHomeRoute(assembly);
      pushR(route);
    };

    const gotoAssemblyManage = (assembly) => {
      const route = getAssemblyManageRoute(assembly);
      pushR(route);
    };

    // const clickBackToAssemblyListButton = (): void => {
    //   // setAssemblyIdentifier(null);
    //   pushR({ name: 'assemblies' });
    // };


    

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
      // gotoStage,
      // clickBackToAssemblyListButton,
      gotoAssemblyManage,
      gotoAssemblyHome,
      getAssemblyHomeRoute,
      getAssemblyManageRoute,  
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
