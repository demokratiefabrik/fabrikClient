<template>
  <span class="float-right q-pa-none q-ma-none">
    <q-btn
      label="Aktueller Fragenkatalog"
      outline
      class="q-ma-xs q-pa-none q-pv-xl"
      dense
      size="md"
      color="primary"
      @click="showDialog = true"
    />

    <q-dialog v-model="showDialog" v-if="showDialog">
      <q-card>
        <q-toolbar>
          <q-toolbar-title
            >Liste bestehender Fragen zu diesem Thema</q-toolbar-title
          >
          <q-btn flat round dense icon="mdi-close" v-close-popup />
        </q-toolbar>
        <q-card-section>
          <p class="text-caption">
            Sie finden folgend eine Liste der bereits eingetragenen Fragen zu
            diesem Thema.
          </p>
          <ul style="max-height: 50vh" class="scroll">
            <li v-for="node in previousQuestions" :key="node.content.id">
              {{ node.content.title }}
            </li>
          </ul>
        </q-card-section>

        <q-card-actions vertical>
          <q-btn flat dense label="Schliessen" icon="mdi-close" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </span>
</template>

<script>
import constants from 'src/utils/constants';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ListOfOlderSameLevelEntries',
  props: ['current'],
  inject: ['CONTENT'],
  data() {
    return {
      showDialog: false,
    };
  },

  computed: {
    previousQuestions() {
      const date_created = this.current?.content
        ? this.current.content.date_created
        : new Date();
      const olderNodeChildren = this.CONTENT.nodeChildren.filter((x) => {
        const older = x.content.date_created < date_created;
        const rejected = x.content.rejected;
        const underPeerreview = x.content.pending_peerreview_for_insert;
        const response = !rejected && (!underPeerreview || older);
        return response;
      });
      return olderNodeChildren;
    },
  },

  watch: {
    showDialog(val) {
      if (val) {
        this.$root.monitorLog(constants.MONITOR_DIALOG_CONTENT_SIBLINGS);
      }
    },
  },
});
</script>
