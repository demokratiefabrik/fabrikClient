<template>
  <div
    class="doc_content "
    v-if="oauth.payload"
  >
    <h1>Sekretariat</h1>
    <div>
      <div>
        <div
          class="q-gutter-y-md column"
          style="max-width: 600px"
        >
          <!-- HTML -->
          <!-- <b>{{$t('contenttree.editor.content_title')}}</b> -->

          <p>
            <b>Pseudonym: </b>
            Sie bekommen auf dieser Plattform einen eigenen Namen. Andere Teilnehmende werden Sie unter diesem Namen ansprechen können. {{username_derivation }}. <br /> <br />
            <q-input
              disable
              outlined
              v-model="profile.pseudonym"
              :dense="true"
            >
              <template v-slot:prepend>
                <q-icon name="mdi-account" />
              </template>
            </q-input>
          </p>

          <p v-if="!loading">

            <b>Kontaktangabe: </b>
            {{ this.profile.original_email ?  'Sie können hier Ihre Kontaktdaten ändern:' :  'Bitte geben Sie Ihre E-Mail-Adresse ein:' }}

            <q-input
              :bg-color="isValidContact ? 'lime' : 'yellow'"
              outlined
              class="q-ma-sm"
              v-model="profile.email"
              :dense="true"
            >
              <template v-slot:prepend>
                <q-icon :name="isPhone ? 'mdi-phone' : 'mdi-email' " />
              </template>
            </q-input>
            <small>{{$t('auth.profile_email_hint')}}</small>
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
        :disabled="!profile.original_email"
        v-if="!!this.profile.original_email"
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

    <q-dialog
      v-model="confirmation"
      persistent
    >
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Die Kontaktangabe wurde gespeichert</div>
          <p>
            Überprüfen Sie bitte ein letztes Mal, ob die Kontaktangabe korrekt ist:
          </p>
        </q-card-section>

        <q-card-section class="q-pt-none q-ml-xl q-mr-xl">
          <q-input
            dense
            input-style="font-size:1.5em"
            readonly
            v-model="profile.email"
            autofocus
            @keyup.enter="prompt = false"
          />
        </q-card-section>

        <q-card-actions
          align="right"
          class="text-primary"
        >
          <q-btn
            flat
            label="Nein, ich möchte Sie ändern"
            v-close-popup
          />
          <q-btn
            flat
            @click="confirm"
            :label="this.isValidEmail ? 'Ja, die E-Mail-Adresse ist korrekt' : 'Ja, die Handy-Nummer ist korrekt'"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>

</template>

<script>
// import Configuration from 'src/utils/configuration'
import ApiService from "src/utils/xhr";
import api from "src/utils/api";
import { mapGetters } from "vuex";
import AlgorithmDisclaimer from "src/components/AlgorithmDisclaimer";

export default {
  name: "Profile",
  components: { AlgorithmDisclaimer },

  props: {
    destination_route: Object,
  },

  data() {
    return {
      confirmation: false,
      profile: {
        pseudonym: "",
        email: "",
        original_email: "",
      },
      error: false,
      errormsg: "",
      loading: true,
      action: null,
      btnlabel: "",
      payload: this.oauth.payload,
    };
  },

  computed: {
    username_derivation: function () {
      if (!this.public_profile) {
        return "";
      }
      const altitude = this.public_profile.ALT;
      const fullname = this.public_profile.FN;
      const canton = this.public_profile.CA;
      return this.$i18n.t("auth.name_derivation", {
        fullname: fullname,
        canton: canton,
        altitude: altitude,
      });
    },

    ...mapGetters({
      public_profile: "publicprofilestore/get_public_profile",
    }),

    isEnabledSubmitButton: function () {
      return this.isValidContact && !this.loading;
    },

    isValidContact: function () {
      return this.isPhone ? this.isValidPhone : this.isValidEmail;
    },

    isPhone: function () {
      // does not contain any alphas
      const emailPattern = /^[^a-zA-Z]+$/;
      return this.profile.email && emailPattern.test(this.profile.email);
    },

    isValidEmail: function () {
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(this.profile.email);
    },

    isValidPhone: function () {
      const phonePatternSwiss =
        /(\b(0041|0)|\B\+41)(\s?\(0\))?(\s)?([1-9]{2}|77[1-9]{1})(\s)?[0-9]{3}(\s)?[0-9]{2}(\s)?[0-9]{2}\b$/;
      return phonePatternSwiss.test(this.profile.email);
    },

    completedEmailOrSMS() {
      if (this.isValidEmail) {
        return this.profile.email;
      }
      // @${process.env.ENV_SMS_EMAIL_PROVIDER}
      if (this.isValidPhone) {
        return `${this.profile.email}@${process.env.ENV_SMS_EMAIL_PROVIDER}`;
      }
    },
  },

  methods: {
    emailToSms(email) {
      if (email && email.includes(process.env.ENV_SMS_EMAIL_PROVIDER)) {
        return email.split("@")[0];
      }
      return email;
    },

    skipProfile: function () {
      const route = this.destination_route
        ? this.destination_route
        : { name: "home" };
      this.$router.push(route);
    },

    saveProfile: function () {
      const changed = this.profile.original_email != this.profile.email;
      console.log("nothing changed... ");
      if (!changed) {
        this.confirmation = true;
        return;
      }

      this.loading = true;
      console.log("Save profile !!!");
      console.log(this.profile);

      api.authProfile({ email: this.completedEmailOrSMS }).then((response) => {
        // ERROR RESPONSE
        let message = "";
        if (response.data.ok) {
          message = this.$i18n.t("auth.profile_update_success");
          this.oauth.payload.userEmail = true;
          this.profile.original_email = this.profile.email;
        } else {
          message = this.$i18n.t("auth.profile_update_error");
        }

        // Notification
        this.confirmation = true;
        this.loading = false;
      });
    },

    confirm() {
      const route = this.destination_route
        ? this.destination_route
        : { name: "home" };
      this.$router.push(route);
    },
  },
  // LayoutEventBus.$emit("AfterProfileUpdate", {
  //   userEmail: this.profile.email,
  //   destination_route: route,
  // });

  mounted: function () {
    if (!this.oauth.payload) {
      // not logged in
      this.$router.push({ name: "home" });
    }
    // Get Username from the JWT token
    this.profile.pseudonym = this.public_profile.U;
    // Get Email from oauth server
    api
      .authProfile({})
      .then((response) => {
        if (response.data) {
          // Okay
          this.profile.email = this.emailToSms(response.data.email);
          // this.profile.last_name = response.data.last_name;
          this.profile.original_email = this.emailToSms(response.data.email);
        } else {
          // Error
          const message = this.$i18n.t("auth.profile_load_error");
          this.$q.notify({
            type: "nFabrikError",
            message,
          });
        }

        this.loading = false;
      })
      .catch((e) => {
        console.log(e);
        this.loading = false;
      });
  },
};
</script>