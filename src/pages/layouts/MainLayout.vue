<template>
  <q-layout view="hHh Lpr lFf" class="rounded-borders">
    <!-- TODO :style="applyCssVarProfileColor" -->
    <q-header class="text-primary bg-white">
      <!-- "Hidden" Logo -->
      <q-chip
        style="
          position: fixed;
          bottom: 0px;
          left: 0px;
          padding: 1em;
          margin: 0px;
        "
        size="sm"
        color="white"
        text-color="grey"
        class="q-mt-md"
      >
        demokratiefabrik.ch ({{lastRouteString}})
      </q-chip>

      <MainMenu />
    </q-header>

    <!-- CONTENT -->
    <q-page-container>
      <router-view />

      <q-inner-loading :showing="loadingGifVisible" style="z-index: 100">
        <q-spinner-dots size="50px" color="primary" />
        <!-- LABEL does not work with customized icon: label-style="font-size: 1.1em" label="loadingGifLabel" -->
      </q-inner-loading>

      <NotificationBanner />

      <!--TODO v-if="$parent.appInitialized" -->
      <br /><br />
      <Footer />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import MainMenu from './components/MainMenu.vue';
import Footer from './components/Footer.vue';
import NotificationBanner from './components/NotificationBanner.vue';
import { mapGetters } from 'vuex';
import { useStore } from 'vuex';
import useEmitter from 'src/utils/emitter';
// import useAuthComposable from 'src/composables/auth.composable';
import useRouterComposable from 'src/composables/router.composable';

export default defineComponent({
  name: 'MainLayout',
  components: {
    Footer,
    MainMenu,
    NotificationBanner,
  },

  setup() {
    const emitter = useEmitter();
    const store = useStore();
    const { pushR, gotoHome, lastRouteString } = useRouterComposable();
    const loadingGifVisible = ref<boolean>(false);
    emitter.on('loadingGifStackChange', (stack: any) => {
      loadingGifVisible.value = stack.length > 0;
    });

    // console.log('DEBUG setup mainLayout ends')
    return {
      emitter,
      store,
      gotoHome,
      lastRouteString,
      pushR,
      loadingGifVisible
    };
  },

  data() {
    return {
      menuOffset: [0, 3] as number[],
    };
  },

  computed: {
    frontpage(): boolean {
      return this.$route.name == 'home';
    },

    ...mapGetters({
      profileColor: 'profilestore/profileColor',
      lightProfileColor: 'profilestore/lightProfileColor',
      IsManager: 'assemblystore/IsManager',
    }),
  },
});
</script>
<style scoped>
.q-spinner {
  position: absolute !important;
  top: 50vw !important;
}
</style>
