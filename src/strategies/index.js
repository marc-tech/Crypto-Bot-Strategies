import CandlesParserFunc from './candlesParser';
import Strategy1 from './strategy1';
import Strategy2 from './strategy2';

export const CandlesParser = candles => CandlesParserFunc(candles);

export const Strategies = [
  { name: 'marc', class: Strategy1 },
  { name: 'Strategie de remi', class: Strategy2 }
];
