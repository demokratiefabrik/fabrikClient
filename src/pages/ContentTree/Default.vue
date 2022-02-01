<template>
  <q-page class="doc_content">
    <div v-if="contenttree">
      <div class="text-h4">{{ routed_stage.stage.title }}</div>
      <p>{{ routed_stage.stage.info }}</p>
    </div>
    <ComponentContentTree label="Offene Diskussion" />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useContenttreeComposable from 'src/composables/contenttree.composable';
import ComponentContentTree from './components/ContentTree.vue';

export default defineComponent({
  setup() {
    const { contenttree } = useContenttreeComposable();
    return { contenttree };
  },
  name: 'UserContentDefault',
  components: {
    ComponentContentTree,
  },
});
</script>
