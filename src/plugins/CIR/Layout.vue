<template>
  <q-page class="doc_content side_menu">

    TEST

    <!-- <teleport :to="teleportTo" :disabled="disableTeleport">
      <TeleportChild:imagePath="imagePath" />
    </teleport> -->


    <router-view></router-view>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'CIRLayout',
  computed: {},
});
</script>
