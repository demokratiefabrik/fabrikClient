<template>
  <ChartBarBase
    v-if="this.public_profile"
    :chart-data="barChartData"
    :options="barChartOptions"
    :style="css"
  />
</template>


<script>
import ChartBarBase from "./ChartBarBase";
import { mapGetters } from "vuex";
import { linebreaker } from "./lib";

export default {
  components: {
    ChartBarBase,
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
        scales: {
          xAxes: [
            {
              ticks: {
                suggestedMin: 0,
                suggestedMax: 100,
                callback: function (val, index) {
                  return val;
                },
              },
              gridLines: {
                display: false,
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                mirror: this.smallDisplay,
              },
            },
          ],
        },
        layout: {
          padding: {
            left: 5,
            right: 5,
          },
        },
        maintainAspectRatio: false,
      };
    },

    css() {
      return {
        height: `${this.labels.length * 80 + 100}px`,
      };
    },

    smallDisplay() {
      return this.$q.screen.lt.md;
    },
    linebreakLabels() {
      const labs = this.labels;
      return labs.map((lab) => linebreaker(lab, 40, 4));
    },

    barThickness() {
      return this.populationData ? 20 : 40;
    },

    barChartData() {
      const datasets = [
        {
          label: this.public_profile?.U,
          backgroundColor: this.smallDisplay
            ? this.lightProfileColor
            : this.profileColor,
          data: this.personalData,
          barThickness: this.barThickness,
        },
      ];

      if (this.populationData) {
        datasets.push({
          label: "Alle Teilnehmende",
          barThickness: this.barThickness,
          data: this.populationData,
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
    if (this.smallDisplay) {
      this.barChartOptions.scales.yAxes[0].ticks.mirror = true;
    }
  },
};
</script>
