<template>
  <div class="home">
    <button @click="fetchCandles()">fetch candles</button>
    <button @click="clearChart()">clear</button>
    <input v-model="symbol" />

    <CandlesChart
      v-if="candlesChart.length"
      :chartData="candlesChart"
      :ema="ema"
      :rsi="rsi"
      style="margin: 30px auto"
    />

    <!-- <StockChart
      v-if="candlesChart.length"
      :chartData="candlesChart"
      :ema="ema"
    /> -->
    <button @click="runStrategy()">Run Strategy</button>

    <Chart v-if="refChart.length" :refChart="refChart" :chart="strategyChart" />
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
      const { refChart, strategyChart, gain } = Strategy.parseCandles(
        this.analysedCandles
      );
      this.refChart = refChart;
      console.log(strategyChart);
      this.strategyChart = strategyChart;
    },
    clearChart() {
      this.candlesChart = [];
      this.ema = [];
      this.refChart = [];
      this.strategyChart = [];
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

      this.candlesChart = candlesChart;
      this.analysedCandles = analysedCandles;
      this.ema = analysedCandles.map(e => [
        e.openTime,
        e.ema100 ? e.ema100 : 0
      ]);
      this.ema = this.ema.filter(e => e[1]);
      this.rsi = analysedCandles.map(e => [e.openTime, e.rsi ? e.rsi : 0]);
    }
  },
  data() {
    return {
      symbol: 'BTCUSDT',
      interval: '1m',
      candlesChart: [],
      analysedCandles: [],
      ema: [],
      rsi: [],
      refChart: [],
      strategyChart: []
    };
  }
};
</script>
