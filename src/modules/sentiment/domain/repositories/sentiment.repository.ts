import { Sentiment } from '../entities/sentiment.entity';
import { SentimentResult } from '../value-objects/sentiment-result';

export interface SentimentAnalyzer {
  analyze(text: Sentiment): SentimentResult;
}
