<template>
  <ChartRadarBase
    v-if="this.public_profile"
    :chart-data="radarChartData"
    :options="radarChartOptions"
    style="width:100%; max-width:700px;"
  />
</template>


<script>
import ChartRadarBase from "./ChartRadarBase";
import { mapGetters } from "vuex";
import { linebreaker } from "./lib";

export default {
  components: {
    ChartRadarBase,
  },
  props: {
    personalData: Array,
    populationData: Array,
    labels: Array,
  },
  data: () => ({
    radarChartOptions: {
      plugins: {
        legend: {
          labels: {
            font: {
              size: 14,
            },
          },
        },
      },
      // fontFamily: "Open Sans",
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 10,
          bottom: 10,
        },
      },
      scale: {
        angleLines: {
          display: true,
        },
        pointLabels: {
          fontSize: "13",
        },
        ticks: {
          // maxTicksLimit: 7,
          stepSize: 25,
          callback: function (val, index) {
            return [0, 1, 2, 3, 4].includes(index % 4) ? `${val}` : ""; // PERCENT
          },

          suggestedMin: 0,
          suggestedMax: 100,
        },
      },
    },
  }),

  computed: {
    linebreakLabels() {
      const labels = this.labels.map((lab) => linebreaker(lab, 15, 3));
      return labels;
    },

    radarChartData() {
      const datasets = [
        {
          label: `${this.public_profile?.U} (Sie)`,
          data: this.personalData,
          backgroundColor: this.lightProfileColor,
          borderColor: this.profileColor,
          borderRadius: 10,
        },
      ];
      if (this.populationData) {
        datasets.push({
          label: "Alle Teilnehmende",
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
};
</script>
