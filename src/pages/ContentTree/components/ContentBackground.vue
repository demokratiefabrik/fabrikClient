<template>
  <q-dialog v-model="toolbar" v-if="toolbar">
    <q-card class="full-width">
      <q-toolbar>
        <q-toolbar-title>{{ obj.content.title }}</q-toolbar-title>

        <q-btn flat round dense icon="mdi-close" v-close-popup />
      </q-toolbar>

      <q-tabs
        v-model="tab"
        dense
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="content" label="Beitrag" />
        <q-tab name="history" label="Verlauf" />
        <q-tab
          name="creator"
          label="Autor"
          v-if="!obj.content.given_property"
        />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <!-- AUTHOR -->
        <q-tab-panel name="creator">
          <UserInfo
            v-on:user-locked="locked = true"
            :profile="profile"
            :locked="locked"
            :stats="userStats"
          />
        </q-tab-panel>

        <!-- CONTENT -->
        <q-tab-panel name="content">
          <q-card-section v-if="contentStats">
            <!-- STATS -->
            <q-list>
              <q-item>
                <q-item-section top>
                  <q-item-label> Art des Beitrags </q-item-label>
                </q-item-section>

                <q-item-section side>
                  {{ content_type }}
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section top>
                  <q-item-label> Besitz-Verhältnisse </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-item-label class="text-right" style="width: 70%">
                    <span v-if="obj.content.locked">
                      Der Beitrag wurde von den Organisatoren blockiert. Es
                      können keine Änderungen mehr vorgenommen werden.
                    </span>
                    <span v-else-if="obj.content.type == 'UPDATEPROPOSAL'"
                      >Der Beitrag wurde automatisch aufgrund eines
                      eingegangenen Verbesserungsvorschlags erstellt.</span
                    >
                    <span v-else-if="obj.content.common_property"
                      >Der Beitrag gehört allen. Alle können einen
                      Verbesserungsvorschlag einreichen.</span
                    >
                    <span v-else-if="obj.content.given_property"
                      >Der Beitrag wurde von den Organisatoren erstellt. Er kann
                      nicht verändert werden.</span
                    >
                    <span v-else-if="obj.content.private_property"
                      >Der Beitrag ist in Privatbesitz. Nur der Eigentümer und
                      die Organisatoren (im Falle einer Verletzung des
                      Verhaltenskodex) können ihn ändern oder löschen.
                    </span>
                  </q-item-label>

                  <q-item-label
                    caption
                    v-if="permissions.length"
                    style="width: 60%"
                    class="text-right"
                  >
                    Sie können {{ permissions.join(', ') }}.
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label> Erstellung </q-item-label>
                </q-item-section>

                <q-item-section side>
                  {{ formatDate_obj_content_date_created }}
                </q-item-section>
              </q-item>

              <q-item v-if="obj.content.type !== 'UPDATEPROPOSAL'">
                <q-item-section> Reichweite </q-item-section>

                <q-item-section side v-if="contentStats?.PC">
                  <q-item-label
                    >{{ contentStats.PC }}
                    {{
                      contentStats.PC == 1 ? 'Teilnehmer.in' : 'Teilnehmende'
                    }}</q-item-label
                  >
                </q-item-section>
                <q-item-section side v-if="!contentStats.PC">
                  <q-item-label>Noch nicht berrechnet</q-item-label>
                </q-item-section>
              </q-item>

              <q-item v-if="obj.content.type !== 'UPDATEPROPOSAL'">
                <q-item-section top>
                  Durchschnittliche Zustimmung
                </q-item-section>
                <q-item-section side v-if="loaded(contentStats.RA)">
                  <q-item-label>{{
                    contentStats.RC ? Math.round(contentStats.RA) + '%' : '-'
                  }}</q-item-label>
                  <q-item-label caption
                    >({{ contentStats.RC }} Voten)</q-item-label
                  >
                </q-item-section>
                <q-item-section side v-if="!loaded(contentStats.RA)">
                  <q-item-label>Noch nicht berechnet</q-item-label>
                  <q-item-label caption>&nbsp;</q-item-label>
                </q-item-section>
              </q-item>

              <q-item v-if="obj.content.type !== 'UPDATEPROPOSAL'">
                <q-item-section top> Beigemesssene Relevanz </q-item-section>

                <q-item-section side v-if="loaded(contentStats.SA)">
                  <q-item-label>{{
                    contentStats.SC && Number.isInteger(contentStats.SA)
                      ? Math.round(contentStats.SA) + '%'
                      : '-'
                  }}</q-item-label>
                  <q-item-label caption>{{
                    contentStats.SC && Number.isInteger(contentStats.SA)
                      ? `(${contentStats.SC} Voten)`
                      : ''
                  }}</q-item-label>
                </q-item-section>
                <q-item-section side v-if="!loaded(contentStats.SA)">
                  <q-item-label>Noch nicht berechnet</q-item-label>
                  <q-item-label caption>&nbsp;</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-tab-panel>

        <!-- HISTORY -->
        <q-tab-panel name="history">
          <q-card-section>
            <q-list v-if="history">
              <ContentVersionItem
                v-for="version in history"
                :key="version.id"
                :profile="version.user_profile"
                :changeset="version.changeset"
              />
              <ContentVersionItem
                :profile="profile"
                :customText="`Erstellt am ${obj.content.date_created_formatted}`"
              />

              <!-- <q-item v-for="version in history" :key="version.id"> -->
              <!-- 
              <q-item>
                <q-item-section avatar>
                  <q-avatar
                    icon="mdi-image-filter-hdr"
                    :style="{
                      'background-color': profile ? profile.CO : 'inherit',
                    }"
                    :text-color="profile ? 'white' : 'primary'"
                    class="q-mr-sm"
                  >
                    <q-tooltip
                      >{{ profile.username_formatted) }}
                      {{ profile.username_derivation_formatted  }}</q-tooltip
                    >
                  </q-avatar>
                  <span class="text-bold">{{ profile.username_formatted }}</span>
                </q-item-section>

                <q-item-section>
                  <q-item-label>
                    Erstellt am {{ formatDate_obj_content_date_created }}
                  </q-item-label>
                </q-item-section>

              </q-item> -->
            </q-list>
          </q-card-section>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-dialog>

  <!-- </div> -->
  <!-- 
<div class="col-7">Revisions</div>
<div class="col-5">
@APS202 20.02.2020<br>
@EPU111 20.02.2020</div>
                    </div>
</div>
<div class="q-pa-md doc-contenttree" width="400px">
    <q-badge color="blue">Peer Review</q-badge>
    <div class="row items-start">
      <div class="col-7">Acceptance:</div>
      <div class="col-5">70%</div>
    </div>
    <div class="row items-start">
      <div class="col-7">Reviewers:</div>
      <div class="col-5">3</div>
    </div>
  </div>
<div class="q-pa-md doc-contenttree" width="400px">
    <q-badge color="blue">Overall Interactions</q-badge>
</q-btn> -->
  <!-- </span> -->
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import UserInfo from 'src/components/UserInfo.vue';
import useLibraryComposable from 'src/utils/library';
// import { runtimeStore } from 'src/store/runtime.store';
import api from 'src/utils/api';
import constants from 'src/utils/constants';
import useMonitorComposable from 'src/composables/monitor.composable';
import useAssemblyComposable from 'src/composables/assembly.composable';
import useAuthComposable from 'src/composables/auth.composable';

interface IVersionEntry {
  user_profile: any;
  date: string;
  id: number;
  profile: any;
  changeset: any;
  date_formatted?: string;
}

export default defineComponent({
  setup() {
    const { monitorLog } = useMonitorComposable();
    const { assemblyIdentifier } = useAssemblyComposable();
    const { loaded } = useLibraryComposable();
    const { getUsername, getUsernameDerivation } = useAuthComposable();

    return {
      loaded,
      assemblyIdentifier,
      monitorLog,
      getUsernameDerivation,
      getUsername,
    };
  },

  name: 'ContentBackground',
  props: ['obj'],
  components: { UserInfo },
  data() {
    return {
      profile: this.obj?.creator,
      toolbar: false,
      loading: false,
      userStats: null,
      locked: null as boolean | null,
      history: null as IVersionEntry[] | null,
      contentStats: null as any,
      tab: 'content',
      // TYPE_LABELS: constants.TYPE_LABELS,
    };
  },

  computed: {
    permissions(): string[] {
      const permissions = [
        this.obj.content.acl.includes('add') ? 'den Beitrag kommentieren' : '',
        this.obj.content.acl.includes('modify')
          ? 'den Beitrag bearbeiten oder löschen'
          : '',
        this.obj.content.acl.includes('contribution_propose')
          ? 'einen Verbesserungsvorschlag einreichen'
          : '',
      ];
      return permissions.filter((txt) => !!txt);
    },

    formatDate_obj_content_date_created(): string | undefined {
      return this.$filters.formatDate(this.obj.content.date_created);
    },

    content_type(): string | null {
      if (this.obj.content) {
        // console.log(
        //   this.obj.content.type,
        //   constants.TYPE_LABELS,
        //   'assert failed..'
        // );
        // console.assert(constants.TYPE_LABELS[this.obj.content.type]);
        return constants.TYPE_LABELS[this.obj.content.type];
      }

      return null;
      // const type = this.obj?.content.type;
      // switch (this.obj?.content.type) {
      //   case "COMMENT":
      //     return "Kommentar";
      //   case "QUESTION":
      //     return "Frage eines Teilnehmenden";
      //   case "VAA_TOPIC":
      //     return "Themengebiet";
      //   case "VAA_QUESTION":
      //     return "smartvote-Frage";
      //   default:
      //     return this.obj?.content.type;
      // }
    },
  },

  methods: {
    // get_username(profile) {
    //   return this.$root.username(profile);
    // },
    // get_username_derivation: function (profile) {
    //   return this.$root.username_derivation(profile, true);
    // },

    humanReadable(changeset) {
      const fieldsNotToIgnore = ['title', 'text', 'parent_id'];
      changeset = changeset.filter((change) =>
        fieldsNotToIgnore.includes(change[0])
      );
      return changeset.map((change) => this.humanReadableChange(change));
    },

    humanReadableChange(change) {
      // convert values
      const dateFields = ['date_modified'];
      let func = (x) => {
        return x;
      };

      if (dateFields.includes(change[0])) {
        func = this.$filters.formatDate;
      }
      change[1][0] = func(change[1][0]);
      change[1][1] = func(change[1][1]);

      // convert field labels
      const labels = {
        date_modified: 'Datum',
        title: 'Titel',
        type: 'Typ',
        parent_id: 'Angehängt bei',
        text: 'Text',
      };

      if (change[0] in labels) {
        change[0] = labels[change[0]];
      }
      return change;
    },
  },

  /**
   * Ensure that all (error) messages disappear, when route changes...
   **/
  watch: {
    // if route changes, hide TextLoading
    toolbar(newState) {
      console.assert(this.obj.content.id);
      this.monitorLog(constants.MONITOR_DIALOG_CONTENT_BACKGROUND, {
        contentID: this.obj.content.id,
      });

      if (newState) {
        // Get Content Detail Information... from oauth server
        api
          .contentDetail(this.assemblyIdentifier, this.obj.content.id)
          .then((response) => {
            if (response.data) {
              // Okay
              this.contentStats = response.data.statistic.content;
              this.userStats = response.data.statistic.user;
              this.history = response.data.history as IVersionEntry[];
              this.locked = response.data.locked;

              // prepare human content
              this.history.forEach((version: IVersionEntry) => {
                version.date_formatted = this.$filters.formatDate(version.date);
                if (version?.profile) {
                  version.profile.username_derivation_formatted =
                    this.getUsernameDerivation(version.profile);
                  version.profile.username_formatted = this.getUsername(
                    version.profile
                  );
                }
              });
            } else {
              // Error Message
              this.$q.notify({
                type: 'nFabrikError',
                message:
                  'Die Hintergrund Informationen zu diesem Beitrag konnte nicht geladen werden. Bitte informieren Sie die Platform-Betreiber.',
              });
            }
            this.loading = false;
          })
          .catch((e) => {
            console.log(e);
            this.loading = false;
          });
      }
    },
  },
});
</script>
