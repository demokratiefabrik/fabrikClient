<style scoped>
.topmenuSelected {
  border-top: 2px solid #111;
}
.topmenuDefault {
  border-top: 2px solid #fff;
}
.dropdownSelected {
  border-left: 2px solid #111;
}
.dropdownDefault {
  border-left: 2px solid #fff;
}
</style>
<template>
  <q-toolbar align="center" style="align: center; text-align: center">
    <!-- Left-Align: Small PAges -->
    <!-- <q-toolbar-title
      v-if="$q.screen.lt.md && assemblyName"
      @click="gotoAssemblyHome(assembly)"
      class="cursor-pointer"
      style=" font-weight:400"
    >
      {{assemblyName}}
    </q-toolbar-title> -->
    <!-- {{assemblyName}} -->

    <q-space v-if="$q.screen.gt.sm" />
    <!-- v-if="$q.screen.gt.xs "  -->
    <!-- Center: Large Pages -->
    <!-- v-if="$q.screen.gt.sm && assemblyName" -->

    <!-- TODO uncomment-->
    <!-- @click="gotoAssemblyHome(assembly)" -->
    <q-toolbar-title
      shrink
      v-if="$q.screen.gt.sm && assemblyName"
      class="cursor-pointer"
      style="font-weight: 400"
    >
      {{ assemblyName }}
    </q-toolbar-title>
    <q-space />
    <!-- Extended TOP Menu: (large page or none-assembly page)  -->

    <!-- NOTIFICATION BELL  -->
    <Notifications></Notifications>

    <!-- Expanded Menus: Wide pages  -->
    <template v-if="!is_assembly_page && $q.screen.gt.xs">
      <q-item
        v-for="item in menu"
        clickable
        :label="item.text"
        :class="
          item.to.name == currentRouteName ? 'topmenuSelected' : 'topmenuDefault'
        "
        @click="pushR(item.to)"
        :key="item.text"
        >{{ item.text }}
      </q-item>
    </template>

    <!-- Collapsed menu: Small  pages Or assembly pages  -->
    <template v-if="is_assembly_page || !$q.screen.gt.xs">
      <q-btn size="lg" flat icon="mdi-menu" label="">
        <q-menu>
          <q-list style="min-width: 100px">
            <q-item
              v-for="item in menu"
              clickable
              :key="item.text"
              :class="
                item.to.name == currentRouteName
                  ? 'topmenuSelected'
                  : 'topmenuDefault'
              "
              @click="pushR(item.to)"
              v-close-popup
            >
              <q-item-section>{{ item.text }}</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </template>

    <!-- ACCOUNT DROPDOWN -->
    <!-- <button @click="loginToCurrentPage" v-if="!authorized">Login</button> -->

    <q-btn-dropdown stretch flat v-if="authorized">
      <template v-slot:label>
        <UserAvatar :profile="profile" menu="true"></UserAvatar>
      </template>
      <q-list class="z-max">
        <q-item>
          <q-item-section>
            <q-item-label caption style="max-width: 250px">{{
              username_derivation
            }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          :class="'profile' == currentRouteName ? 'dropdownSelected' : ''"
          @click="gotoProfile()"
          v-if="authorized"
          v-close-popup
        >
          <q-item-section>
            <q-item-label>Sekretariat</q-item-label>
            <q-item-label caption>Angaben zu Ihrem Benutzerkonto</q-item-label>
          </q-item-section>
        </q-item>

        <q-item @click="logout()" clickable class="" v-close-popup>
          <q-item-section v-if="authorized">
            <q-item-label>{{ $t('auth.logout') }}</q-item-label>
            <q-item-label caption>Demokratiefabrik verlassen.</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </q-toolbar>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useAppComposable from 'src/composables/app.composable';
import useAuthComposable from 'src/composables/auth.composable';
import useRouterComposable from 'src/composables/router.composable';
import { mapGetters, mapActions } from 'vuex';
import Notifications from './Notifications.vue';
import UserAvatar from 'src/components/UserAvatar.vue';
import { RouteLocationRaw } from 'vue-router';

export default defineComponent({
  name: 'MainMenu',
  // props: ['assemblyName'],
  components: {
    UserAvatar,
    Notifications,
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setup() {
    const { setHeaderOffset } = useAppComposable();
    const { pushR, gotoProfile } = useRouterComposable();
    const {
      logout,
      authorized,
      getUsernameDerivation,
      // payload,
      // loginToCurrentPage,
    } = useAuthComposable();
    return {
      setHeaderOffset,
      logout,
      pushR,
      gotoProfile,
      authorized,
      // payload,
      getUsernameDerivation,
      // loginToCurrentPage,
    };
  },

  mounted() {
    // TODO: why here?
    this.setHeaderOffset(150);
  },

  data() {
    return {
      menu: [
        {
          text: 'Startseite',
          to: { name: 'home' },
        },
        {
          text: 'News',
          to: { name: 'news' },
        },
        {
          text: 'Hintergrund',
          to: { name: 'background' },
        },
      ],
    };
  },
  computed: {
    currentRouteName: function (): string {
      return this.$route?.name as string;
    },
    // frontpage: function () {
    //   return this.$route.name == 'home';
    // },

    // TODO: methods exist twice!!
    is_assembly_page: function () {
      return (
        this.$route.name === 'assemblies' ||
        !!this.$route.params.assemblyIdentifier
      );
    },

    username_derivation: function () {
      return this.getUsernameDerivation(this.profile);
    },

    ...mapGetters({
      profile: 'profilestore/profile',
      is_in_testing_phase: 'profilestore/is_in_testing_phase',
      UsersDelegateAssemblies: 'publicindexstore/UsersDelegateAssemblies',
      assemblyName: 'assemblystore/assemblyName',
      assembly: 'assemblystore/assembly',
    }),
  },
  methods: {
    ...mapActions({
      // gotoProfile: 'profilestore/gotoProfile',
      // username: "profilestore/username",
      // username_derivate: "profilestore/username_derivate",
    }),

    // apireset(full) {
    //   // TESTING: reset user data of the day or the full assembly session...
    //   if (this.is_in_testing_phase) {
    //     api.apireset(full);
    //     this.$store.dispatch("monitorReset");
    //     setTimeout(() => {
    //       this.logout();
    //     }, 10);
    //   }
    // },
  },
});
</script>
