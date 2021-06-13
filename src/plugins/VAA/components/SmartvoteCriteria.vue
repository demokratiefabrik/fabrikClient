<template>
  <span class="float-right q-pa-none q-ma-none ">

    <q-btn
      label="smartvote-Kriterien"
      outline
      class="q-ma-xs q-pa-none q-pv-xl "
      dense
      size="md"
      color="primary"
      @click="smartvoteHintsDialog = true"
    />

    <q-dialog v-model="smartvoteHintsDialog">
      <q-card>
        <q-toolbar>

          <q-toolbar-title>smartvote-Kriterien</q-toolbar-title>
          <q-btn
            flat
            round
            dense
            icon="mdi-close"
            v-close-popup
          />
        </q-toolbar>

        <q-card-section>
          <p class="text-caption">
            Sie finden nachfolgend die Erläuterungen, wie die smartvote-Fragen zu formulieren sind.
          </p>
          <ol>
            <li>
              Formulieren Sie Fragen, die nach Möglichkeit einen <b>Bezug zur Gemeinde Köniz</b> aufweisen.
            </li>
            <li>
              Bitte formulieren Sie lediglich neutrale Fragen und verzichten Sie auf <b>Aussagen und/oder Statements</b>.
            </li>
            <li>
              Die Fragen müssen <b>mit ja/nein beantwortet</b> werden können.
            </li>
            <li>
              <!-- Pro Eintrag sollte jeweils nur eine Frage zu einer Thematik gestellt werden.  -->
              Mehrere, mit «und» oder «oder» <b>verbundene Fragen in einem Satz sind nicht erlaubt.</b>
            </li>
            <li>
              <!-- wollen -->
              Die smartvote-Fragen sollen die <b>politischen Positionen</b> der Kandidierenden abfragen. Sie zielen nicht darauf ab, etwas über das persönliche Verhalten oder Eigenschaften der Kandidierenden zu erfahren.
            </li>
          </ol>

          Auf www.smartvote.ch können Sie Beispielfragen zu anderen Wahlen einsehen.

        </q-card-section>

        <q-card-actions vertical>
          <q-btn
            flat
            dense
            label="Schliessen"
            icon="mdi-close"
            v-close-popup
          />

        </q-card-actions>
      </q-card>
    </q-dialog>
  </span>
</template>

<script>
import constants from "src/utils/constants";

export default {
  name: "SmartvoteCriteria",
  data() {
    return {
      smartvoteHintsDialog: false,
    };
  },
  watch: {
    smartvoteHintsDialog(val) {
      if (val) {
        this.$root.monitorLog(constants.MONITOR_DIALOG_SMARTVOTE_CRITERIA);
      }
    },
  },
};
</script>