import { Sentiment } from '../../domain/entities/sentiment.entity';
import { SentimentAnalyzer } from '../../domain/repositories/sentiment.repository';
import { SentimentResult } from '../../domain/value-objects/sentiment-result';

export class AnalyzeSentimentUseCase {
  constructor(private analyzer: SentimentAnalyzer) {}

  execute(sentiment: Sentiment): SentimentResult {
    return this.analyzer.analyze(sentiment);
  }
}
