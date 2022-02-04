<template>
  <q-inner-loading
    :showing="!!notificationBanner"
    style="z-index: 100; justify-content: flex-start; padding-top: 100px"
    class="bg-white"
  >
    <div v-if="notificationBanner">
      <div class="q-ma-xl" style="max-width: 400px">
        <h1>
          <q-icon
            v-if="notificationBanner.icon"
            :name="notificationBanner.icon"
          />
          {{ notificationBanner.title }}
        </h1>
        <div>{{ notificationBanner.body }}</div>

        <q-chip
          v-if="notificationBanner.buttons?.includes('hide')"
          size="md"
          icon="mdi-close"
          outline
          color="primary"
          text-color="primary"
          class="bg-white cursor-pointer q-mt-md"
          clickable
          @click="hideNotificationBanner"
        >
          {{ $t('app.btn_close') }}
        </q-chip>
        <q-chip
          v-if="notificationBanner.buttons?.includes('home')"
          size="md"
          icon="mdi-home"
          outline
          color="primary"
          text-color="primary"
          class="bg-white cursor-pointer q-mt-md"
          clickable
          @click="gotoHome"
        >
          {{ $t('app.btn_home') }}
        </q-chip>
        <q-chip
          v-if="notificationBanner.buttons?.includes('auth')"
          size="md"
          icon="mdi-forward"
          outline
          color="primary"
          text-color="primary"
          class="bg-white cursor-pointer q-mt-md"
          clickable
          @click="loginToCurrentPage"
        >
          {{ $t('auth.goto_authentication_form') }}
        </q-chip>
        <q-chip
          v-if="notificationBanner.buttons?.includes('profile')"
          size="md"
          icon="mdi-image-filter-hdr"
          outline
          color="primary"
          text-color="primary"
          class="bg-white cursor-pointer q-mt-md"
          clickable
          @click="hideNotificationBanner"
        >
          {{ $t('auth.goto_profile_page') }}
        </q-chip>
        <q-chip
          v-if="notificationBanner.buttons?.includes('logout')"
          size="md"
          icon="mdi-logout"
          outline
          color="primary"
          text-color="primary"
          class="bg-white cursor-pointer q-mt-md"
          @click="logout()"
          clickable
        >
          {{ $t('auth.logout') }}
        </q-chip>
        <q-chip
          v-if="notificationBanner.redirectRoute"
          size="md"
          icon="mdi-forward"
          outline
          color="primary"
          text-color="primary"
          class="bg-white cursor-pointer q-mt-md"
          clickable
          @click="notificationRedirect()"
        >
          {{ $t('app.btn_next') }}
        </q-chip>
        <q-chip
          v-if="notificationBanner.buttons?.includes('reload')"
          size="md"
          icon="mdi-restart"
          outline
          color="primary"
          text-color="primary"
          class="bg-white cursor-pointer q-mt-md"
          clickable
          @click="pageReload"
        >
          {{ $t('app.btn_reload') }}
        </q-chip>
      </div>
    </div>
  </q-inner-loading>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import useEmitter from 'src/utils/emitter';
import { RouteLocationRaw } from 'vue-router';
// import { INotificationBanner } from 'src/composables/app.composable';
import useAuthComposable from 'src/composables/auth.composable';
import useRouterComposable from 'src/composables/router.composable';
import { INotificationBanner } from 'src/models/layout';

export default defineComponent({
  name: 'NotificationBanner',

  setup() {
    const { logout, loginToCurrentPage } = useAuthComposable();
    const { gotoHome, pushR, reload } = useRouterComposable();

    const emitter = useEmitter();
    const notificationBanner = ref<null | INotificationBanner>(null);
    emitter.on('notificationBannerChange', (banner) => {
      if (banner) {
        notificationBanner.value = banner as INotificationBanner;
        window.scrollTo(0, 0);
      } else {
        notificationBanner.value = null;
      }
    });
    return {
      notificationBanner,
      logout,
      loginToCurrentPage,
      pushR,
      gotoHome,
      reload,
    };
  },

  /**
   * Ensure that all (error) messages disappear, when route changes...
   **/
  watch: {
    $route() {
      this.hideNotificationBanner();
    },
  },

  methods: {
    hideNotificationBanner() {
      this.notificationBanner = null;
    },

    pageReload() {
      // TODO: clean everything carefully... before reloading
      // store.dispatch('appstore/monitorReset');
      // store.dispatch('assemblystore/deleteAssemblyStore');
      // window.location.reload();
      this.reload();
    },

    notificationRedirect() {
      if (this.notificationBanner?.redirectRoute) {
        this.pushR(this.notificationBanner.redirectRoute as RouteLocationRaw);
      }
    },
  },
});
</script>
