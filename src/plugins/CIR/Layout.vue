<template>
  <q-page class="doc_content side_menu">

    <template v-if="showAssemblyMenu">
      <!--      <teleport to="#assemblyMenuContainer">
        <AssemblyMenu />
      </teleport>-->

      <AssemblyMenu />
    </template>

    <router-view></router-view>
  </q-page>
</template>

<script lang="ts">
import useAssemblyComposable from 'src/composables/assembly.composable';
import { defineComponent } from 'vue';
import AssemblyMenu from './AssemblyMenu.vue';
import useCIRComposable from './composables/cir.composable';
export default defineComponent({
  name: 'CIRLayout',
  computed: {},
  setup() {
    // INIIALIZE CIR
    const { assemblyMenuData } = useCIRComposable();
    const { initializePlugin, showAssemblyMenu } = useAssemblyComposable();
    initializePlugin('CIR', assemblyMenuData);
    return { showAssemblyMenu };
  },
  components: { AssemblyMenu },
});
</script>
