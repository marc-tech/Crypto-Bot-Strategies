import Vue from 'vue';
import Vuex from 'vuex';
import app from '@/main';
import { CandlesParser } from '@/strategies';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    candles: null,
    candlesChart: null,
    analysedCandles: null
  },
  actions: {
    async fetchCandles({ commit }, payload) {
      const candles = await app.$binanceApi.candles({
        symbol: payload.symbol.replace('/', ''),
        interval: payload.interval,
        limit: 1000
      });
      commit('setCandles', candles);
      const { candlesChart, analysedCandles } = CandlesParser(candles);
      commit('setChart', candlesChart);
      commit('setAnalysedCandles', analysedCandles);
    },
    runStrategie() {}
  },
  mutations: {
    setCandles(state, candles) {
      state.candles = candles;
    },
    setChart(state, candles) {
      state.candlesChart = candles;
    },
    setAnalysedCandles(state, analysedCandles) {
      state.analysedCandles = analysedCandles;
    }
  },
  getters: {
    candles: state => state.candles,
    candlesChart: state => state.candlesChart,
    analysedCandles: state => state.analysedCandles
  }
});

export default store;
