<template>
  <div class="home">
    <!-- <button @click="clearChart()">clear</button> -->
    <select v-model="interval">
      <option value="1m">1m</option>
      <option value="3m">3m</option>
      <option value="5m">5m</option>
      <option value="15m">15m</option>
      <option value="1h">1h</option>
      <option value="4h">4h</option>
      <option value="1d">1d</option>
    </select>
    <input v-model="symbol" />
    <button @click="fetchCandles()">RUN</button>

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
    <h3 :style="`color: ${gain ? 'green' : 'red'}`">
      {{ gain > 0 ? '+' + gain.toFixed(2) : gain.toFixed(2) }}$
    </h3>
    <Chart
      v-if="strategyChart"
      :chartOptions="strategyChart"
      @onChart="chart => charts.push(chart)"
    />
  </div>
</template>

<script>
import StrategiesRunner from '@/strategies';
import CandlesChart from '@/displayer/components/CandlesChart';
import StockChart from '@/displayer/components/StockChart';
import Chart from '@/displayer/components/Chart';

export default {
  name: 'Home',
  components: { CandlesChart, Chart, StockChart },
  async created() {
    await this.fetchCandles();
  },
  methods: {
    runStrategy() {
      this.strategyChart = null;
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

      this.runStrategy();
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
