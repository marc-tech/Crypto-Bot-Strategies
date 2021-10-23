<template>
  <div>
    <highcharts :options="chartOptions"></highcharts>
  </div>
</template>

<script>
export default {
  props: {
    chart: {
      type: Array,
      default: () => []
    },
    refChart: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      chartOptions: {
        series: [
          {
            color: 'black',
            data: this.refChart.map(e => e[1])
          },
          {
            color: 'green',
            data: this.chart.map(e => e[1])
          }
        ]
      }
    };
  }
};
</script>
