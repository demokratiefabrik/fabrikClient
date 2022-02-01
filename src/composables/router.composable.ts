/** DEMOKRATIFABRIK RUNTIME VARIABLES */
// import { computed } from 'vue';
import useEmitter from 'src/utils/emitter';
import { useRouter, useRoute, RouteLocationRaw } from 'vue-router';
import { ref, watch } from 'vue';
const emitter = useEmitter();
const instanceNr = ref<number>(0);

const assemblyIdentifier = ref<string | null>(null);
const stageID = ref<number | null>(null);

export default function useRouterComposable() {
  console.log('DEBUG: useRouterComposable::SETUP');

  const router = useRouter();
  const currentRoute = useRoute();

  // to enforce reload of page container!
  const reload = () => {
    instanceNr.value += 1;
  };

  // const routeParams = () =>{ return currentRoute.params}
  // const fullPath = computed(() => currentRoute.fullPath)
  // const routeParams = (): any => {
  //   return currentRoute.params
  // };

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
      // const newRoute = { ...route };
      // Push
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
    // console.log(` goto public profile`)
    // const current = router.currentRoute;
    // const destination_route = { name: current.value.name, params: current.value.params };
    // // console.log(destination_route)

    // if (destination_route.name == 'profile') {
    //   // LayoutEventBus.$emit('reload');
    //   emitter.emit('reload')
    // } else {
    //   router.push({
    //     name: 'profile',
    //     params: { destination_route },
    //   });
    // }

    pushR({ name: 'profile' } as RouteLocationRaw);
  };

  const setAssemblyIdentifier = (identifier: string | null) =>
    (assemblyIdentifier.value = identifier);

  const setStageID = (id: number | null) => (stageID.value = id);

  const clearSession = () => {
    // TODO: not necessary, right?
    setStageID(null);
    setAssemblyIdentifier(null);
  };

  // TODO: move watch outside of setup, right?
  /* Set runtime variables: currently selected assembly and stage */
  watch(currentRoute, () => {
    if (currentRoute.params?.assemblyIdentifier) {
      setAssemblyIdentifier(
        currentRoute?.params?.assemblyIdentifier as string | null
      );

      if (
        currentRoute.params?.stageID !== null &&
        currentRoute.params?.stageID !== undefined
      ) {
        // TODO: redirect to asembly home, when stage is invalid
        setStageID(parseInt(currentRoute.params.stageID as string));
        emitter.emit('showLoading');
      }
    }
  });

  // /* Set runtime variables: currently selected assembly and stage */
  // watch(currentRoute, () => {

  //   if (currentRoute.params?.assemblyIdentifier) {
  //     setAssemblyIdentifier(currentRoute?.params?.assemblyIdentifier as string | null);

  //     if (currentRoute.params?.stageID !== null && currentRoute.params?.stageID !== undefined) {
  //       // TODO: redirect to asembly home, when stage is invalid
  //       setStageID(parseInt(currentRoute.params.stageID as string));
  //       emitter.emit('showLoading');
  //     }
  //   }
  // });

  //     // TODO: Monitor Route change
  // watch(
  //   () => currentRoute, (currentRoute) => {
  //     console.log('route change in APP.vue')
  //     // Page Permission
  //     checkPagePermission(currentRoute)
  //     // this.$root.monitorLog(constants.MONITOR_ROUTE_CHANGE)
  //     },
  //   { deep: true });

  console.log('DEBUG: end of router composable');
  return {
    pushR,
    pushI,
    gotoProfile,
    gotoHome,
    reload,
    clearSession,
    instanceNr,
    assemblyIdentifier,
    stageID,
    setStageID,

    // fullPath,
    // anchor
  };
}
