<template>
  <div class="home">
    <button @click="fetchCandles()">fetch candles</button>
    <button @click="clearChart()">clear</button>
    <input v-model="symbol" />

    <!-- <CandlesChart
      v-if="candlesChart.length"
      :chartData="candlesChart"
      :ema="ema"
      :rsi="rsi"
      style="margin: 30px auto"
    /> -->
    <!-- 
    <StockChart
      @onChart="chart => charts.push(chart)"
      v-if="candlesChart.length"
      :chartData="candlesChart"
      :ema="ema"
    /> -->
    <Chart
      v-if="candlesStockChart"
      :chartOptions="candlesStockChart"
      @onChart="chart => charts.push(chart)"
    />
    <button @click="runStrategy()">Run Strategy</button>

    <h1>{{ gain > 0 ? '+' + gain.toFixed(2) : gain.toFixed(2) }}$</h1>
    <Chart
      v-if="strategyChart"
      :chartOptions="strategyChart"
      @onChart="chart => charts.push(chart)"
    />
  </div>
</template>

<script>
import StrategiesRunner from '@/strategies';
import CandlesChart from '@/components/CandlesChart';
import StockChart from '@/components/StockChart';
import Chart from '@/components/Chart';

export default {
  name: 'Home',
  components: { CandlesChart, Chart, StockChart },
  async created() {
    await this.fetchCandles();
    this.runStrategy();
  },
  methods: {
    runStrategy() {
      let Strategy = new StrategiesRunner.Strategies[0]();
      const {
        refChart,
        strategyChart,
        xAxisPlotLines,
        gain
      } = Strategy.parseCandles(this.analysedCandles);

      this.strategyChart = {
        xAxis: {
          type: 'datetime',
          plotLines: xAxisPlotLines,
          events: {
            afterSetExtremes: e => {
              this.updateExtremes(e, 0);
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
      };
      this.gain = gain;
    },
    clearChart() {
      this.candlesStockChart = null;
      this.strategyChart = null;
      this.charts = [];
    },
    async fetchCandles() {
      let candles = await this.$binanceApi.candles({
        symbol: this.symbol,
        interval: this.interval,
        limit: 1000
      });

      const { candlesChart, analysedCandles } = StrategiesRunner.CandlesParser(
        candles
      );

      this.candlesStockChart = {
        xAxis: {
          events: {
            afterSetExtremes: e => {
              this.updateExtremes(e, 1);
            }
          }
        },
        credits: {
          enabled: false
        },
        title: {
          text: this.symbol
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
          {
            type: 'line',
            threshold: null,
            data: analysedCandles
              .map(e => [e.openTime, e.ema100 ? e.ema100 : 0])
              .filter(e => e[1]),
            tooltip: {
              valueDecimals: 2
            }
          }
        ]
      };
      this.analysedCandles = analysedCandles;
      this.rsi = analysedCandles.map(e => [e.openTime, e.rsi ? e.rsi : 0]);
    },
    updateExtremes({ min, max }, index) {
      this.charts[0].chart.xAxis[0].setExtremes(min, max);
      this.charts[1].chart.xAxis[0].setExtremes(min, max);
    }
  },
  data() {
    return {
      symbol: 'BTCUSDT',
      interval: '1m',
      charts: [],
      candlesChart: [],
      analysedCandles: [],
      rsi: [],
      candlesStockChart: null,
      strategyChart: null,
      gain: 0
    };
  }
};
</script>
