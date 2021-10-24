<template>
  <Card>
    <highcharts
      ref="Chart"
      :constructor-type="'stockChart'"
      :options="stockOptions"
    />
  </Card>
</template>

<script>
export default {
  name: 'UIStockChart',
  mounted() {
    this.$emit('onChart', this.$refs.Chart);
  },
  props: {
    symbol: {
      type: String,
      default: 'title'
    },
    chartData: {
      type: Array,
      required: true
    },
    ema: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      stockOptions: {
        rangeSelector: {
          selected: 3
        },
        credits: {
          enabled: false
        },
        // title: {
        //   text: this.symbol + ' Stock Price'
        // },
        series: [
          {
            name: this.symbol,
            type: 'candlestick',
            threshold: null,
            data: this.chartData,
            tooltip: {
              valueDecimals: 2
            }
          },
          {
            name: this.symbol,
            type: 'line',
            threshold: null,
            data: this.ema,
            tooltip: {
              valueDecimals: 2
            }
          }
        ]
      }
    };
  }
};
</script>
