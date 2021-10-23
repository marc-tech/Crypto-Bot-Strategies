const BaseStrategy = require('./baseStrategy');

module.exports = class Strategy1 extends BaseStrategy {
  constructor() {
    super();
  }

  run(candle) {
    if (!this.imIn && candle.ema100 < candle.high) {
      this.buy(candle);
    } else if (this.imIn && candle.ema100 > candle.high) {
      this.sell(candle);
    }
  }
};
