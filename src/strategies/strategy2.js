const BaseStrategy = require('./baseStrategy');

module.exports = class Strategy2 extends BaseStrategy {
  constructor() {
    super();
  }

  run(candle) {
    if (
      !this.imIn &&
      candle.sentiment < 150 &&
      candle.averageGain > 15 &&
      candle.averageLoss < 10
    ) {
      this.buy(candle);
    } else if (
      this.imIn &&
      // (candle.sentiment > 200 || candle.ema20 > candle.low) &&
      candle.averageLoss > 15 &&
      candle.averageGain < 10
    ) {
      this.sell(candle);
    }
  }
};
