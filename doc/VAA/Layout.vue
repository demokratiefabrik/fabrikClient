<template>
  <q-page class="doc_content side_menu">
    <router-view></router-view>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'VAALayout',
  // TODO: load here the assembly mixin?
  computed: {
    // ready() {
    // }
  },
});
</script>
