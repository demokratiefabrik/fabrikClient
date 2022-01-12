<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',

  created() {
    console.log('DEBUG created APP.vue')

  },
  mounted() {
    console.log('DEBUG mounted APP.vue')

  }
})
</script>
