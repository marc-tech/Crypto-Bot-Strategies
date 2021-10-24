module.exports = class BaseStrategy {
  constructor(imIn = false, firstMise = 100) {
    this.firstMise = firstMise;
    this.money = firstMise;
    this.currentMoney = firstMise;
    this.imIn = imIn;
    this.firstBuy = false;
    this.refChart = [];
    this.strategyChart = [];
    this.xAxisPlotLines = [];
    this.lastBuy = 0;
    this.lastSell = 0;
  }

  run(candle) {
    // override this function to create a stategy
  }

  parseCandles(analysedCandles) {
    let index = 0;

    for (const candle of analysedCandles) {
      if (index > 150) {
        this.run(candle);
      }

      this.processRefChart(candle);
      this.processStrategyChart(candle);
      index++;
    }

    return {
      refChart: this.refChart,
      strategyChart: this.strategyChart,
      xAxisPlotLines: this.xAxisPlotLines,
      gain: this.getGain()
    };
  }

  processRefChart(candle) {
    let value = this.firstBuy
      ? this.currentMoney * parseFloat(candle.close)
      : this.currentMoney;

    this.refChart.push([candle.openTime, value]);
  }

  processStrategyChart(candle) {
    let value = this.imIn
      ? parseFloat(this.money) * parseFloat(candle.close)
      : parseFloat(this.money);

    this.strategyChart.push([candle.openTime, value]);
  }

  getGain() {
    let refMoney = this.refChart[this.refChart.length - 1][1];
    let strategyMoney = this.strategyChart[this.strategyChart.length - 1][1];

    return strategyMoney - refMoney;
  }

  calculateChange(a, b) {
    return ((a - b) / b) * 100
  }

  buy(candle) {
    this.imIn = true;
    if (!this.firstBuy) {
      this.currentMoney = this.currentMoney / candle.close;
    }
    this.firstBuy = true;
    this.money = this.money / candle.close;
    this.lastBuy = candle.close;
    this.xAxisPlotLines.push({
      value: candle.openTime,
      dashStyle: 'dash',
      width: 1,
      color: 'green'
    });
  }

  sell(candle) {
    this.imIn = false;
    this.money = this.money * candle.close;
    this.lastSell = candle.close;
    this.xAxisPlotLines.push({
      value: candle.openTime,
      dashStyle: 'dash',
      width: 1,
      color: 'red'
    });
  }
};
