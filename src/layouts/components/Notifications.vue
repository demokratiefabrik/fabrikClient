<template>
  <div>
    <!-- NOTIFIcATIONS DROPDOWN -->
    <q-btn
      stretch
      size="md"
      icon="mdi-bell-outline"
      @click="expandMenu"
      flat
      v-if="false && authorized"
    >
      <!-- // TODO disabled by DW for migration to vue3 -->
      <q-menu anchor="bottom left" self="top left">
        <!-- @hide="onHideDialog" -->
        <q-list
          class="scroll"
          style="max-height: 50vh; min-width: 100px"
          v-if="notifications && notificationsList.length"
        >
          <q-item
            v-for="entry in notificationsList"
            :clickable="NOTIFICATION_ACTIONS.includes(entry.action)"
            :key="entry.id"
            @click="notificationAction(entry)"
          >
            <!-- clickable -->
            <q-item-section side>
              <q-icon
                :name="NOTIFICATION_ICONS[entry.action]"
                :color="entry.is_read ? 'grey' : 'blue'"
              />
            </q-item-section>

            <q-item-section>
              <q-item-label caption style="max-width: 450px">{{
                formatTimeLeft(entry.date_created)
              }}</q-item-label>
              <q-item-label style="max-width: 450px">{{
                $t(`notifications.${entry.action}`, { value: entry.value })
              }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <div
                class="text-grey-8 q-gutter-xs"
                v-if="NOTIFICATION_ACTIONS.includes(entry.action)"
              >
                <q-btn
                  class="gt-xs"
                  size="12px"
                  flat
                  dense
                  round
                  icon="mdi-open-in-new"
                />
              </div>
            </q-item-section>
          </q-item>
        </q-list>

        <q-list
          class="scroll"
          style="max-height: 50vh; min-width: 100px"
          v-if="!notifications || !notificationsList.length"
        >
          <q-item>
            <q-item-section>
              <q-item-label style="max-width: 450px"
                >Für Sie liegt noch keine Nachricht bereit.</q-item-label
              >
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
      <!-- TODO: disabled due to migration  -->
      <!-- <q-badge
        :color="oneUnread ? 'blue' : 'grey'"
        floating
        v-if="notifications && notificationsList.length"
        class="q-mt-sm q-mr-sm"
      >{{ oneUnread ? unreads.length : notificationsList.length }}</q-badge> -->
    </q-btn>

    <q-dialog
      v-model="showDetailView"
      full-height
      :maximized="$q.screen.lt.md ? true : false"
    >
      <q-card class="full-height" style="width: 95%; max-width: 800px">
        <!-- 
        <q-card-section class="row items-center q-pb-none">
          <q-space />
          <q-btn
            icon="mdi-close"
            flat
            round
            dense
            v-close-popup
          />
        </q-card-section> -->

        <!-- <q-card-section class="scroll" v-if="selectedNotification">
          <component
            :is="PeerreviewViewLoader"
            v-on:close-modal="closeModal"
            :notification="selectedNotification"
            :peerreviewID="selectedPeerreviewID"
            :contentID="selectedContentID"
          />
        </q-card-section> -->
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import constants from 'src/utils/constants';
import { mapGetters, useStore } from 'vuex';
import useAssemblyComposable from 'src/composables/assembly.composable';
import useAuthComposable from 'src/composables/auth.composable';
import filters from 'src/utils/filters';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Notifications',

  setup() {
    // console.log('DEBUG setup notifications')
    const {assemblyIdentifier} = useAssemblyComposable();
    const { authorized, userid } = useAuthComposable();
    const { formatTimeLeft } = filters;
    const store = useStore();
    return { store, assemblyIdentifier, authorized, userid, formatTimeLeft };
  },

  data() {
    return {
      numberOfNotifications: 10,
      NOTIFICATION_ICONS: constants.NOTIFICATION_ICONS,
      NOTIFICATION_ACTIONS: constants.NOTIFICATION_ACTIONS,
      selectedNotification: null,
      selectedPeerreviewID: null,
      selectedContentID: null,
      showDetailView: false,
    };
  },

  computed: {
    // username_derivation(): string {
    recentNotifications(): any[] {
      return [];
    },

    // // TODO: Fix this...
    // // https://medium.com/@codetheorist/using-vuejs-computed-properties-for-dynamic-module-imports-2046743afcaf
    // // eslint-disable-next-line vue/return-in-computed-property
    // PeerreviewViewLoader() {
    //   // if (this.selectedPeerreviewID) {
    //   //   return () =>
    //   //     import('src/plugins/VAA/components/PeerReviewDetailLoader.vue');
    //   // } else if (this.selectedContentID) {
    //   //   return () =>
    //   //     import('src/plugins/VAA/components/SalienceDetailLoader.vue');
    //   // }
    // },

    notificationsList(): any[] {
      const notificationsList: any[] = [...Object.values(this.notifications)];
      notificationsList.sort((a, b) => b.id - a.id);
      return notificationsList.slice(0, 10);
    },

    // Disable due to migration vue 3
    // unreads() {
    //   // console.log(this.notificationsList);
    //   return this.notificationsList.filter((x) => x.is_read !== true);
    // },

    // oneUnread() {
    //   return this.unreads.length > 0;
    // },

    ...mapGetters({
      // get_peerreview: "peerreviewstore/get_peerreview",
      // get_content: "contentstore/get_content",
      notifications: 'profilestore/notifications',
    }),
  },
  methods: {
    closeModal() {
      this.showDetailView = false;
    },
    expandMenu() {
      // DISABLE BY migratin vue 3
      // this.$root.monitorLog(constants.MONITOR_NOTIFICATION_SHOW);
      this.showDetailView = false;

      // preload data:
      const preloadContenttrees: any[] = [];
      const preloadAssemblies: any[] = [];
      const preloadPeerreviews: any[] = [];
      this.notificationsList.forEach((notification) => {
        if (
          !!notification.peerreview_id &&
          !!notification.contenttree_id &&
          !preloadPeerreviews.includes(notification.contenttree_id)
        ) {
          preloadPeerreviews.push(notification.contenttree_id);
        }
        if (
          !!notification.assembly_identifier &&
          !preloadAssemblies.includes(notification.assembly_identifier)
        ) {
          preloadAssemblies.push(notification.assembly_identifier);
        }
        if (
          !!notification.contenttree_id &&
          !preloadContenttrees.includes(notification.contenttree_id)
        ) {
          preloadContenttrees.push(notification.contenttree_id);
        }
      });

      preloadAssemblies.forEach((assemblyIdentifier) => {
        this.store.dispatch('assemblystore/syncAssembly', {
          assemblyIdentifier: assemblyIdentifier,
          oauthUserID: this.userid.value,
        });
      });

      preloadContenttrees.forEach((contenttreeID) => {
        this.store.dispatch('contentstore/syncContenttree', {
          assemblyIdentifier: this.assemblyIdentifier,
          contenttreeID,
          oauthUserID: this.userid.value,
        });
      });

      preloadPeerreviews.forEach((contenttreeID) => {
        this.store.dispatch('peerreviewstore/syncPeerreviews', {
          assemblyIdentifier: this.assemblyIdentifier,
          contenttreeID,
          oauthUserID: this.userid.value,
        });
      });
    },

    notificationAction(notification) {
      // Which DetailView should Be opened: 1) Content or 2) Peerreview
      this.selectedContentID = null;
      this.selectedPeerreviewID = null;
      this.selectedNotification = notification;
      // let contenttreeID = notification.contenttree_id;
      let peerreviewID = notification.peerreview_id;
      if (peerreviewID) {
        this.showDetailView = true;
        this.selectedPeerreviewID = peerreviewID;

        // this.get_peerreview({
        //   contenttreeID,
        //   peerreviewID,
        // });
        // this.get_content({
        //   contenttreeID,
        //   contentID,
        // });

        return null;
      }

      // ELSE: IS CONNECTED TO A PUBLIC OR COMMON PROPERTY => SHOW AS SALIENCE LIST ITEM
      this.showDetailView = true;
      let contentID = notification.content_id;

      if (contentID) {
        this.selectedContentID = notification.content_id;
        return null;
      }
    },
  },
});
</script>
