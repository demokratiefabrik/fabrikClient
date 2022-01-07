<template>
  <q-page class="row">
    <PySwarmPlot></PySwarmPlot>
  </q-page>
</template>

<script lang="ts">
// import { api } from 'src/boot/axios';
import { defineComponent } from 'vue';
import PySwarmPlot from '../components/PySwarmPlot.vue';

export default defineComponent({
  name: 'PageIndex',

  data() {
    return {
      // cirplot: undefined as string | undefined
      msg: 'test',
    };
  },

  components: { PySwarmPlot },
  setup() {
    return {};
  },
});
</script>

<style scoped>
.q-page-container,
q-layout,
q-page,
#q-app,
body {
  width: 100% !important;
  height: 100%;
}
</style>
