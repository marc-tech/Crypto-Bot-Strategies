import Vue from 'vue';
import App from '@/displayer/App.vue';
import router from '@/displayer/router';
import Binance from 'binance-api-node';
import Highcharts from 'highcharts';
import HighchartsVue from 'highcharts-vue';
import stockInit from 'highcharts/modules/stock';
import '@/displayer/index.css';

/**
 * Override the reset function, we don't need to hide the tooltips and
 * crosshairs.
 */
Highcharts.Pointer.prototype.reset = function() {
  return undefined;
};

/**
 * Highlight a point by showing tooltip, setting hover state and draw crosshair
 */
Highcharts.Point.prototype.highlight = function(event) {
  event = this.series.chart.pointer.normalize(event);
  this.onMouseOver(); // Show the hover marker
  this.series.chart.tooltip.refresh(this); // Show the tooltip
  this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
};

if (typeof Highcharts === 'object') {
  stockInit(Highcharts);
}
Vue.use(HighchartsVue);

Vue.config.productionTip = false;

Vue.prototype.$binanceApi = Binance({
  apiKey: process.env.VUE_APP_BINANCE_API_KEY,
  apiSecret: process.env.VUE_APP_BINANCE_API_SECRET
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
