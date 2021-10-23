import Vue from 'vue';
import App from './App.vue';
import router from './router';
import Binance from 'binance-api-node';
import Highcharts from 'highcharts';
import HighchartsVue from 'highcharts-vue';
import stockInit from 'highcharts/modules/stock';

if (typeof Highcharts === 'object') {
  stockInit(Highcharts);
}
Vue.use(HighchartsVue);

Vue.config.productionTip = false;

Vue.prototype.$binanceApi = Binance({
  useServerTime: true,
  apiKey: process.env.VUE_APP_BINANCE_API_KEY,
  apiSecret: process.env.VUE_APP_BINANCE_API_SECRET,
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
