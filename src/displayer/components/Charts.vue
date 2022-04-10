<template>
  <div v-if="candlesStockChart">
    <Chart :chartOptions="candlesStockChart" />
    <div class="flex flex-wrap">
      <div
        v-for="(name, index) in strategyNames"
        :key="index"
        class="bg-gray-200 rounded text-blue-800 m-3 p-3 flex items-center justify-between"
      >
        Run: {{ name }}
        <i class="fas fa-play text-green-500 cursor-pointer ml-2" />
      </div>
    </div>
    <!-- <Chart v-if="selectedChart" :chartOptions="selectedChart" /> -->
    <!-- <div
      v-if="strategiesChart.length"
      @mouseover="highchartTooltip"
      @mouseleave="highchartTooltip"
    >
      <Chart
        v-for="(strategyChart, index) in strategiesChart"
        :key="index"
        :chartOptions="strategyChart"
        @onChart="addChart"
      />
    </div> -->
  </div>
</template>

<script>
import Chart from '@/displayer/components/Chart';
import { Strategies } from '@/strategies';
import { mapGetters } from 'vuex';

export default {
  components: { Chart },
  computed: {
    ...mapGetters(['candlesChart', 'analysedCandles']),
    strategyNames() {
      return Strategies.map(e => e.name);
    },
    candlesStockChart() {
      if (this.candlesChart && this.analysedCandles) {
        return {
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
                    // this.candleData = analysedCandles.find(
                    //   c => c.openTime === e.target.x
                    // );
                    // this.mouseOver(e);
                  }
                }
              }
            }
          },
          series: [
            {
              name: 'serie',
              type: 'candlestick',
              threshold: null,
              data: this.candlesChart,
              tooltip: {
                valueDecimals: 2
              }
            }
          ]
        };
      }
      return null;
    }
  }
};
</script>
