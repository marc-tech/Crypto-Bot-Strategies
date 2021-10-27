module.exports = class BaseStrategy {
  constructor(imIn = false, firstMise = 100) {
    this.firstMise = firstMise;
    this.baseMoney = firstMise;
    this.coinMoney = 0;
    this.currentMoney = firstMise;
    this.imIn = imIn;
    this.firstBuy = false;
    this.refChart = [];
    this.strategyChart = [];
    this.xAxisPlotLines = [];
  }

  run(candle) {
    // override this function to create a stategy
  }

  parseCandles(analysedCandles) {
    let index = 0;

    for (const candle of analysedCandles) {
      if (index > 200) {
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
      ? this.currentMoney * candle.close
      : this.currentMoney;

    this.refChart.push([candle.openTime, value]);
  }

  processStrategyChart(candle) {
    let value = this.baseMoney + this.coinMoney * candle.close;

    this.strategyChart.push([candle.openTime, value]);
  }

  getGain() {
    let refMoney = this.refChart[this.refChart.length - 1][1];
    let strategyMoney = this.strategyChart[this.strategyChart.length - 1][1];

    return strategyMoney - refMoney;
  }

  buy(candle, percent = 100) {
    if (this.canBuy()) {
      if (!this.firstBuy) {
        this.currentMoney = this.currentMoney / candle.close;
      }
      this.firstBuy = true;

      this.coinMoney += this.getPercent(percent, this.baseMoney) / candle.close;
      this.baseMoney -= this.getPercent(percent, this.baseMoney);

      this.xAxisPlotLines.push({
        value: candle.openTime,
        dashStyle: 'dash',
        width: 1,
        color: 'green'
      });
    }
  }

  canBuy() {
    return this.baseMoney > 10;
  }

  sell(candle, percent = 100) {
    if (this.canSell(candle.close)) {
      this.baseMoney += this.getPercent(percent, this.coinMoney) * candle.close;
      this.coinMoney -= this.getPercent(percent, this.coinMoney);

      this.xAxisPlotLines.push({
        value: candle.openTime,
        dashStyle: 'dash',
        width: 1,
        color: 'red'
      });
    }
  }

  canSell(price) {
    return this.coinMoney * price > 10;
  }

  scale(number, inMin, inMax, outMin = 0, outMax = 100) {
    return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }

  calculateChange(a, b) {
    return ((a - b) / b) * 100;
  }

  getPercent(percent, nb) {
    return (percent / 100) * nb;
  }
};
