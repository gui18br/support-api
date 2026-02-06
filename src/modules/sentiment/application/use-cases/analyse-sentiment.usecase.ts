import { Sentiment } from '../../domain/entities/sentiment.entity';
import { SentimentAnalyzer } from '../../domain/repositories/sentiment.repository';
import { SentimentResult } from '../../domain/value-objects/sentiment-result';
import { SentimentMetricsPort } from '../ports/sentiment-metrics.port';

export class AnalyzeSentimentUseCase {
  constructor(
    private analyzer: SentimentAnalyzer,
    private readonly metrics: SentimentMetricsPort,
  ) {}

  execute(sentiment: Sentiment): SentimentResult {
    const start = Date.now();

    try {
      const result = this.analyzer.analyze(sentiment);

      this.metrics.incrementRequest(result.label);

      return result;
    } catch (error) {
      this.metrics.incrementError();
      throw error;
    } finally {
      this.metrics.observeProcessingTime(Date.now() - start);
    }
  }
}
