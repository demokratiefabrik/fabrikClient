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
      @click="$root.gotoAssemblyHome(assembly)"
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
    <!-- @click="$root.gotoAssemblyHome(assembly)" -->
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

    <span v-if="!is_assembly_page && $q.screen.gt.xs">
      <q-item
        v-for="item in menu"
        clickable
        :label="item.text"
        :class="
          item.to.name == currentRoute ? 'topmenuSelected' : 'topmenuDefault'
        "
        @click="$router.pushR(item.to)"
        :key="item.text"
        >{{ item.text }}
      </q-item>
    </span>

    <!-- MENU: for assembly views  -->
    <q-btn
      size="lg"
      flat
      icon="mdi-menu"
      label=""
      v-if="is_assembly_page || $q.screen.lt.sm"
    >
      <q-menu>
        <q-list style="min-width: 100px">
          <q-item
            v-for="item in menu"
            clickable
            :key="item.text"
            :class="
              item.to.name == currentRoute
                ? 'topmenuSelected'
                : 'topmenuDefault'
            "
            @click="$router.pushR(item.to)"
            v-close-popup
          >
            <q-item-section>{{ item.text }}</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>

    <!-- ACCOUNT DROPDOWN -->
    <!-- <q-btn-dropdown
      stretch
      flat
      v-if="oauth.authorized"
    >
      <template v-slot:label>
        <UserAvatar
          :profile="public_profile"
          menu="true"
        ></UserAvatar>
      </template>

      <q-list class="z-max">
        <q-item>
          <q-item-section>
            <q-item-label
              caption
              style="max-width:250px"
            >{{ username_derivation }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          :class="'profile'==currentRoute ? 'dropdownSelected' : ''"
          @click="gotoProfile()"
          v-if="oauth.authorized"
          v-close-popup
        >
          <q-item-section>
            <q-item-label>Sekretariat</q-item-label>
            <q-item-label caption>Angaben zu Ihrem Benutzerkonto</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          v-if="oauth.authorized && UsersDelegateAssemblies"
          :class="'profile'==currentRoute ? 'dropdownSelected' : ''"
          @click="$root.gotoAssemblyHome(UsersDelegateAssemblies[0])"
          v-close-popup
        >
          <q-item-section>
            <q-item-label>Eingang</q-item-label>
            <q-item-label caption>Zur Könizer Demokratiefabrik</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          @click="$root.logout()"
          clickable
          class=""
          v-close-popup
        >
          <q-item-section v-if="oauth.authorized">
            <q-item-label>{{$t('auth.logout')}}</q-item-label>
            <q-item-label caption>Demokratiefabrik verlassen.</q-item-label>
          </q-item-section>
        </q-item>

      </q-list>
    </q-btn-dropdown> -->
  </q-toolbar>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useAppComposable from 'src/composables/app.composable';
import { mapGetters, mapActions } from 'vuex';
// import UserAvatar from 'src/components/UserAvatar';
// import api from 'src/utils/api';
import Notifications from './Notifications.vue';

export default defineComponent({
  name: 'MainMenu',
  // props: ['assemblyName'],
  components: {
    // UserAvatar,
    Notifications
  },

  setup() {
    const appComposable = useAppComposable();
    return { appComposable };
  },
  mounted() {
    // TODO: why here?
    this.appComposable.setHeaderOffset(150);
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
    currentRoute: function () {
      return this.$route.name;
    },
    frontpage: function () {
      return this.$route.name == 'home';
    },

    // TODO: methods exist twice!!
    is_assembly_page: function () {
      return (
        this.$route.name === 'assemblies' ||
        !!this.$route.params.assemblyIdentifier
      );
    },

    username_derivation: function () {
      return this.appComposable.username_derivation(this.public_profile);
    },

    ...mapGetters({
      public_profile: 'publicprofilestore/get_public_profile',
      UsersDelegateAssemblies: 'publicindexstore/UsersDelegateAssemblies',
      is_in_testing_phase: 'publicprofilestore/is_in_testing_phase',
      assemblyName: 'assemblystore/assemblyName',
      assembly: 'assemblystore/assembly',
    }),
  },
  methods: {
    ...mapActions({
      gotoProfile: 'publicprofilestore/gotoProfile',
      // username: "publicprofilestore/username",
      // username_derivate: "publicprofilestore/username_derivate",
    }),

    // apireset(full) {
    //   // TESTING: reset user data of the day or the full assembly session...
    //   if (this.is_in_testing_phase) {
    //     api.apireset(full);
    //     this.$store.dispatch("monitorReset");
    //     setTimeout(() => {
    //       this.oauth.logout();
    //     }, 10);
    //   }
    // },
  },
});
</script>
