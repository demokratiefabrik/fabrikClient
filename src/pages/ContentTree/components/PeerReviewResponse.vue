<template>
  <q-card-section
    vertical
    class="q-pa-lg q-ma-sm full-width cursor-pointer"
    :class="noneResponse ? 'bg-orange-4' : ''"
    align="center"
    v-if="!noneAccepted"
  >
    <div class="q-mb-md">Geben Sie Ihre definitive Antwort ein:</div>

    <q-btn-toggle
      unelevated
      spread
      :disable="peerreviewFinalized"
      :indeterminate-value="null"
      class="bg-grey-3"
      label="Bewertung"
      v-model="progression_response"
      size="1.4em"
      @input.capture="debouncedInitSet"
      :options="buttons"
    >
    </q-btn-toggle>
  </q-card-section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions } from 'vuex';
import { debounce } from 'quasar';
import constants from 'src/utils/constants';
import useLibraryComposable from 'src/utils/library';

export default defineComponent({
  setup() {
    const { loaded } = useLibraryComposable();
    return { loaded };
  },
  name: 'PeerReviewResponse',
  props: ['peerreview', 'acceptDisabled', 'accept1', 'accept2', 'accept3'],
  data() {
    return {
      progression_response: null,
    };
  },

  computed: {
    buttons() {
      return [
        {
          value: false,
          toggleColor: 'red',
          textColor: 'grey-7',
          label: 'Ablehnen',
        },
        {
          value: true,
          slot: 'one',
          toggleColor: 'green',
          textColor: 'grey-7',
          disable: this.acceptedNumber < 2 || !this.accept1 || !this.accept2,
          label: 'Annehmen',
        },
      ];
    },

    noneAccepted() {
      return (
        this.accept1 == null || this.accept2 == null || this.accept3 == null
      );
    },

    acceptedNumber() {
      let acceptedNumber = 0;
      if (this.accept1 == true) {
        acceptedNumber++;
      }
      if (this.accept2 == true) {
        acceptedNumber++;
      }
      if (this.accept3 == true) {
        acceptedNumber++;
      }
      return acceptedNumber;
    },

    noneResponse() {
      return !this.loaded(this.progression_response);
    },

    peerreviewFinalized() {
      // Rejected or Approved by majority of peerreview group!
      return (
        this.peerreview.peerreview.approved ||
        this.peerreview.peerreview.rejected
      );
    },
  },

  methods: {
    initSet() {
      console.assert(
        this.progression_response === true ||
          this.progression_response === false
      );

      if (this.noneAccepted || !this.peerreview.progression) {
        // for a review response, one must indicate all three accepted toggles
        // and must be assigned to the peerreview => progression entry must exists..
        console.error(
          'An error occured... invalid peerreview response',
          this.noneAccepted,
          this.peerreview.progression
        );
        return null;
      }

      const data = {
        peerreviewID: this.peerreview.peerreview.id,
        response: this.progression_response,
        criteria_accept1: this.accept1,
        criteria_accept2: this.accept2,
        criteria_accept3: this.accept3,
      };
      // console.log("new response received...", this.progression_response);
      this.$root.monitorFire(constants.MONITOR_SET_PEERREVIEW_RESPONSE, data);

      // immediatly update saliences in vuex store (=> allows to update the dynamically generated charts)
      this.update_response({
        contenttreeID: this.peerreview.peerreview.contenttree_id,
        peerreviewID: this.peerreview.peerreview.id,
        response: this.progression_response,
        accept1: this.accept1,
        accept2: this.accept2,
        accept3: this.accept3,
      });
    },

    ...mapActions('peerreviewstore', ['update_response']),
  },

  created() {
    this.debouncedInitSet = debounce(this.initSet, 3000);
  },

  mounted: function () {
    if (this.peerreview && this.peerreview.progression) {
      this.progression_response = this.peerreview?.progression?.response;
    }
  },
});
</script>
