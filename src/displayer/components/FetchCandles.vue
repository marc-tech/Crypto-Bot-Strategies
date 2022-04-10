<template>
  <div class="bg-green-600 p-3 text-center">
    <select
      class="border-none h-10 rounded-l-lg outline-none"
      v-model="interval"
    >
      <option v-for="e in INTERVALS" :key="e" :value="e">{{ e }}</option>
    </select>
    <select class="border-none h-10 outline-none w-40" v-model="symbol">
      <option v-for="e in SYMBOLS" :key="e" :value="e">{{ e }}</option>
    </select>
    <!-- <input class="border px-2 py-2 rounded-lg" v-model="symbol" /> -->
    <button
      class="border bg-blue-500 text-white px-5 rounded-r-lg h-10 outline-none"
      @click="fetchCandles({ interval, symbol })"
    >
      RUN
    </button>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { INTERVALS, SYMBOLS } from '@/displayer/utils/var';

export default {
  created() {
    // this.fetchCandles();
  },
  methods: {
    ...mapActions(['fetchCandles']),
    async fetchCandlestmp() {
      this.clearChart();
      let candles = await this.$binanceApi.candles({
        symbol: this.symbol.replace('/', ''),
        interval: this.interval,
        limit: 1000
      });

      let { candlesChart, analysedCandles } = StrategiesRunner.CandlesParser(
        candles
      );

      this.candlesStockChart = {
        xAxis: {
          events: {
            // setExtremes: this.syncExtremes,
            afterSetExtremes: e => {
              this.updateExtremes(e);
            }
          }
        },
        legend: {
          enabled: true
        },
        credits: {
          enabled: false
        },

        plotOptions: {
          series: {
            showInLegend: true,
            point: {
              events: {
                mouseOver: e => {
                  this.candleData = analysedCandles.find(
                    c => c.openTime === e.target.x
                  );
                  // this.mouseOver(e);
                }
              }
            }
          }
        },
        // series: [{ data: [...Array(100)].map(Math.random) }]
        series: [
          {
            name: this.symbol,
            type: 'candlestick',
            threshold: null,
            data: candlesChart,
            tooltip: {
              valueDecimals: 2
            }
          }
          // {
          //   type: 'line',
          //   threshold: null,
          //   data: analysedCandles
          //     .filter(e => e.ema20)
          //     .map(e => [e.openTime, e.ema100]),
          //   tooltip: {
          //     valueDecimals: 2
          //   }
          // },
          // {
          //   type: 'line',
          //   color: 'green',
          //   threshold: null,
          //   data: analysedCandles
          //     .filter(e => e.ichimokuCloud)
          //     .map(e => [e.openTime, e.ichimokuCloud.spanA]),
          //   tooltip: {
          //     valueDecimals: 2
          //   }
          // },
          // {
          //   type: 'line',
          //   color: 'red',
          //   threshold: null,
          //   data: analysedCandles
          //     .filter(e => e.ichimokuCloud)
          //     .map(e => [e.openTime, e.ichimokuCloud.spanB])
          // }
        ]
      };
      this.analysedCandles = analysedCandles;
      this.rsi = analysedCandles.map(e => [e.openTime, e.rsi ? e.rsi : 0]);

      this.runStrategies();
    }
  },
  data() {
    return {
      INTERVALS,
      SYMBOLS,
      symbol: SYMBOLS[0],
      interval: INTERVALS[0]
    };
  }
};
</script>
