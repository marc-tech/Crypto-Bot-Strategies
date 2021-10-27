import CandlesParser from './candlesParser';
import Strategy1 from './strategy1';
import Strategy2 from './strategy2';

const Strategies = [Strategy1];

export default {
  CandlesParser: candles => CandlesParser(candles),
  Strategies
};
