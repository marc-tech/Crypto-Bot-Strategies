const BaseStrategy = require('./baseStrategy');

module.exports = class Strategy1 extends BaseStrategy {
  constructor() {
    super();
  }

  run(candle) {
    if (!this.imIn && candle.sentiment < 120 && candle.ema50 < candle.high) {
      this.buy(candle);
    } else if (
      this.imIn &&
      ((candle.sentiment > 160 && candle.ema20 > candle.low) ||
        candle.sentiment > 200)
    ) {
      this.sell(candle);
    }
  }
};
