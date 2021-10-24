<template>
  <trading-vue :width="1500" :data="dc"></trading-vue>
</template>
<script>
import TradingVue from 'trading-vue-js';

export default {
  name: 'app',
  components: { TradingVue },
  props: {
    chartData: {
      type: Array,
      default: () => []
    },
    ema: {
      type: Array,
      default: () => []
    },
    rsi: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dc: {
        chart: {
          type: 'Candles',
          data: this.chartData
        },
        onchart: [
          {
            name: 'EMA, 100',
            type: 'EMA',
            data: this.ema
          }
        ],
        offchart: [
          {
            name: 'RSI, 14',
            type: 'RSI',
            data: this.rsi,
            settings: {
              upper: 70,
              lower: 30,
              backColor: '#9b9ba316',
              bandColor: '#666'
            }
          }
        ]
      }
    };
  }
};
</script>
