import { Counter, Histogram } from 'prom-client';
import { SentimentMetricsPort } from '../../application/ports/sentiment-metrics.port';
import { SentimentLabel } from '../../domain/enums/sentiment-label.enum';

export class PrometheusSentimentMetrics implements SentimentMetricsPort {
  private readonly requestsTotal = new Counter({
    name: 'sentiment_requests_total',
    help: 'Total de análises de sentimento',
    labelNames: ['result'],
  });

  private readonly processingDuration = new Histogram({
    name: 'sentiment_processing_duration_seconds',
    help: 'Tempo de processamento do módulo sentiment',
    buckets: [0.1, 0.3, 0.5, 1, 2, 3, 5],
  });

  incrementRequest(result: SentimentLabel): void {
    this.requestsTotal.inc({ result });
  }

  incrementError(): void {
    this.requestsTotal.inc({ result: 'error' });
  }

  observeProcessingTime(durationMs: number): void {
    this.processingDuration.observe(durationMs / 1000);
  }
}
