import { SentimentLabel } from '../enums/sentiment-label.enum';

export interface SentimentResult {
  score: number;
  label: SentimentLabel;
}
