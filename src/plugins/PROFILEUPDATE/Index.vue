<template>
  <q-page class="doc_content">
    <!-- v-if="ready" -->
    <ArtificialModeration
      :AM="AMs.profileupdate"
      alignment="center"
      :ctx="this"
    />
  </q-page>
</template>

<script lang="ts">
// import StageMixin from 'src/mixins/stage';
import AMs from './ArtificialModeration';
import ArtificialModeration from 'src/components/artificial_moderation/ArtificialModeration.vue';
// import { LayoutEventBus } from 'src/utils/eventbus';
import { defineComponent } from 'vue';
import useLibraryComposable from 'src/utils/library';

export default defineComponent({
  setup() {
    const { loaded } = useLibraryComposable();
    return { loaded };
  },
  name: 'ProfileUpdateStage',
  components: {
    ArtificialModeration,
  },
  // mixins: [StageMixin],

  data() {
    return {
      AMs,
    };
  },

  // TODO: uncomment
  // computed: {
  //   ready() {
  //     const ready =
  //       this.loaded(this.routed_stage) && this.loaded(this.oauth.payload);
  //     if (ready) {
  //       console.log('EVERYTHING LOADED');
  //       LayoutEventBus.$emit('hideLoading');

  //       // Everything loaded...
  //       // if (!this.is_stage_completed(this.routed_stage)) {
  //       if (this.is_profile_data_complete) {
  //         console.log('PROFILE IS COMPLETE');
  //         this.markCompleted();
  //       } else {
  //         console.log('REDIRECTING');
  //         this.redirectToProfile();
  //       }
  //       // }
  //     }
  //     return ready;
  //   },

  //   redirecting() {
  //     return this.routed_stage && !this.is_profile_data_complete;
  //   },

  //   is_profile_data_complete() {
  //     return !!this.oauth.payload?.userEmail;
  //   },
  // },

  // methods: {
  //   redirectToProfile: function () {
  //     this.$store.dispatch('publicprofilestore/gotoProfile');

  //     return true;
  //   },
  // },
});
</script>
