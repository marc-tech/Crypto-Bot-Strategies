const BaseStrategy = require('./baseStrategy');

module.exports = class Strategy1 extends BaseStrategy {
  constructor() {
    super();
  }

  run(candle) {
    console.log(candle.averageGain);
    if (!this.imIn && candle.ema20 < candle.high) {
      this.buy(candle);
    } else if (this.imIn && candle.ema20 > candle.low) {
      // console.log('sell', candle.averageLoss);
      this.sell(candle);
    }
  }
};
