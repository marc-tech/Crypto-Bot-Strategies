// const indicators = require('slz-indicators');
var RSI = require('technicalindicators').RSI;
const OFFSET = 50;

module.exports = function(candles, index) {
  let results = {
    openTime: candles[index].openTime,
    open: parseFloat(candles[index].open),
    high: parseFloat(candles[index].high),
    low: parseFloat(candles[index].low),
    close: parseFloat(candles[index].close)
  };

  // =================================================================
  // medians
  // =================================================================
  if (index > 150) {
    results = { ...results, ...getMedians(candles, index) };
  }
  if (index > 50) {
    let values = candles.slice(index - 50, index).map(e => e.close);
    let rsi = RSI.calculate({ values, period: 14 });
    results.rsi = rsi[rsi.length - 1];
  }

  return results;
};

function getMedians(candles, index) {
  // const lengths = ['9', '26', '50', '100', '150'];
  const lengths = ['100'];
  let lengthsIndex = 0;
  let results = {};

  let ema = 0;
  let open = 0;
  let high = 0;
  let low = 0;

  for (let i = 0; i <= parseFloat(lengths[lengths.length - 1]); i++) {
    ema += parseFloat(candles[index - i].close);
    open += parseFloat(candles[index - i].open);
    high += parseFloat(candles[index - i].high);
    low += parseFloat(candles[index - i].low);

    if (i == parseInt(lengths[lengthsIndex])) {
      results['ema' + lengths[lengthsIndex]] = ema / (i + 1);
      results['open' + lengths[lengthsIndex]] = open / (i + 1);
      results['high' + lengths[lengthsIndex]] = high / (i + 1);
      results['low' + lengths[lengthsIndex]] = low / (i + 1);
      lengthsIndex++;
    }
  }

  return results;
}

const tmp = new (class candleAnalyser {
  init(candles, index) {
    if (index < OFFSET) {
      this.candle = null;
      return false;
    }
    this.candles = candles;
    this.index = index;
    this.candle = candles[index];
    this.prevcandle = candles[index - 1];
    this.lastTwoPrevcandles = {
      open: [this.prevcandle.open, this.candle.open],
      high: [this.prevcandle.high, this.candle.high],
      close: [this.prevcandle.close, this.candle.close],
      low: [this.prevcandle.low, this.candle.low]
    };
    this.lastThreePrevcandles = {
      open: [candles[index - 2].open, this.prevcandle.open, this.candle.open],
      high: [candles[index - 2].high, this.prevcandle.high, this.candle.high],
      close: [
        candles[index - 2].close,
        this.prevcandle.close,
        this.candle.close
      ],
      low: [candles[index - 2].low, this.prevcandle.low, this.candle.low]
    };
    return this;
  }

  getLowMedium(length) {
    if (!this.candle || length > this.index) {
      return false;
    }

    let p = 0;

    for (let i = 0; i < length; i++) {
      p += parseFloat(this.candles[this.index - i].low);
    }

    let res = (p = p / length);
    return res;
  }

  getHighMedium(length) {
    if (!this.candle || length > this.index) {
      return false;
    }

    let p = 0;

    for (let i = 0; i < length; i++) {
      p += parseFloat(this.candles[this.index - i].high);
    }

    let res = (p = p / length);
    return res;
  }

  getEMAs(length) {
    if (!this.candle || length > this.index) {
      return false;
    }

    let p = 0;

    for (let i = 0; i < length; i++) {
      p += parseFloat(this.candles[this.index - i].close);
    }

    let res = (p = p / length);
    return res;
  }

  getEMA50(index = null) {
    if (!index) {
      index = this.index;
    }
    if (!this.candle) {
      return false;
    }

    let length = 50;
    let p = 0;

    for (let i = 1; i < length; i++) {
      p += parseFloat(this.candles[index - i].close);
    }

    let res = (p = p / length);
    return res;
  }

  isEMA50GoUp() {
    if (!this.candle || this.index < 51) {
      return false;
    }

    let EMA50 = this.getEMA50();
    let lastEMA50 = this.getEMA50(this.index - 1);

    return EMA50 > lastEMA50;
  }

  isEMA50GoDown() {
    if (!this.candle || this.index < 51) {
      return false;
    }

    let EMA50 = this.getEMA50();
    let lastEMA50 = this.getEMA50(this.index - 1);

    return EMA50 < lastEMA50;
  }

  getInfo(candle) {
    let top = candle.high - candle.open;
    let body = candle.open - candle.close;
    let bottom = candle.close - candle.low;
    let isUp = false;

    if (this.candle.open < candle.close) {
      top = candle.high - candle.close;
      body = candle.close - candle.open;
      bottom = candle.open - candle.low;
      isUp = true;
    }

    return { top, body, bottom, isUp };
  }

  starNight() {
    if (!this.candle) {
      return false;
    }

    let c1 = this.candles[this.index - 2];
    let c2 = this.candles[this.index - 1];
    let c3 = this.candle;

    let i1 = this.getInfo(c1);
    let i2 = this.getInfo(c2);
    let i3 = this.getInfo(c3);

    if (i1.body > i1.top + i1.bottom && i1.isUp) {
      if (i2.body < i2.top + i2.bottom) {
        if (!i3.isUp && i3.body > i3.top + i3.bottom) {
          return true;
        }
      }
    }
    return false;
  }

  starNightBuy() {
    if (!this.candle) {
      return false;
    }

    let c1 = this.candles[this.index - 2];
    let c2 = this.candles[this.index - 1];
    let c3 = this.candle;

    let i1 = this.getInfo(c1);
    let i2 = this.getInfo(c2);
    let i3 = this.getInfo(c3);

    if (!i1.isUp && i1.body > i1.top + i1.bottom) {
      if (i2.body < i2.top + i2.bottom) {
        if (i3.isUp && i3.body > i3.top + i3.bottom) {
          return true;
        }
      }
    }
    return false;
  }

  rebound() {
    if (!this.candle) {
      return false;
    }

    let low =
      this.candle.open > this.candle.close
        ? this.candle.close - this.candle.low
        : this.candle.open - this.candle.low;
    let prevLow =
      this.candles[this.index - 1].open > this.candles[this.index - 1].close
        ? this.candles[this.index - 1].close - this.candles[this.index - 1].low
        : this.candles[this.index - 1].open - this.candles[this.index - 1].low;
    let bottom =
      this.candle.open > this.candle.close
        ? this.candle.close
        : this.candle.open;
    let prevBottom =
      this.candles[this.index - 1].open > this.candles[this.index - 1].close
        ? this.candles[this.index - 1].close
        : this.candles[this.index - 1].open;

    let b = bottom - prevBottom;
    let bm = (parseFloat(bottom) + parseFloat(prevBottom)) / 2;

    if (b < 0) {
      b = b * -1;
    }

    if (b < bm / 1000 && low > 0 && prevLow > 0) {
      return true;
    }
    return false;
  }

  getChange() {
    if (!this.candle) {
      return 0;
    }

    return (
      ((this.candles[this.index].close - this.candles[this.index - 1].close) /
        this.candles[this.index - 1].close) *
      100
    );
  }

  closeHigher() {
    if (!this.candle) {
      return false;
    }

    return this.candles[this.index].close > this.candles[this.index - 1].high;
  }

  closeLower() {
    if (!this.candle) {
      return false;
    }
    return this.candles[this.index].close < this.candles[this.index - 1].low;
  }

  crossHighMedian() {
    if (!this.candle) {
      return false;
    }
    let p = this.candles[this.index - 1].close;

    for (let i = 1; i < 5; i++) {
      if (p < this.candles[this.index - i].close) {
        p = this.candles[this.index - i].close;
      }
    }

    return this.candles[this.index].close > p;
  }

  crossLowMedian() {
    if (!this.candle) {
      return false;
    }
    let length = 5;
    let p = 0;

    for (let i = 1; i < length; i++) {
      p +=
        (parseFloat(this.candles[this.index - i].high) +
          parseFloat(this.candles[this.index - i].low)) /
        2;
    }

    p = p / length;

    return this.candles[this.index].close < p;
  }

  getLast15price() {
    if (!this.candle) {
      return false;
    }
    let p = 0;
    const nb = 3;

    for (let i = 1; i < nb; i++) {
      p += parseFloat(this.candles[this.index - i].close);
    }

    p = p / (nb - 1);
    return ((this.candles[this.index].close - p) / p) * 100;
  }

  info() {
    if (!this.candle) {
      return false;
    }

    return {
      isDroping: this.candle.open > this.candle.close
    };
  }

  isTop() {
    if (!this.candle) {
      return false;
    }
    let top = this.candle.high - this.candle.open;
    let body = this.candle.open - this.candle.close;
    let bottom = this.candle.close - this.candle.low;

    if (this.candle.open < this.candle.close) {
      top = this.candle.high - this.candle.close;
      body = this.candle.close - this.candle.open;
      bottom = this.candle.open - this.candle.low;
    }

    if (body < top) {
      return true;
    }
    return false;
  }

  isBottom() {
    if (!this.candle) {
      return false;
    }
    let top = this.candle.high - this.candle.open;
    let body = this.candle.open - this.candle.close;
    let bottom = this.candle.close - this.candle.low;

    if (this.candle.open < this.candle.close) {
      top = this.candle.high - this.candle.close;
      body = this.candle.close - this.candle.open;
      bottom = this.candle.open - this.candle.low;
    }

    if (body < bottom) {
      return true;
    }
    return false;
  }

  // buy
  bullishengulfingpattern() {
    if (!this.candle) {
      return false;
    }
    return indicators.bullishengulfingpattern(this.lastTwoPrevcandles);
  }
  bullishharami() {
    if (!this.candle) {
      return false;
    }
    return indicators.bullishharami(this.lastTwoPrevcandles);
  }
  threewhitesoldiers() {
    if (!this.candle) {
      return false;
    }
    return indicators.threewhitesoldiers(this.lastThreePrevcandles);
  }

  //sell
  bearishengulfingpattern() {
    if (!this.candle) {
      return false;
    }
    return indicators.bearishengulfingpattern(this.lastTwoPrevcandles);
  }
  darkcloudcover() {
    if (!this.candle) {
      return false;
    }
    return indicators.darkcloudcover(this.lastTwoPrevcandles);
  }
  downsidetasukigap() {
    if (!this.candle) {
      return false;
    }
    return indicators.downsidetasukigap(this.lastThreePrevcandles);
  }
  eveningdojistar() {
    if (!this.candle) {
      return false;
    }
    return indicators.eveningdojistar(this.lastThreePrevcandles);
  }
  bearishharami() {
    if (!this.candle) {
      return false;
    }
    return indicators.bearishharami(this.lastTwoPrevcandles);
  }
  threeblackcrows() {
    if (!this.candle) {
      return false;
    }
    return indicators.threeblackcrows(this.lastThreePrevcandles);
  }
})();
