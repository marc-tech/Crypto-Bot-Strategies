const candleAnalyser = require('./candlesAnalyser');

export default function(candles) {
  let results = {
    candlesChart: [],
    analysedCandles: []
  };
  let index = 0;

  for (const candle of candles) {
    const analysedCandles = candleAnalyser(candles, index);
    results.candlesChart.push(mapCandleChart(candle, analysedCandles));
    results.analysedCandles.push(analysedCandles);
    index++;
  }

  return results;
}

function mapCandleChart(candle, analysedCandles) {
  return {
    x: candle.openTime,
    open: parseFloat(candle.open),
    high: parseFloat(candle.high),
    low: parseFloat(candle.low),
    close: parseFloat(candle.close),
    color: getColor(analysedCandles.sentiment)
  };
}

function getColor(sentiment) {
  return `#ff${sentiment.toString(16)}00`;
}
