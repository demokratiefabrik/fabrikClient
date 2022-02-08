<template>
  <div>
    <q-card-section>
      <q-list>
        <q-item>
          <q-item-section avatar>
            <q-avatar
              icon="mdi-image-filter-hdr"
              :style="{ 'background-color': profile ? profile.CO : 'inherit' }"
              :text-color="profile ? 'white' : 'primary'"
              class="q-mr-sm"
            >
            </q-avatar>
          </q-item-section>
          <div style="width: 80%">
            <span class="text-bold">{{ currentUsername }}</span
            >, {{ currentUsernameDerivation }}
          </div>
        </q-item>

        <q-item v-if="IsManager">
          <q-item-section>
            <q-item-label> Moderation </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-item-label>
              <q-btn
                label="Benachrichtigen"
                color="primary"
                @click="
                  dialogType = 'MESSAGE';
                  showNotificationMessageDialog = true;
                "
              />&nbsp;

              <q-btn
                v-if="!locked"
                label="Sperren"
                color="primary"
                @click="
                  dialogType = 'LOCK';
                  showNotificationMessageDialog = true;
                "
              />
              <div class="text-notification" v-if="locked">
                <br />BEREITS GESPERRT<br />
              </div>

              <q-dialog v-model="showNotificationMessageDialog" persistent>
                <q-card>
                  <q-card-section class="row items-center">
                    <q-avatar
                      :icon="
                        dialogType == 'LOCK'
                          ? 'mdi-sign-caution'
                          : 'mdi-message-text-outline'
                      "
                      color="primary"
                      text-color="white"
                    />
                    <span class="q-ml-sm" v-if="dialogType == 'MESSAGE'"
                      >Möchten Sie dem User eine Nachricht schreiben?</span
                    >
                    <span class="q-ml-sm" v-if="dialogType == 'LOCK'"
                      >Möchten Sie den User aus der Könizer Demokratiefabrik
                      aussperren? Bitte erläutern Sie dem User die Gründe
                      dafür:</span
                    >
                  </q-card-section>

                  <q-card-section class="q-pt-none">
                    <q-input
                      dense
                      counter
                      :maxlength="300"
                      v-model="notificationMessage"
                      autofocus
                    />
                    <!-- @keyup.enter="prompt = false" -->
                  </q-card-section>

                  <q-card-actions align="right">
                    <q-btn flat label="Cancel" color="primary" v-close-popup />
                    <q-btn
                      flat
                      @click="sendUserAction"
                      :label="
                        dialogType == 'LOCK'
                          ? 'Sofort Sperren'
                          : 'Nachricht senden'
                      "
                      color="primary"
                    />
                  </q-card-actions>
                </q-card>
              </q-dialog>
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label> Plattform-Besuche </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-item-label v-if="loaded(stats.DAYS)">
              An {{ stats.DAYS }} {{ stats.DAYS === 1 ? 'Tag' : 'Tagen' }}
            </q-item-label>
            <q-item-label v-if="!loaded(stats.DAYS)"> Keine </q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label> Letzte Aktivität </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-item-label v-if="loaded(stats.DAYS) && stats.DAYS > 0">
              vor {{ stats.DLI }} {{ stats.DLI === 1 ? 'Tag' : 'Tagen' }}
            </q-item-label>
            <q-item-label v-if="loaded(stats.DAYS) && stats.DAYS === 0">
              Heute
            </q-item-label>
            <q-item-label v-if="!loaded(stats.DAYS)"> Noch nie </q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label> Bewertungen </q-item-label>
            <q-item-label caption> (Relevanz und Zustimmung) </q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label>
              {{ stats.CRC }}
              {{ stats.CRC === 1 ? 'Bewertung' : 'Bewertungen' }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label> Erstellte Beiträge </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-item-label>
              {{ stats.CCC }}
              {{ stats.CCC === 1 ? 'eigenen Beitrag' : 'eigene Beiträge' }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section top>
            <q-item-label> Durchschnittlich erhaltene Zustimmung </q-item-label>
          </q-item-section>
          <q-item-section side v-if="loaded(stats.RSC)">
            <q-item-label>{{
              stats.RSC && Number.isInteger(stats.RSA)
                ? Math.round(stats.RSA) + '%'
                : '-'
            }}</q-item-label>
            <q-item-label caption>{{
              stats.RSC && Number.isInteger(stats.RSA)
                ? `(${stats.RSC} Voten)`
                : ''
            }}</q-item-label>
          </q-item-section>
          <q-item-section side v-if="!loaded(stats.RSC)">
            <q-item-label>Noch nicht berrechnet</q-item-label>
            <q-item-label caption>&nbsp;</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import api from 'src/utils/api';
// import useLibraryComposable from 'src/utils/library';
import library  from 'src/utils/library';
import useAuthComposable from 'src/composables/auth.composable';
import useAssemblyComposable from 'src/composables/assembly.composable';

export default defineComponent({
  name: 'UserInfo',
  props: ['profile', 'stats', 'locked'],

  setup() {
    // console.log('DEBUG setup mainLayout')
    const { loaded } = library;
    const { currentUsername, currentUsernameDerivation } = useAuthComposable();
    const { assemblyIdentifier } = useAssemblyComposable('userinfo');
    // const {loading} = useLibraryComposable()

    // const { getUsernameDerivation, getUsername } = useAuthComposable();

    // console.log('DEBUG setup mainLayout ends')
    return {
      loaded,
      currentUsername,
      currentUsernameDerivation,
      assemblyIdentifier,
    };
  },

  data() {
    return {
      loading: true,
      toolbar: false,
      showNotificationMessageDialog: false,
      dialogType: '',
      notificationMessage: '',
    };
  },

  computed: {
    ...mapGetters({
      IsManager: 'assemblystore/IsManager',
      // assemblyIdentifier: "assemblystore/assembly",
    }),
  },

  methods: {
    sendUserAction: function () {
      this.loading = true;
      if (this.notificationMessage.length < 5) {
        alert('Bitte schreibe einen Text mit mindestens 5 Zeichen.');
        return;
      }

      const assemblyIdentifier = this.assemblyIdentifier;
      const userID = this.profile.id;
      console.assert(userID);

      if (this.dialogType == 'MESSAGE') {
        console.log('Send Message!!!', this.notificationMessage);
        api
          .sendUserMessage(assemblyIdentifier, userID, this.notificationMessage)
          .then((response) => {
            // ERROR RESPONSE
            if (response.data.ok) {
              this.dialogType = '';
              this.notificationMessage = '';
              this.showNotificationMessageDialog = false;

              // Success Message.
              this.$q.notify({
                type: 'nFabrikInfo',
                message:
                  'Die Nachricht wird beim nächsten Besuch des Users angezeigt.',
              });
            } else {
              if (
                response.data.error &&
                response.data.response == 'NOT.PART.OF.THIS.ASSEMBLY'
              ) {
                // Error Message.
                this.$q.notify({
                  type: 'nFabrikError',
                  message:
                    'Der User hat sich noch nie zu der Assembly eingeloggt. Es kann keine Nachricht deponiert werden.',
                });
              }
            }
          });
      }

      if (this.dialogType == 'LOCK') {
        console.log('Lock user and send Message!!!');
        api
          .lockUserWithMessage(
            assemblyIdentifier,
            userID,
            this.notificationMessage
          )
          .then((response) => {
            // ERROR RESPONSE
            if (response.data.ok) {
              this.dialogType = '';
              this.notificationMessage = '';
              this.showNotificationMessageDialog = false;
              this.$emit('user-locked');

              // Success Message.
              this.$q.notify({
                type: 'nFabrikInfo',
                message:
                  'Der User wurde gesperrt. die Nachricht wird beim nächsten Besuch des Users angezeigt.',
              });

              this.loading = false;
            } else {
              if (
                response.data.error &&
                response.data.response == 'NOT.PART.OF.THIS.ASSEMBLY'
              ) {
                // Error Message.
                this.$q.notify({
                  type: 'nFabrikError',
                  message:
                    'Der User hat sich noch nie zu der Assembly eingeloggt. Er kann daher auch nicht gesperrt werden.',
                });
              }
              this.loading = false;
            }
          });
      }
    },
  },
});
</script>
