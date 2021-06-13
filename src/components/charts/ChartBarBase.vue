<script>
// HorizontalBar,
import { mixins, HorizontalBar } from "vue-chartjs";
import Chart from "chart.js";

export default {
  extends: HorizontalBar,
  mixins: [mixins.reactiveProp],
  props: ["options"],
  mounted() {
    Chart.defaults.global.defaultFontSize = 15;
    Chart.defaults.global.maintainAspectRatio = false;
    this.renderChart(this.chartData, this.options);
  },
};
</script>