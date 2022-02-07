<template>
  <q-page class="doc_content" v-if="ready">
    <ArtificialModeration
      :AM="AMs.profileupdate"
      alignment="center"
      :ctx="this"
    />
  </q-page>
</template>

<script lang="ts">
import AMs from './ArtificialModeration';
import ArtificialModeration from 'src/pages/components/artificial_moderation/ArtificialModeration.vue';
import { defineComponent } from 'vue';
import useLibraryComposable from 'src/utils/library';
import useStageComposable from 'src/composables/stage.composable';
import useAuthComposable from 'src/composables/auth.composable';
import useEmitter from 'src/utils/emitter';
import useRouterComposable from 'src/composables/router.composable';

export default defineComponent({
  setup() {
    const {
      isRoutedStageCompleted,
      markCompleted,
      nextScheduledStage,
      routed_stage,
      gotoStage,
    } = useStageComposable();
    const { loaded } = useLibraryComposable();
    // const store = useStore();
    const { payload, emailIsAvailable } = useAuthComposable();
    const emitter = useEmitter();

    const { gotoProfile } = useRouterComposable();

    return {
      loaded,
      gotoProfile,
      isRoutedStageCompleted,
      markCompleted,
      nextScheduledStage,
      routed_stage,
      gotoStage,
      payload,
      emailIsAvailable,
      emitter,
    };
  },
  name: 'ProfileUpdateStage',
  components: {
    ArtificialModeration,
  },
  data() {
    return {
      AMs,
    };
  },

  computed: {
    ready(): boolean {
      console.log(this.payload)
      console.log(this.routed_stage)
      
      const ready = this.loaded(this.routed_stage) && this.loaded(this.payload);
      if (ready) {
        console.log('EVERYTHING LOADED');
        this.emitter.emit('hideLoading');

        // Everything loaded...
        if (this.emailIsAvailable) {
          console.log('PROFILE IS COMPLETE');
          this.markCompleted();
        } else {
          console.log('REDIRECTING');
          this.redirectToProfile();
        }
        // }
      }
      return ready;
    },

    redirecting(): boolean {
      return !!this.routed_stage && !this.emailIsAvailable;
    },

    // is_profile_data_complete(): boolean {
    //   return !!this.oauth.payload?.userEmail;
    // },
  },

  methods: {
    redirectToProfile: function () {
      this.gotoProfile();
      // this.store.dispatch('publicprofilestore/gotoProfile');

      return true;
    },
  },
});
</script>
