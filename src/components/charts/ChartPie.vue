<template>
  <ChartPieBase
    v-if="this.public_profile"
    :chart-data="barChartData"
    :options="barChartOptions"
    :style="css"
  />

</template>


<script>
import ChartPieBase from "./ChartPieBase";
import { mapGetters } from "vuex";
import { linebreaker } from "./lib";

export default {
  components: {
    ChartPieBase,
  },
  props: {
    // Basic type check (`null` and `undefined` values will pass any type validation)
    personalData: Array,
    populationData: {
      type: Array,
    },

    labels: Array,
  },
  data: () => ({}),
  computed: {
    barChartOptions() {
      return {
        tooltips: {
          mode: "label",
          callbacks: {
            label: function (tooltipItem, data) {
              var indice = tooltipItem.index;
              return `${data.labels[indice]}: ${data.datasets[0].data[indice]}%`;
            },
          },
        },

        // tooltips: {
        //   mode: "label",
        //   // scale: {
        //   //   // angleLines: {
        //   //   //   display: true,
        //   //   // },
        //   //   // pointLabels: {
        //   //   //   fontSize: "13",
        //   //   // },
        //   //   // ticks: {
        //   //   //   // maxTicksLimit: 7,
        //   //   //   stepSize: 25,
        //   callback: function (val, index) {
        //     return index % 2 === 0 ? `${val}%` : "";
        //   },
        //   //   // },
        // },
        layout: {
          padding: {
            left: 5,
            right: 5,
          },
        },
      };
    },

    css() {
      return {
        height: `500px`,
      };
    },

    smallDisplay() {
      return this.$q.screen.lt.md;
    },
    linebreakLabels() {
      const labs = this.labels;
      return labs.map((lab) => linebreaker(lab, 40, 2));
    },
    normalizedPopulationData() {
      let normalizedPopulationData = this.populationData;
      const sum = normalizedPopulationData.reduce((a, b) => a + b, 0);
      normalizedPopulationData = normalizedPopulationData.map((a) =>
        Math.round((100 / sum) * a)
      );
      return normalizedPopulationData;
    },
    barChartData() {
      const datasets = [];

      if (this.populationData) {
        datasets.push({
          barThickness: this.barThickness,
          backgroundColor: [
            "rgb(128, 128, 0)",
            "rgb(0, 255, 0)",
            "rgb(0, 255, 255)",
            "rgb(255, 0, 255)",
            "rgb(128, 0, 128)",
            "rgb(192, 192, 192)",
            "rgb(255, 0, 0)",
            "rgb(128, 0, 0)",
            "rgb(0, 0, 255)",
            "rgb(255, 205, 86)",
          ],
          data: this.normalizedPopulationData,
        });
      }

      return {
        labels: this.linebreakLabels,
        datasets,
      };
    },

    ...mapGetters({
      lightProfileColor: "publicprofilestore/lightProfileColor",
      profileColor: "publicprofilestore/profileColor",
      public_profile: "publicprofilestore/get_public_profile",
    }),
  },

  created() {
    // SMALL DISPLAY
    // if (this.smallDisplay) {
    //   this.barChartOptions.scales.yAxes[0].ticks.mirror = true;
    // }
  },
};
</script>
