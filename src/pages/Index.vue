<template>
  <q-page class="row"><br><br><br>
    <PySwarmPlot></PySwarmPlot>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PySwarmPlot from 'src/plugins/CIR/components/PySwarmPlot.vue';

export default defineComponent({
  name: 'PageIndex',

  // setup() {
  //   return {}
  // },
  
  setup() {
    // const emitter = useEmitter();

    return {ENV_I18N_LOCALE: process.env.ENV_I18N_LOCALE};
  },
  components: { PySwarmPlot },

  data() {
    return {
      // cirplot: undefined as string | undefined
      msg: 'test',
    };
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
