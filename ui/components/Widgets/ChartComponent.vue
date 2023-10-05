<template>
  <div>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chart: null,
    };
  },
  props: {
    chartData: {
      type: Object,
      required: true,
    },
    chartOptions: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    this.renderChart();
  },
  methods: {
    renderChart() {
      const ctx = this.$refs.chartCanvas.getContext("2d");
      this.chart = new Chart(ctx, {
        type: "line",
        data: this.chartData,
        options: this.chartOptions
      });
    },
  },
  watch: {
    chartData(newData) {
      if (this.chart) {
        this.chart.data = newData;
        this.chart.update();
      }
    },
    chartOptions(newOptions) {
      if (this.chart) {
        this.chart.options = newOptions;
        this.chart.update();
      }
    },
  },
};
</script>

<style scoped>
div{
    height: 100%;
}
</style>
