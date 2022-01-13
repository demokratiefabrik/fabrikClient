<template>
  <span>
    <q-chip
      clickable
      v-if="!expanded"
      @click="showDisclaimer = !showDisclaimer"
      align="right"
      icon="mdi-monitor-clean"
    >
      {{ $t('disclaimer.btnLabel') }}
    </q-chip>
    <q-banner
      align="justify"
      v-if="showDisclaimer"
      :class="[bgcolor ? bgcolor: 'bg-grey-3']"
    >
      <span class="text-weight-thin">
        <q-icon
          class="float-left q-mr-sm q-mb-sm q-mt-xs"
          name="mdi-monitor-clean"
          size="sm"
        /><span v-dompurify-html="text" />
      </span>
    </q-banner>
  </span>
</template>


<script lang="ts">
import { defineComponent} from 'vue';
export default defineComponent({
  name: 'AlgorithmDisclaimer',
  data() {
    return {
      showDisclaimer: false as boolean,
    };
  },
  props: {
    text: {
      type: String,
      required: true,
    },
    expanded: {
      type: Boolean,
      default: false,
    },    
    bgcolor: {
      type: String
    },
  },
  created() {
    this.showDisclaimer = this.expanded as boolean;
  },
});
</script>