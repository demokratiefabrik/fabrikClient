<template>
  <div
    class="items-center text-overline"
    style="display: inline-flex;"
  >
    <q-avatar
      icon="mdi-image-filter-hdr"
      :style="{ 'background-color': profile ? profile.CO: 'inherit'}"
      :text-color="profile ? 'white' : 'primary'"
      class="q-mr-sm"
    >
    </q-avatar>
    <q-item-section>
      <q-item-label
        v-if="menu"
        caption
      >{{ $t('auth.registered_as') }}</q-item-label>
      <q-item-label>
        {{ username }} <slot name="extrainfos"></slot>
      </q-item-label>

    </q-item-section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useAuthComposable from 'src/composables/auth.composable';

export default defineComponent({
  name: 'UserAvatar',
  props: ['profile', 'menu'],

  setup() {
    // console.log('DEBUG setup mainLayout')

    const authComposable = useAuthComposable();

    // console.log('DEBUG setup mainLayout ends')
    return { authComposable };
  },

  data() {
    return {
      toolbar: false,
    };
  },

  computed: {
    username(): string {
      // TODO: 
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      // return 'H. Mönch'
      // return profile ? profile.U : 'Anonymous';
      return this.authComposable.getUsername(this.profile);
    },

    username_derivation: function () {
      return this.authComposable.getUsernameDerivation(this.profile);
    },
  },
});
</script>
