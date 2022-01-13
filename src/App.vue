<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import useAuthComposable from 'src/composables/auth.composable';
// import { useRouter} from 'vue-router';

export default defineComponent({
  name: 'App',
  setup() {

    // INITIALIZE AUTHENTICATION
    const authComposable = useAuthComposable();
    authComposable.initialize();
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
