<template>
  <div class="grid grid-cols-6">
    <!-- <button @click="clearChart()">clear</button> -->
    <div class="col-span-5">
      <select class="border py-2 rounded-lg" v-model="interval">
        <option v-for="e in INTERVALS" :key="e" :value="e">{{ e }}</option>
      </select>
      <select class="border py-2 rounded-lg" v-model="symbol">
        <option v-for="e in SYMBOLS" :key="e" :value="e">{{ e }}</option>
      </select>
      <!-- <input class="border px-2 py-2 rounded-lg" v-model="symbol" /> -->
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
      <Chart v-if="selectedChart" :chartOptions="selectedChart" />
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
      <CandleInfo
        @itemClick="handleItemChart"
        :selectedSeries="selectedSeries"
        class="mx-auto"
        :candle="candleData"
      />
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import StrategiesRunner from '@/strategies';
import CandlesChart from '@/displayer/components/CandlesChart';
import StockChart from '@/displayer/components/StockChart';
import Chart from '@/displayer/components/Chart';
import CandleInfo from '@/displayer/components/CandleInfo';
import { INTERVALS, SYMBOLS } from '@/displayer/utils/var';

export default {
  name: 'Home',
  components: { CandlesChart, Chart, StockChart, CandleInfo },
  async created() {
    await this.fetchCandles();
  },
  computed: {
    selectedSeries() {
      return this.candlesStockChart
        ? this.candlesStockChart.series.filter(e => e.name).map(e => e.name)
        : [];
    }
  },
  methods: {
    handleItemChart(key) {
      let index = this.candlesStockChart.series.findIndex(e => e.name === key);

      if (index == -1) {
        this.candlesStockChart.series.push({
          name: key,
          type: 'line',
          threshold: null,
          data: this.analysedCandles.map(e => [e.openTime, _.get(e, key)]),
          tooltip: {
            valueDecimals: 2
          }
        });
      } else {
        this.candlesStockChart.series.splice(index, 1);
      }
    },
    runStrategies() {
      for (const Strategy of StrategiesRunner.Strategies) {
        const strategy = new Strategy();
        const {
          refChart,
          strategyChart,
          xAxisPlotLines,
          gain
        } = strategy.parseCandles(this.analysedCandles);

        this.strategiesChart.push({
          title: {
            text: gain > 0 ? '+' + gain.toFixed(2) : gain.toFixed(2),
            style: { color: parseFloat(gain) > 0 ? 'green' : 'red' }
          },
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
      this.strategiesChart.forEach(e => e.destroy && e.destroy());
      this.strategiesChart = [];
      this.analysedCandles = [];
      this.charts = [];
    },
    async fetchCandles() {
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
    },
    updateExtremes({ min, max }) {
      for (const chart of this.charts) {
        chart.chart.xAxis[0].setExtremes(min, max);
      }
    }
  },
  data() {
    return {
      INTERVALS,
      SYMBOLS,
      symbol: SYMBOLS[0],
      interval: INTERVALS[0],
      selectedChart: null,
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
