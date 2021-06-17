<template>
  <q-page class="doc_content">
    <div
      align="center"
      style="min-height:20px; margin-top:1em; "
    >
      <q-img
        style="max-width: 150px; max-height:150px;"
        :src="`layout/logodemokratiefabrik.png`"
        class="q-mb-xl"
      />

      <!-- ASSEMBLY DESCRIPTION -->
      <span v-if="ongoing_assemblies[0]">
        <h1 class="q-mt-none">{{ongoing_assemblies[0].title}}</h1>
        <p v-dompurify-html="ongoing_assemblies[0].background" />
      </span>

      <br>
      <div
        class="justify-center center;"
        style="max-width:470px;"
      >

        <!-- displayMode="all" -->
        <ArtificialModeration
          :AM="AMs.indexpage_left"
          :fixedActor="2"
          :slim="true"
          alignment="left"
          :ctx="that"
        />
        <ArtificialModeration
          :AM="AMs.indexpage_right"
          :fixedActor="1"
          alignment="right"
          :ctx="that"
        />
      </div><br>
      <div class="q-mt-xl">
        <p>
          Möchten Sie mehr über die Plattform oder das Könizer Projekt erfahren? Dann besuchen Sie unsere Seite
          <router-link :to="{ name: 'background'}">Hintergrund</router-link>.
          Mehr Informationen über die Online-Wahlhilfe smartvote finden Sie auf <a
            href='https://www.smartvote.ch/de/wiki/faq-2'
            target="_blank"
            alt="smartvote - Häufig gestellte Fragen"
          >deren Webseite</a>.
        </p>
      </div>
    </div>

  </q-page>
</template>

<script>
import Vue from "vue";
import AMs from "src/pages/ArtificialModeration.js";
import ArtificialModeration from "src/components/artificial_moderation/ArtificialModeration.vue";
import { mapGetters } from "vuex";

export default Vue.extend({
  name: "PageIndex",
  components: {
    ArtificialModeration,
  },
  data() {
    return {
      AMs,
      that: this,
    };
  },

  computed: {
    ...mapGetters({
      get_public_profile: "publicprofilestore/get_public_profile",
      IsUserDelegateOfOngoingAssembly:
        "publicindexstore/IsUserDelegateOfOngoingAssembly",
      IsUserObserverOfOngoingAssembly:
        "publicindexstore/IsUserObserverOfOngoingAssembly",
      UsersDelegateAssemblies: "publicindexstore/UsersDelegateAssemblies",
      UsersObserverAssemblies: "publicindexstore/UsersObserverAssemblies",
      UsersManagerAssemblies: "publicindexstore/UsersManagerAssemblies",
      IsThereAnAssemblyOngoing: "publicindexstore/IsThereAnAssemblyOngoing",
      ongoing_assemblies: "publicindexstore/ongoing_assemblies",
      IsThereNothingGoingOn: "publicindexstore/IsThereNothingGoingOn",
    }),
  },
});
</script>
