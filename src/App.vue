<template>
  <router-view :key="instanceNr"/>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import useAppComposable from './composables/app.composable';

export default defineComponent({
  name: 'App',
  setup() {
    // INITIALIZE APP
    const appComposable = useAppComposable();
    appComposable.initialize();
    return {instanceNr: appComposable.instanceNr}
  }
})
</script>
