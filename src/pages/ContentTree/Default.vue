<template>
  <q-page class="doc_content">
    <div v-if="contenttree">

      <div class="text-h4">{{routed_stage.stage.title}}</div>

      <p>{{routed_stage.stage.info}}</p>
    </div>

    <ComponentContentTree label="Offene Diskussion" />
  </q-page>
</template>


<script>
import ContentTreeMixin from "src/mixins/stage.contenttree";
import ComponentContentTree from "./components/ContentTree";

export default {
  name: "UserContentDefault",
  components: {
    ComponentContentTree,
  },
  mixins: [ContentTreeMixin],
};
</script>
