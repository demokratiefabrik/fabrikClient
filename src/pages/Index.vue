<template>
  <q-page class="doc_content">
    <div align="center" style="min-height: 20px; margin-top: 1em">
      <q-img
        style="max-width: 150px; max-height: 150px"
        :src="`layout/logodemokratiefabrik.png`"
        class="q-mb-xl"
      />
      <!-- ASSEMBLY DESCRIPTION -->
      <h1 class="q-mt-none">Willkommen in der Demokratiefabrik!</h1>
      <p>
        Die Demokratiefabrik ist ein neuer Ort für demokratische
        Online-Beteiligung. Der nächste Event auf dieser Plattform findet im August/September 2022 statt.
      </p>

      <br />
      <div class="justify-center center;" style="max-width: 470px">
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
      </div>
      <br />
      <div class="q-mt-xl">
        <p>
          Möchten Sie mehr über die Plattform und unsere aktuellen Projekte
          erfahren? Dann besuchen Sie den Bereich
          <router-link :to="{ name: 'background' }">Hintergrund</router-link>.
          <!-- Mehr Informationen über die Online-Wahlhilfe smartvote finden Sie auf <a
            href='https://www.smartvote.ch/de/wiki/faq-2'
            target="_blank"
            alt="smartvote - Häufig gestellte Fragen"
          >deren Webseite</a>. -->
        </p>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useAuthComposable from 'src/composables/auth.composable';
import AMs from 'src/pages/ArtificialModeration';
import ArtificialModeration from 'src/pages/components/artificial_moderation/ArtificialModeration.vue';
import { mapGetters } from 'vuex';
import useAssemblyComposable from 'src/composables/assembly.composable';

export default defineComponent({
  name: 'PageIndex',

  setup() {
    // console.log('DEBUG: INDEX:VUE');
    const { authorized, profile } = useAuthComposable();
    const { gotoAssemblyHome } = useAssemblyComposable('');
    return {
      authorized,
      profile,
      gotoAssemblyHome,
      ENV_I18N_LOCALE: process.env.ENV_I18N_LOCALE,
    };
  },
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
      // get_profile: 'profilestore/get_profile',
      IsUserDelegateOfOngoingAssembly:
        'publicindexstore/IsUserDelegateOfOngoingAssembly',
      IsUserObserverOfOngoingAssembly:
        'publicindexstore/IsUserObserverOfOngoingAssembly',
      UsersDelegateAssemblies: 'publicindexstore/UsersDelegateAssemblies',
      UsersObserverAssemblies: 'publicindexstore/UsersObserverAssemblies',
      UsersManagerAssemblies: 'publicindexstore/UsersManagerAssemblies',
      IsThereAnAssemblyOngoing: 'publicindexstore/IsThereAnAssemblyOngoing',
      ongoing_assemblies: 'publicindexstore/ongoing_assemblies',
      IsThereNothingGoingOn: 'publicindexstore/IsThereNothingGoingOn',
    }),
  },
});
</script>
