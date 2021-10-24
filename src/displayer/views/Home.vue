<template>
  <div class="grid grid-cols-6">
    <!-- <button @click="clearChart()">clear</button> -->
    <div class="col-span-5">
      <select class="border py-2 rounded-lg" v-model="interval">
        <option value="1m">1m</option>
        <option value="3m">3m</option>
        <option value="5m">5m</option>
        <option value="15m">15m</option>
        <option value="1h">1h</option>
        <option value="4h">4h</option>
        <option value="1d">1d</option>
      </select>
      <input class="border px-2 py-2 rounded-lg" v-model="symbol" />
      <button
        class="border bg-blue-500 text-white px-3 py-2 rounded-lg"
        @click="fetchCandles()"
      >
        RUN
      </button>

      <Chart
        v-if="candlesStockChart"
        :chartOptions="candlesStockChart"
        @onChart="chart => charts.push(chart)"
      />
      <!-- <Chart v-if="tmp" :chartOptions="tmp" /> -->
      <h3 :style="`color: ${gain ? 'green' : 'red'}`">
        <!-- {{ gain > 0 ? '+' + gain.toFixed(2) : gain.toFixed(2) }}$ -->
        {{ gain }}
      </h3>
      <div v-if="strategiesChart.length">
        <Chart
          v-for="(strategyChart, index) in strategiesChart"
          :key="index"
          :chartOptions="strategyChart"
          @onChart="chart => charts.push(chart)"
        />
      </div>
    </div>

    <div>
      <CandleInfo class="mx-auto" :candle="candleData" />
    </div>
  </div>
</template>

<script>
import StrategiesRunner from '@/strategies';
import CandlesChart from '@/displayer/components/CandlesChart';
import StockChart from '@/displayer/components/StockChart';
import Chart from '@/displayer/components/Chart';
import CandleInfo from '@/displayer/components/CandleInfo';

export default {
  name: 'Home',
  components: { CandlesChart, Chart, StockChart, CandleInfo },
  async created() {
    await this.fetchCandles();
  },
  methods: {
    runStrategies() {
      this.strategiesChart = [];
      for (const Strategy of StrategiesRunner.Strategies) {
        const strategy = new Strategy();
        const {
          refChart,
          strategyChart,
          xAxisPlotLines,
          gain
        } = strategy.parseCandles(this.analysedCandles);

        this.gain += ' ' + gain;
        this.strategiesChart.push({
          xAxis: {
            type: 'datetime',
            plotLines: xAxisPlotLines,
            events: {
              afterSetExtremes: e => {
                this.updateExtremes(e);
              }
            }
          },
          series: [
            {
              type: 'line',
              color: 'black',
              data: refChart
            },
            {
              type: 'line',
              color: 'green',
              data: strategyChart
            }
          ]
        });
      }
    },
    clearChart() {
      this.candlesStockChart = null;
      this.strategiesChart.forEach(e => e.destroy());
      this.strategiesChart = [];
      this.charts = [];
    },
    async fetchCandles() {
      let candles = await this.$binanceApi.candles({
        symbol: this.symbol,
        interval: this.interval,
        limit: 1000
      });

      let { candlesChart, analysedCandles } = StrategiesRunner.CandlesParser(
        candles
      );

      this.tmp = analysedCandles.map(e => [e.openTime, e.averageGain]);

      this.tmp = {
        series: [
          {
            type: 'line',
            color: 'green',
            threshold: null,
            data: this.tmp,
            tooltip: {
              valueDecimals: 2
            }
          }
        ]
      };
      this.candlesStockChart = {
        xAxis: {
          events: {
            afterSetExtremes: e => {
              this.updateExtremes(e);
            }
          }
        },
        credits: {
          enabled: false
        },

        plotOptions: {
          series: {
            point: {
              events: {
                mouseOver: e => {
                  this.candleData = analysedCandles.find(
                    c => c.openTime === e.target.x
                  );
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
          },
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
          {
            type: 'line',
            color: 'green',
            threshold: null,
            data: analysedCandles
              .filter(e => e.ichimokuCloud)
              .map(e => [e.openTime, e.ichimokuCloud.spanA]),
            tooltip: {
              valueDecimals: 2
            }
          },
          {
            type: 'line',
            color: 'red',
            threshold: null,
            data: analysedCandles
              .filter(e => e.ichimokuCloud)
              .map(e => [e.openTime, e.ichimokuCloud.spanB])
          }
        ]
      };
      this.analysedCandles = analysedCandles;
      this.rsi = analysedCandles.map(e => [e.openTime, e.rsi ? e.rsi : 0]);

      this.runStrategies();
    },
    updateExtremes({ min, max }) {
      for (const chart of this.charts) {
        chart.chart.xAxis[0].setExtremes(min, max);
      }
    }
  },
  data() {
    return {
      symbol: 'BTCUSDT',
      interval: '1m',
      tmp: null,
      candleData: {},
      charts: [],
      candlesChart: [],
      analysedCandles: [],
      rsi: [],
      candlesStockChart: null,
      strategiesChart: [],
      gain: ''
    };
  }
};
</script>
