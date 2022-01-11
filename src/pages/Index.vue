<template>
  <q-page class="row">
    HALLO {{pkce.authorized}}
    <br><br><br>
    <input @click="pkce.login()" type="button" value="login"/>
    <PySwarmPlot></PySwarmPlot>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PySwarmPlot from 'src/plugins/CIR/components/PySwarmPlot.vue';
import usePKCEComposable from 'src/plugins/VueOAuth2PKCE/pkce.composable';


export default defineComponent({
  name: 'PageIndex',
  
  setup() {
    console.log('DEBUG: INDEX:VUE');
    const pkce = usePKCEComposable();
    return {pkce, ENV_I18N_LOCALE: process.env.ENV_I18N_LOCALE};
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
