<template>
<div>
  <q-select
    v-model="lang"
    :options="langOptions"
    :label="$t('language.switcher_label')"
    dense
    borderless
    emit-value
    map-options
    options-dense
    icon="mdi-help"
    style="min-width: 100px"
  />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import { useI18n } from 'vue-i18n'

export default defineComponent({
  setup() {
    // const i18n = useI18n()
    // console.log(i18n, 'SETUPPP')
    // return {i18n}
  },
  data() {
    return {
      lang: this.$i18n.locale as string,
      langOptions: [] as  Record<string, unknown>[]
    }
  },

  watch: {
    lang(lang) {
      this.$i18n.locale = lang
    }
  },

  mounted: function () {
    this.langOptions = [
        { 'value': 'en-us', label: this.$t('language.items.en-us.label') },
        { 'value': 'de-ch', label: this.$t('language.items.de-ch.label') },
      ]
  }
})
</script>