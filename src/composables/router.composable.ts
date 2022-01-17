/** DEMOKRATIFABRIK RUNTIME VARIABLES */
// import { computed } from 'vue';
import useEmitter from 'src/utils/emitter';
import { useRouter, useRoute, RouteRecordRaw} from 'vue-router';
const emitter = useEmitter();

export default function useRouterComposable() {
  const router = useRouter();
  const currentRoute = useRoute();


  // const routeParams = () =>{ return currentRoute.params}
  // const fullPath = computed(() => currentRoute.fullPath)
  // const routeParams = (): any => {
  //   return currentRoute.params
  // };

  /* Reload the page when redirecting to the same page */
  const pushR = (route: RouteRecordRaw) => {

    console.log(route, 'ROUTE in RESOLVE PUSHR')
    const target = router.resolve(route).href;
    // const currentRouteCleaned = ({ name: currentRoute.name, params: currentRoute.params }) as RouteLocationRaw;
    const current = router.resolve(currentRoute).href;
    if (target === current) {
      // Reload
      emitter.emit('reload');
    } else {
      const newRoute = { ...route };
      // Push
      router.push(newRoute);
    }
  };
 
  /* Dont do anything when redirecting to the same page */
  const pushI = (route: RouteRecordRaw) => {
    const target = router.resolve(route).href;
    const current = router.resolve(currentRoute).href;
    if (target !== current) {
      router.push(route);
    }
    // TODO: promise error in router/index?'
    console.log('ignore push route (same site).. ');
  };

  const gotoHome = () => {
    pushR({ name: 'home' } as RouteRecordRaw);
  };

  
 const  gotoProfile = () => {
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
  
  pushR({ name: 'profile' } as RouteRecordRaw); 
}

  /* Scroll To #Anchor */
  // NOT USED
  // const anchor = (anchor: string) => {
  //   // scroll to element
  //   const el = document.querySelector(`a[name=${anchor}]`);
  //   el && el.scrollIntoView();

  //   // account for fixed header
  //   const headerHeight = 200;
  //   const scrolledY = window.scrollY;
  //   if (scrolledY) {
  //     window.scroll(0, scrolledY - headerHeight);
  //   }
  // };

  return {
    pushR,
    pushI,
    gotoProfile,
    gotoHome,
    // fullPath,
    // anchor
  };
}
