const candleAnalyser = require('./candlesAnalyser');

export default function(candles) {
  let results = {
    candlesChart: [],
    analysedCandles: []
  };
  let index = 0;

  for (const candle of candles) {
    results.candlesChart.push(mapCandleChart(candle));
    results.analysedCandles.push(candleAnalyser(candles, index));
    index++;
  }

  return results;
}

function mapCandleChart(candle) {
  return [
    candle.openTime / 1000,
    parseFloat(candle.open),
    parseFloat(candle.high),
    parseFloat(candle.low),
    parseFloat(candle.close)
  ];
}
