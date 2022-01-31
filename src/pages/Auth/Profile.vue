<template>
  <div class="doc_content" v-if="payload">
    <h1>Sekretariat</h1>
    <div>
      <div>
        <div class="q-gutter-y-md column" style="max-width: 600px">
          <!-- HTML -->
          <!-- <b>{{$t('contenttree.editor.content_title')}}</b> -->

          <p>
            <b>Pseudonym: </b>
            Sie bekommen auf dieser Plattform einen eigenen Namen. Andere
            Teilnehmende werden Sie unter diesem Namen ansprechen können.
            {{ username_derivation }}. <br />
            <br />
            <q-input disable outlined v-model="localprofile.pseudonym" :dense="true">
              <template v-slot:prepend>
                <q-icon name="mdi-account" />
              </template>
            </q-input>
          </p>

          <p v-if="!loading && !error">
            <b>Kontaktangabe: </b>
            {{
              this.localprofile.original_email
                ? 'Sie können hier Ihre Kontaktdaten ändern:'
                : 'Bitte geben Sie Ihre E-Mail-Adresse ein:'
            }}

            <q-input
              :bg-color="isValidContact ? 'lime' : 'yellow'"
              outlined
              class="q-ma-sm"
              v-model="localprofile.email"
              :dense="true"
            >
              <template v-slot:prepend>
                <q-icon :name="isPhone ? 'mdi-phone' : 'mdi-email'" />
              </template>
            </q-input>
            <small>{{ $t('auth.profile_email_hint') }}</small>
          </p>
        </div>
      </div>

      <br />
      <br />

      <q-btn
        class="q-ma-xs"
        :loading="loading"
        color="primary"
        :label="$t('auth.profile_update_action')"
        :disabled="!isEnabledSubmitButton"
        @click="saveProfile"
      >
        <template v-slot:loading>
          <q-spinner-facebook />
        </template>
      </q-btn>

      <q-btn
        color="primary"
        :disabled="!localprofile.original_email"
        v-if="!!this.localprofile.original_email"
        outline
        :label="$t('app.btn_close')"
        @click="skipProfile"
      />

      <br />
      <br />
      <br />
      <br />

      <!-- Disclaimer -->
      <AlgorithmDisclaimer
        :expanded="true"
        :text="$t('auth.profile_email_disclaimer')"
      />
    </div>

    <q-dialog v-model="confirmation" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Die Kontaktangabe wurde gespeichert</div>
          <p>
            Überprüfen Sie bitte ein letztes Mal, ob die Kontaktangabe korrekt
            ist:
          </p>
        </q-card-section>

        <q-card-section class="q-pt-none q-ml-xl q-mr-xl">
          <q-input
            dense
            input-style="font-size:1.5em"
            readonly
            v-model="localprofile.email"
            autofocus
          />
          <!-- @keyup.enter="prompt = false" -->
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Nein, ich möchte Sie ändern" v-close-popup />
          <q-btn
            flat
            @click="confirm"
            :label="
              this.isValidEmail
                ? 'Ja, die E-Mail-Adresse ist korrekt'
                : 'Ja, die Handy-Nummer ist korrekt'
            "
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
// import Configuration from 'src/utils/configuration'
// import ApiService from 'src/utils/xhr';
import api from 'src/utils/api';
import { mapGetters } from 'vuex';
import AlgorithmDisclaimer from 'src/components/AlgorithmDisclaimer.vue';
import useAuthComposable from 'src/composables/auth.composable';
import { PropType, defineComponent } from 'vue';
import { RouteRecordRaw, LocationAsRelativeRaw } from 'vue-router';

export default defineComponent({
  name: 'Profile',
  props: {
    destination_route: {
      // right, left, center
      type: Object as PropType<RouteRecordRaw | LocationAsRelativeRaw>,
    },
  },

  setup() {
    const { username_derivation, payload, markIndicatedEmail } = useAuthComposable();
    return { payload, markIndicatedEmail };
  },
  components: { AlgorithmDisclaimer },

  data() {
    return {
      confirmation: false,
      localprofile: {
        pseudonym: '',
        email: '',
        original_email: '',
      },
      error: false,
      errormsg: '',
      loading: true,
      action: null,
      btnlabel: '',
    };
  },

  computed: {
    // username_derivation(): string {
    //   if (!this.profile) {
    //     return '';
    //   }
    //   const altitude = this.profile.ALT;
    //   const fullname = this.profile.FN;
    //   const canton = this.profile.CA;
    //   return this.$t('auth.name_derivation', {
    //     fullname: fullname,
    //     canton: canton,
    //     altitude: altitude,
    //   });
    // },

    ...mapGetters({
      profile: 'profilestore/profile',
    }),

    isEnabledSubmitButton(): boolean {
      return this.isValidContact && !this.loading;
    },

    isValidContact(): boolean {
      return this.isPhone ? this.isValidPhone : this.isValidEmail;
    },

    isPhone(): boolean {
      // does not contain any alphas
      const emailPattern = /^[^a-zA-Z]+$/;
      if (this.localprofile.email) {
        return false;
      }
      return emailPattern.test(this.localprofile.email);
    },

    isValidEmail(): boolean {
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      if (this.localprofile.email) {
        return false;
      }
      return emailPattern.test(this.localprofile.email.trim());
    },

    isValidPhone(): boolean {
      const phonePatternSwiss =
        /(\b(0041|0)|\B\+41)(\s?\(0\))?(\s)?([1-9]{2}|77[1-9]{1})(\s)?[0-9]{3}(\s)?[0-9]{2}(\s)?[0-9]{2}\b$/;
      if (this.localprofile.email) {
        return false;
      }
      return phonePatternSwiss.test(this.localprofile.email.trim());
    },

    completedEmailOrSMS(): string | null {
      if (this.isValidEmail) {
        return this.localprofile.email.trim();
      }
      // @${process.env.ENV_SMS_EMAIL_PROVIDER}
      if (this.isValidPhone) {
        return `${this.localprofile.email.trim()}@${
          process.env.ENV_SMS_EMAIL_PROVIDER
        }`;
      }
      return null;
    },
  },

  methods: {
    emailToSms(email) {
      if (email && email.includes(process.env.ENV_SMS_EMAIL_PROVIDER)) {
        return email.split('@')[0];
      }
      return email;
    },

    skipProfile: function () {
      const route = this.destination_route
        ? this.destination_route
        : ({ name: 'home' } as RouteRecordRaw | LocationAsRelativeRaw);
      this.$router.push(route);
    },

    loadProfile: function () {
      if (!this.profile) {
        // Error
        const message = this.$t('auth.profile_load_error');
        this.$q.notify({
          type: 'nFabrikError',
          message,
        });

        this.error = true;

        return;
      }

      // Get Username from the JWT token
      this.localprofile.pseudonym = this.profile.U;

      // Get Email from oauth server
      api
        .authProfile({})
        .then((response) => {
          if (response.data) {
            // Okay
            this.localprofile.email = this.emailToSms(response.data.email);
            // this.profile.last_name = response.data.last_name;
            this.localprofile.original_email = this.emailToSms(response.data.email);
            this.error = false;
          } else {
            // Error
            const message = this.$t('auth.profile_load_error');
            this.error = true;
            this.error = true;
            this.$q.notify({
              type: 'nFabrikError',
              message,
            });
          }
          this.loading = false;
        })
        .catch((e) => {
          console.log(e);
          this.loading = false;
          this.error = true;
        });
    },
    saveProfile: function () {
      const changed = this.localprofile.original_email != this.localprofile.email;
      console.log('nothing changed... ');
      if (!changed) {
        this.confirmation = true;
        return;
      }

      this.loading = true;
      console.log('Save profile !!!');
      console.log(this.localprofile);

      api.authProfile({ email: this.completedEmailOrSMS }).then((response) => {
        // ERROR RESPONSE
        let message = '';
        if (response.data.ok) {
          message = this.$t('auth.profile_update_success');
          this.markIndicatedEmail();
          this.localprofile.original_email = this.localprofile.email;
        } else {
          message = this.$t('auth.profile_update_error');
        }
        console.log(message);
        // Notification
        this.confirmation = true;
        this.loading = false;
      });
    },

    confirm() {
      const route = this.destination_route
        ? this.destination_route
        : { name: 'home' };
      this.$router.push(route);
    },
  },

  mounted() {
    if (!this.payload) {
      // not logged in
      this.$router.push({ name: 'home' });
      return;
    }

    this.loadProfile();
  },

  watch: {
    profile() {
      // public profile changed
      this.loadProfile();
    },
  },
});
</script>
