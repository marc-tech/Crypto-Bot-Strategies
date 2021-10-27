// const indicators = require('slz-indicators');
const TI = require('technicalindicators');
const OFFSET = 50;

module.exports = function(candles, index) {
  let results = {
    openTime: candles[index].openTime,
    open: parseFloat(candles[index].open),
    high: parseFloat(candles[index].high),
    low: parseFloat(candles[index].low),
    close: parseFloat(candles[index].close),
    sentiment: 0
  };
  candles[index] = results;

  RSI(candles, index, results);
  AverageGain(candles, index, results);
  AverageLoss(candles, index, results);
  goUp(candles, index, results);
  getMedians(candles, index, results);

  // const fiveCandlesTab = getFiveCandlesTab(candles, index);
  const threeCandlesTab = getThreeCandlesTab(candles, index);
  const twoCandlesTab = getTwoCandlesTab(candles, index);
  const candleTab = getCadleTab(candles, index);

  index > 13 &&
    (results.sma = TI.sma({
      values: candles.slice(index - 13, index).map(e => e.close),
      period: 8
    }).at(-1));

  index > 15 &&
    (results.ema = TI.ema({
      values: candles.slice(index - 15, index).map(e => e.close),
      period: 8
    }).at(-1));
  index > 15 &&
    (results.wma = TI.wma({
      values: candles.slice(index - 15, index).map(e => e.close),
      period: 8
    }).at(-1));

  index > 11 &&
    (results.wema = TI.wema({
      values: candles.slice(index - 11, index).map(e => e.close),
      period: 5
    }).at(-1));

  index > 18 &&
    (results.macd = TI.macd({
      values: candles.slice(index - 18, index).map(e => e.close),
      fastPeriod: 5,
      slowPeriod: 8,
      signalPeriod: 3,
      SimpleMAOscillator: false,
      SimpleMASignal: false
    }).at(-1));

  index > 30 &&
    (results.bollingerbands = TI.bollingerbands({
      values: candles.slice(index - 30, index).map(e => e.close),
      period: 14,
      stdDev: 2
    }).at(-1));

  index > 47 &&
    (results.adx = TI.adx({
      close: candles.slice(index - 47, index).map(e => e.close),
      high: candles.slice(index - 47, index).map(e => e.high),
      low: candles.slice(index - 47, index).map(e => e.low),
      period: 14
    }).at(-1));
  // export { atr, ATR } from './directionalmovement/ATR';
  // export { truerange, TrueRange } from './directionalmovement/TrueRange';
  // export { roc, ROC } from './momentum/ROC';
  // export { kst, KST } from './momentum/KST';
  // export { psar, PSAR } from './momentum/PSAR';
  // export { stochastic, Stochastic } from './momentum/Stochastic';
  // export { williamsr, WilliamsR } from './momentum/WilliamsR';
  // export { adl, ADL } from './volume/ADL';
  // export { obv, OBV } from './volume/OBV';
  // export { trix, TRIX } from './momentum/TRIX';
  // export { forceindex, ForceIndex } from './volume/ForceIndex';
  // export { cci, CCI } from './oscillators/CCI';
  // export { awesomeoscillator, AwesomeOscillator } from './oscillators/AwesomeOscillator';
  // export { vwap, VWAP } from './volume/VWAP';
  // export { volumeprofile, VolumeProfile } from './volume/VolumeProfile';
  // export { mfi, MFI } from './volume/MFI';
  // export { stochasticrsi, StochasticRSI } from './momentum/StochasticRSI';
  // export { averagegain, AverageGain } from './Utils/AverageGain';
  // export { averageloss, AverageLoss } from './Utils/AverageLoss';
  // export { sd, SD } from './Utils/SD';
  // export { highest, Highest } from './Utils/Highest';
  // export { lowest, Lowest } from './Utils/Lowest';
  // export { sum, Sum } from './Utils/Sum';
  // export { crossUp, CrossUp } from './Utils/CrossUp';
  // export { crossDown, CrossDown } from './Utils/CrossDown';

  //candlestick
  if (index > 5) {
    // results.bearish = TI.bearish(twoCandlesTab);
    results.abandonedbaby = TI.abandonedbaby(threeCandlesTab);
    results.doji = TI.doji(candleTab);
    results.bearishengulfingpatrn = TI.bearishengulfingpattern(twoCandlesTab);
    results.bullishengulfingpattern = TI.bullishengulfingpattern(twoCandlesTab);
    results.darkcloudcover = TI.darkcloudcover(twoCandlesTab);
    results.downsidetasukigap = TI.downsidetasukigap(threeCandlesTab);
    results.dragonflydoji = TI.dragonflydoji(candleTab);
    results.gravestonedoji = TI.gravestonedoji(candleTab);
    results.bullishharami = TI.bullishharami(twoCandlesTab);
    results.bearishharami = TI.bearishharami(twoCandlesTab);
    results.bullishharamicross = TI.bullishharamicross(twoCandlesTab);
    results.bearishharamicross = TI.bearishharamicross(twoCandlesTab);
    results.eveningdojistar = TI.eveningdojistar(threeCandlesTab);
    results.eveningstar = TI.eveningstar(threeCandlesTab);
    results.morningdojistar = TI.morningdojistar(threeCandlesTab);
    results.morningstar = TI.morningstar(threeCandlesTab);
    results.bullishmarubozu = TI.bullishmarubozu(twoCandlesTab);
    results.bearishmarubozu = TI.bearishmarubozu(twoCandlesTab);
    results.piercingline = TI.piercingline(twoCandlesTab);
    results.bullishspinningtop = TI.bullishspinningtop(twoCandlesTab);
    results.bearishspinningtop = TI.bearishspinningtop(twoCandlesTab);
    results.threeblackcrows = TI.threeblackcrows(threeCandlesTab);
    results.threewhitesoldiers = TI.threewhitesoldiers(threeCandlesTab);
    results.bullishhammerstick = TI.bullishhammerstick(twoCandlesTab);
    results.bearishhammerstick = TI.bearishhammerstick(twoCandlesTab);
    results.bullishinvertedhammerstick = TI.bullishinvertedhammerstick(
      twoCandlesTab
    );
    results.bearishinvertedhammerstick = TI.bearishinvertedhammerstick(
      twoCandlesTab
    );
    // results.hammerpattern = TI.hammerpattern(threeCandlesTab);
    // results.hammerpatternunconfirmed = TI.hammerpatternunconfirmed(
    //   threeCandlesTab
    // );
    // results.hangingman = TI.hangingman(fiveCandlesTab);
    // results.hangingmanunconfirmed = TI.hangingmanunconfirmed(fiveCandlesTab);
    // results.shootingstar = TI.shootingstar(fiveCandlesTab);
    // results.shootingstarunconfirmed = TI.shootingstarunconfirmed(
    //   fiveCandlesTab
    // );
    // results.tweezertop = TI.tweezertop(fiveCandlesTab);
    // results.tweezerbottom = TI.tweezerbottom(fiveCandlesTab);
  }

  if (index > 170) {
    // runWithValues(candles, index, 166, (values) => {
    // })
    // getPrevValue(length)
    results.ichimokuCloud = new TI.IchimokuCloud({
      high: candles.slice(index - 166, index).map(e => parseFloat(e.high)),
      low: candles.slice(index - 166, index).map(e => parseFloat(e.low)),
      conversionPeriod: 9,
      basePeriod: 26,
      spanPeriod: 52,
      displacement: 26
    });
    results.ichimokuCloud =
      results.ichimokuCloud.result[results.ichimokuCloud.result.length - 1];

    candles[index] = results;

    if (candles[index - 1].ichimokuCloudIsUpNumber == undefined) {
      results.ichimokuCloudIsUpNumber = 0;
    } else if (candles[index - 1].ichimokuCloudIsUpNumber >= 0) {
      if (
        candles[index].ichimokuCloud.spanA > candles[index].ichimokuCloud.spanB
      ) {
        candles[index].ichimokuCloudIsUpNumber =
          candles[index - 1].ichimokuCloudIsUpNumber + 1;
      } else {
        candles[index].ichimokuCloudIsUpNumber = -1;
      }
    } else if (candles[index - 1].ichimokuCloudIsUpNumber < 0) {
      if (
        candles[index].ichimokuCloud.spanA < candles[index].ichimokuCloud.spanB
      ) {
        candles[index].ichimokuCloudIsUpNumber =
          candles[index - 1].ichimokuCloudIsUpNumber - 1;
      } else {
        candles[index].ichimokuCloudIsUpNumber = 1;
      }
    }
  }

  calculateSentiment(results);
  candles[index] = results;
  return results;
};

/**
 * This function take all the info of the results and try to make a number between 0 and 255
 * where 0 you have a lot of buy signals and 255 a lot of sell signals.
 * (0 = red ; 255 = green)
 *
 * @param {string} result - the result object with all calculation
 *
 */
function calculateSentiment(results) {
  // this function can also be override the sentiment go to 0 to 255 (red to green)
  if (results.rsi) {
    results.sentiment += parseInt(results.rsi) * 2;
  }

  if (results.goUp) {
    results.sentiment += 20;
  }

  if (
    results.ichimokuCloud &&
    results.ichimokuCloud.spanA > results.ichimokuCloud.spanB
  ) {
    results.sentiment += 20;
  } else if (results.ichimokuCloud) {
    results.sentiment -= 20;
  }

  // if (results.gravestonedoji) {
  //   results.sentiment += 80;
  // }

  if (results.ema100 < results.close) {
    results.sentiment += 20;
  } else {
    results.sentiment -= 20;
  }

  if (results.ema50 < results.close) {
    results.sentiment += 10;
  } else {
    results.sentiment -= 10;
  }

  if (results.ema20 < results.close) {
    results.sentiment += 5;
  } else {
    results.sentiment -= 5;
  }

  results.sentiment += 40;

  if (results.sentiment > 255) {
    results.sentiment = 255;
  }
}

function runWithValues(candles, index, length, callback) {
  if (index > length) {
    candles.slice(index - 166, index).map(e => parseFloat(e.high));
    callback(values);
  }
}

function getFiveCandlesTab(candles, index) {
  if (index > 5) {
    return {
      open: [
        candles[index - 4].open,
        candles[index - 3].open,
        candles[index - 2].open,
        candles[index - 1].open,
        candles[index].open
      ],
      high: [
        candles[index - 4].high,
        candles[index - 3].high,
        candles[index - 2].high,
        candles[index - 1].high,
        candles[index].high
      ],
      close: [
        candles[index - 4].close,
        candles[index - 3].close,
        candles[index - 2].close,
        candles[index - 1].close,
        candles[index].close
      ],
      low: [
        candles[index - 4].low,
        candles[index - 3].low,
        candles[index - 2].low,
        candles[index - 1].low,
        candles[index].low
      ]
    };
  }
}

function getThreeCandlesTab(candles, index) {
  if (index > 3) {
    return {
      open: [
        candles[index - 2].open,
        candles[index - 1].open,
        candles[index].open
      ],
      high: [
        candles[index - 2].high,
        candles[index - 1].high,
        candles[index].high
      ],
      close: [
        candles[index - 2].close,
        candles[index - 1].close,
        candles[index].close
      ],
      low: [candles[index - 2].low, candles[index - 1].low, candles[index].low]
    };
  }
}

function getTwoCandlesTab(candles, index) {
  if (index > 2) {
    return {
      open: [candles[index - 1].open, candles[index].open],
      high: [candles[index - 1].high, candles[index].high],
      close: [candles[index - 1].close, candles[index].close],
      low: [candles[index - 1].low, candles[index].low]
    };
  }
}

function getCadleTab(candles, index) {
  return {
    open: [candles[index].open],
    high: [candles[index].high],
    close: [candles[index].close],
    low: [candles[index].low]
  };
}

/**
 * Relative strength index
 *
 * The relative strength index (RSI) is a momentum indicator used in
 * technical analysis that measures the magnitude of recent price changes
 * to evaluate overbought or oversold conditions in the price of a stock or other asset.
 *
 * @param {string} candles - the candles list
 * @param {string} index - the current position
 * @param {string} result - the object where to allocate the result
 * @param {string} [period=14] - the period to make calculation
 *
 * @example
 *
 * RSI(candles, index, results)
 */
function RSI(candles, index, results, period = 14) {
  if (index > period * 2) {
    let rsi = TI.RSI.calculate({
      values: candles.slice(index - period * 2, index).map(e => e.close),
      period
    });
    results.rsi = rsi[rsi.length - 1];
  }
}

/**
 * Average Gain off a period.
 *
 * @param {string} candles - the candles list
 * @param {string} index - the current position
 * @param {string} result - the object where to allocate the result
 * @param {string} [period=14] - the period to make calculation
 *
 * @example
 *
 * AverageGain(candles, index, results)
 */
function AverageGain(candles, index, results, period = 14) {
  if (index > period * 2) {
    let averageGain = TI.AverageGain.calculate({
      values: candles.slice(index - period * 2, index).map(e => e.close),
      period
    });
    results.averageGain = averageGain[averageGain.length - 1];
  }
}

/**
 * Average Loss off a period.
 *
 * @param {string} candles - the candles list
 * @param {string} index - the current position
 * @param {string} result - the object where to allocate the result
 * @param {string} [period=6] - the period to make calculation
 *
 * @example
 *
 * AverageLoss(candles, index, results)
 */
function AverageLoss(candles, index, results, period = 6) {
  if (index > period * 2) {
    let averageLoss = TI.AverageLoss.calculate({
      values: candles.slice(index - period * 2, index).map(e => e.close),
      period
    });
    results.averageLoss = averageLoss[averageLoss.length - 1];
  }
}

/**
 * True if market direction is up.
 *
 * @param {string} candles - the candles list
 * @param {string} index - the current position
 * @param {string} result - the object where to allocate the result
 *
 * @example
 *
 * goUp(candles, index)
 */
function goUp(candles, index, results) {
  if (index > 150) {
    let ema1 = 0;
    let ema2 = 0;
    for (let i = 0; i <= 100; i++) {
      ema1 += parseFloat(candles[index - i].close);
      ema2 += parseFloat(candles[index - i - 1].close);
    }

    ema1 = ema1 / 100;
    ema2 = ema2 / 100;

    if (ema1 > ema2) {
      results.goUp = true;
    } else {
      results.goUp = false;
    }
  }
}

/**
 * Get the median values of a range on multiple period.
 *
 * @param {string} candles - the candles list
 * @param {string} index - the current position
 * @param {string} result - the object where to allocate the result
 *
 * @example
 *
 * getMedians(candles, index)
 */
function getMedians(candles, index, results) {
  // const lengths = ['9', '26', '50', '100', '150'];
  const lengths = ['20', '50', '100'];
  if (index > parseInt(lengths[lengths.length - 1])) {
    let lengthsIndex = 0;

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
  }
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
