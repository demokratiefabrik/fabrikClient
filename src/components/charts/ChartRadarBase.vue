<script>
import { Radar, mixins } from "vue-chartjs";
import Chart from "chart.js";

export default {
  extends: Radar,
  mixins: [mixins.reactiveProp],
  props: ["options"],
  mounted() {
    Chart.defaults.global.defaultFontFamily = "Open Sans";
    Chart.defaults.global.defaultFontSize = 15;
    this.renderChart(this.chartData, this.options);
  },
};
</script>