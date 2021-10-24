<template>
  <div>
    <highcharts
      ref="Chart"
      :constructor-type="'stockChart'"
      :options="chartOptions"
    ></highcharts>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$emit('onChart', this.$refs.Chart);
  },
  props: {
    chartOptions: {
      type: Object,
      default: {}
    }
  }
};
</script>
