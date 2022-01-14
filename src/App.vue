<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent, watch } from 'vue';

import useAuthComposable from 'src/composables/auth.composable';
import { useRoute} from 'vue-router';
import useAppComposable from './composables/app.composable';
// import { useRouter} from 'vue-router';

export default defineComponent({
  name: 'App',
  setup() {

    // INITIALIZE APP && AUTHENTICATION
    const authComposable = useAuthComposable();
    authComposable.initialize();
    const appComposable = useAppComposable();
    appComposable.initialize();

    // WATCH PAGE PERMISSION
    const currentRoute = useRoute();
    watch(
      () => currentRoute, (currentRoute) => {
        // Page Permission
        authComposable.checkPagePermission(currentRoute)
        // TODO: Monitor Route change
        // this.$root.monitorLog(constants.MONITOR_ROUTE_CHANGE)
        },
      { deep: true });
    return {}
  },
  created() {
    console.log('DEBUG created APP.vue')
  },
  mounted() {
    console.log('DEBUG mounted APP.vue')

  }
})
</script>
