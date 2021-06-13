<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .9s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
<template>
  <div id="q-app">
    <!-- TODO animation? -->
  <transition name="fade">
    <router-view v-if="!appExitState"
      :key="componentKey"
      ref="maincontent"
    />
  </transition>
  </div>
</template>

<script>
import AppMixin from "src/mixins/app"

export default {
  name: "App",
  mixins: [AppMixin]
}
</script>
