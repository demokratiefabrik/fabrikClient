<template>
  <q-layout
    view="hHh Lpr lFf"
    class="rounded-borders"
  >
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
        demokratiefabrik.ch
      </q-chip>

      <MainMenu />

      <!-- MAIN MENU -->
      <!-- TODO <div v-if="showAssemblyMenu">
        <component
          :is="AssemblyMenuComponentLoader"
          :menuOffset="menuOffset"
          v-if="is_assembly_page"
        />
      </div> -->
      <!-- END DYNAMIC MENU -->
    </q-header>

    <!-- CONTENT -->
    <q-page-container>
      <q-inner-loading :showing="textLoadingVisible" style="z-index: 100">
        <q-spinner-dots size="50px" color="primary" />
      </q-inner-loading>

      <!--TODO  NOTIFICATION BANNER -->
      <q-inner-loading
        :showing="NotificationBannerVisible"
        style="z-index: 100; justify-content: flex-start; padding-top: 100px"
        class="bg-white"
      >
        <div class="q-ma-xl" style="max-width: 400px">
          <h1>
            <q-icon
              v-if="NotificationBannerIcon"
              :name="NotificationBannerIcon"
            />
            {{ NotificationBannerTitle }}
          </h1>
          <div>{{ NotificationBannerBody }}</div>

          <q-chip
            v-if="NotificationBannerButtons.includes('hide')"
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
            v-if="NotificationBannerButtons.includes('home')"
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
            v-if="NotificationBannerButtons.includes('auth')"
            size="md"
            icon="mdi-forward"
            outline
            color="primary"
            text-color="primary"
            class="bg-white cursor-pointer q-mt-md"
            clickable
            @click="clickAuthLink"
          >
            {{ $t('auth.goto_authentication_form') }}
          </q-chip>
          <q-chip
            v-if="NotificationBannerButtons.includes('profile')"
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
            v-if="NotificationBannerButtons.includes('logout')"
            size="md"
            icon="mdi-logout"
            outline
            color="primary"
            text-color="primary"
            class="bg-white cursor-pointer q-mt-md"
            clickable
            @click="$root.logout()"
          >
            {{ $t('auth.logout') }}
          </q-chip>
          <q-chip
            v-if="NotificationBannerButtons.includes('redirect')"
            size="md"
            icon="mdi-forward"
            outline
            color="primary"
            text-color="primary"
            class="bg-white cursor-pointer q-mt-md"
            clickable
            @click="$router.pushR(NotificationBannerRedirectRoute)"
          >
            {{ $t('app.btn_next') }}
          </q-chip>
          <q-chip
            v-if="NotificationBannerButtons.includes('reload')"
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
      </q-inner-loading>

      <!-- MAIN PAGE CONTENT -->
      <!-- <div align="center"> -->
      <router-view  />

      <!--TODO v-if="$parent.appInitialized" -->
      <br /><br />
      <Footer />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue';
import MainMenu from './components/MainMenu';
import Footer from './components/Footer';
import { mapGetters } from 'vuex';

export default defineComponent({
  name: 'MainLayout',
  components: {
    Footer,
    MainMenu,
  },

  data() {
    return {
      // currenttab: "",
      menuOffset: [0, 3],
      textLoadingVisible: false,
      showAssemblyMenu: false,
      NotificationBannerVisible: false,
      NotificationBannerType: 'info',
      NotificationBannerTitle: '',
      NotificationBannerRedirectRoute: {},
      NotificationBannerBody: '',
      NotificationBannerIcon: '',
      NotificationBannerButtons: [],
    };
  },

  /**
   * Ensure that all (error) messages disappear, when route changes...
   **/
  // TODO disabled during vuejs 3 migration
  // watch: {
  //   // if route changes, hide TextLoading
  //   $route(to, from) {
  //     this.hideNotificationBanner();
  //     this.showAssemblyMenu =
  //       this.assemblyType && !to.meta?.hideAssemblyMenu && !this.IsManager;
  //   },
  // },

  computed: {
    applyCssVarProfileColor: function () {
      // This code apply writes the profile color into the css variable profilecolor.
      // the variable is used for the css classes: .bg-profilecolor and .profilecolor
      return {
        '--profilecolor': this.profileColor,
        '--profilecolor-light': this.lightProfileColor,
      };
    },

    // https://medium.com/@codetheorist/using-vuejs-computed-properties-for-dynamic-module-imports-2046743afcaf
    AssemblyMenuComponentLoader() {
      if (this.showAssemblyMenu) {
        // TODO: disabled. due to error
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        // return () => import(`../plugins/${this.assemblyType}/Menu.vue`);
      }
      return () => null;
    },

    frontpage: function () {
      return this.$route.name == 'home';
    },

    is_assembly_page: function () {
      return (
        this.$route.name === 'assemblies' ||
        !!this.$route.params.assemblyIdentifier
      );
    },

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    ...mapGetters({
      profileColor: 'publicprofilestore/profileColor',
      lightProfileColor: 'publicprofilestore/lightProfileColor',
      assemblyName: 'assemblystore/assemblyName',
      assemblyType: 'assemblystore/assemblyType',
      IsManager: 'assemblystore/IsManager',
    }),
  },

  methods: {
    clickAuthLink: function () {
      // const destination_route = { name: "home" };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const destination_route = this.$router.currentRouteObject();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this.oauth.login(destination_route);
    },

    showNotificationBanner(
      type,
      title,
      body,
      icon,
      settimer = false,
      buttons = ['hide'],
      redirectRoute = null
    ) {
      this.NotificationBannerVisible = true;
      this.NotificationBannerBody = body;
      this.NotificationBannerTitle = title;
      this.NotificationBannerType = type;
      this.NotificationBannerIcon = icon;
      this.NotificationBannerButtons = buttons;
      this.NotificationBannerRedirectRoute = redirectRoute;
      if (!this.NotificationBannerRedirectRoute) {
        this.NotificationBannerRedirectRoute = { name: 'home' };
      }

      // TODO: uncomment
      // this.hideLoadingGif();
      if (settimer) {
        setTimeout(() => {
          this.NotificationBannerVisible = false;
        }, 3000);
      }

      // scroll to top
      window.scrollTo(0, 0);
    },

    // pageReload() {
    //   // delete some of the local storage to ensure validity of data...
    //   /* resets the counter to zero */
    //   // Only marginal user data is lost.
    //   // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    //   this.$store.dispatch('monitorReset');
    //   // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    //   this.$store.dispatch('assemblystore/deleteAssemblyStore');
    //   // this.$store.dispatch("contentstore/deleteContentStore");
    //   // this.$store.dispatch("peerreviewstore/deletePeerreviewStore");
    //   // this.$store.dispatch("publicprofilestore/deletePublicProfile", {
    //   window.location.reload();
    // },

    // LOADING GIF
    showLoadingGif() {
      this.textLoadingVisible = true;
      setTimeout(() => {
        this.textLoadingVisible = false;
      }, 5000);
    },

    hideLoadingGif() {
      this.textLoadingVisible = false;
    },

    hideNotificationBanner() {
      this.NotificationBannerVisible = false;
    },
    gotoHome() {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this.$router.pushR({ name: 'home' });
    },
  },

  mounted() {
    // if (this.is_assembly_page) {
    // loadComponent();
    // }

    this.emitter.on('hideLoading', () => {
      // this.hideLoadingGif();
    });

    this.emitter.on('showLoading', () => {
      this.showLoadingGif();
    });

    // enable or disable AssemblyMenu
    // TODO: DW:
    // this.showAssemblyMenu = false;
    this.showAssemblyMenu = this.assemblyType &&
      !this.$router.currentRoute.meta?.hideAssemblyMenu &&
      !this.IsManager;
  }
});
</script>