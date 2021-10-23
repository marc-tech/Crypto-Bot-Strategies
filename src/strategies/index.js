import CandlesParser from './candlesParser';
import Strategy1 from './strategy1';

const Strategies = [Strategy1];

export default {
  CandlesParser: candles => CandlesParser(candles),
  Strategies
};
