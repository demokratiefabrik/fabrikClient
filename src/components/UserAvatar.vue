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

<script>
export default {
  name: "UserAvatar",
  props: ["profile", "menu"],

  data() {
    return {
      toolbar: false,
    };
  },

  computed: {
    username() {
      return this.$root.username(this.profile);
    },

    // username_derivation: function () {
    //   return this.$root.username_derivation(this.profile);
    // },
  },
};
</script>
