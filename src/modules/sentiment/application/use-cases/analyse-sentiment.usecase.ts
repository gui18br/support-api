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
    const startTime = Date.now();

    const cpuBefore = process.cpuUsage();
    const memBefore = process.memoryUsage();

    try {
      const result = this.analyzer.analyze(sentiment);

      this.metrics.incrementRequest(result.label);

      return result;
    } catch (error) {
      this.metrics.incrementError();
      throw error;
    } finally {
      const duration = Date.now() - startTime;
      this.metrics.observeProcessingTime(duration);

      const cpuAfter = process.cpuUsage(cpuBefore);
      const cpuMs = (cpuAfter.user + cpuAfter.system) / 1000;

      this.metrics.observeProcessingTime(cpuMs / 1000);

      const memAfter = process.memoryUsage();

      this.metrics.observeHeapUsage(memAfter.heapUsed - memBefore.heapUsed);

      this.metrics.observeRssUsage(memAfter.rss - memBefore.rss);
    }
  }
}
