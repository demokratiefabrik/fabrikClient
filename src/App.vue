<template>
  <router-view :key="instanceNr" />
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import useAppComposable from './composables/app.composable';

export default defineComponent({
  name: 'App',
  setup() {
    console.log('DEBUG: start of APP.vue init')
    
    // INITIALIZE APP
    const { initialize, instanceNr } = useAppComposable();
    initialize();
    console.log('DEBUG: end of APP.vue init')
    return { instanceNr };
  },
});
</script>
