const BaseStrategy = require('./baseStrategy');

module.exports = class Strategy1 extends BaseStrategy {
  constructor() {
    super();
  }

  run(candle) {
    if (this.canBuy() && candle.sentiment && candle.sentiment <= 50) {
      let buyPercent = 50 - candle.sentiment;
      this.buy(candle, buyPercent);
    } else if (
      this.canSell(candle.close) &&
      candle.sentiment &&
      candle.sentiment > 180
    ) {
      let sellPercent = this.scale(candle.sentiment, 180, 255);
      this.sell(candle, sellPercent);
    }
  }
};
