<style scoped>
.hovercraft:hover {
  background-color: beige;
}
</style>
<template>
  <div>
    <!-- {{chartBarPopulationData.map(x => x.content.S.SA)}} -->
    <ChartBar
      v-if="isBarChart"
      :personalData="chartBarPersonalData"
      :populationData="hasPopulationData ? chartBarPopulationData : null"
      :labels="chartBarLabels"
    />

    <ChartRadar
      v-if="chartType=='chartRadar'"
      :personalData="chartBarPersonalData"
      :populationData="hasPopulationData ? chartBarPopulationData : null"
      :labels="chartBarLabels"
    />
    <ChartPie
      v-if="chartType=='chartPie'"
      :personalData="chartBarPersonalData"
      :populationData="hasPopulationData ? chartBarPopulationData : null"
      :labels="chartBarLabels"
    />
    <p
      v-if="!hasPopulationData"
      class="profilecolor "
    >

      Hinweis: Die Demokratiefabrik hat gerade erst geöffnet. Aktuell werden daher nur Ihre Angaben angezeigt.
      Wohl schon morgen werden wir hier auch Durchschnittswerte aller Teilnehmenden anzeigen.</p>

    <!-- <q-toggle :value="showPopulationChart">Vergleich zu allen Teilnehmern einblenden.</q-toggle> -->
    <span v-if="hasPopulationData && isBarChart && !hideOrderToggle">
      <br>
      <br>
      <p>Wenn Sie mögen, dann können Sie die Sortierung im Diagramm ändern:<br>
        <q-toggle
          class="q-ma-none q-mt-none"
          v-model="sortByPopulation"
          :false-value="false"
          :true-value="true"
          color="grey"
          size="xl"
          checked-icon="mdi-account-group-outline"
          unchecked-icon="mdi-account-outline"
          :label="sortByPopulation ? 'Sortiert nach der Bewertung aller Teilnehmenden' : 'Sortiert nach Ihrer Bewertung' "
        />
      </p>

    </span>
    <br>

  </div>
</template>


<script>
import ChartBar from "src/components/charts/ChartBar";
import ChartRadar from "src/components/charts/ChartRadar";
import ChartPie from "src/components/charts/ChartPie";

export default {
  name: "ContentTreeChart",
  props: {
    chartType: {},
    addPersonalData: { default: () => true },
    nodes: {},
    hideOrderToggle: {},
    // sortByPopulation: {
    //   default: false,
    // },
  },
  components: {
    ChartBar,
    ChartRadar,
    ChartPie,
  },

  data() {
    return {
      sortByPopulation: false,
    };
  },

  computed: {
    // chartEntries() {
    //   return this.rootElements.map(
    //     (child) => this.contenttree.entries[child.id]
    //   );
    // },

    isBarChart() {
      return this.chartType == "chartBar";
    },
    sortedChartEntries() {
      // deep copy
      // console.log(this.nodes, "all population")
      const tmp_nodes = [...this.nodes];

      if (this.sortByPopulation && this.hasPopulationData) {
        return tmp_nodes.sort((a, b) => b.content?.S?.SA - a.content?.S?.SA);
      } else {
        return tmp_nodes.sort(
          (a, b) => b.progression?.salience - a.progression?.salience
        );
      }
    },
    chartBarPersonalData() {
      if (!this.addPersonalData) {
        return null;
      }
      return this.sortedChartEntries.map(
        (entry) => entry.progression?.salience
      );
    },
    chartBarLabels() {
      return this.sortedChartEntries.map((entry) => entry.content?.title);
    },
    chartRadarPersonalData() {
      // console.log(this.entries)
      return this.sortedChartEntries.map(
        (entry) => entry.progression?.salience
      );
    },
    chartRadarLabels() {
      return this.sortedChartEntries.map((entry) => entry.content?.title);
    },
    chartBarPopulationData() {
      return this.sortedChartEntries.map((entry) => entry.content?.S?.SA);
    },
    hasPopulationData() {
      return !!this.nodes.find((entry) => this.$loaded(entry.content?.S?.SA));
    },
  },
};
</script>