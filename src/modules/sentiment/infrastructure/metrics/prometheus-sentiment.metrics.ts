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

  private readonly cpuUsage = new Histogram({
    name: 'sentiment_cpu_usage_seconds',
    help: 'CPU usada por análise de sentimento',
    buckets: [0.001, 0.005, 0.01, 0.05, 0.1],
  });

  private readonly heapUsage = new Histogram({
    name: 'sentiment_heap_used_bytes',
    help: 'Heap consumido por análise',
    buckets: [1024, 10_000, 50_000, 100_000, 500_000],
  });

  private readonly rssUsage = new Histogram({
    name: 'sentiment_rss_used_bytes',
    help: 'RSS delta por análise',
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

  observeHeapUsage(bytes: number): void {
    const value = Math.max(bytes, 0);

    this.heapUsage.observe(value);
  }

  observeRssUsage(bytes: number): void {
    const value = Math.max(bytes, 0);

    this.rssUsage.observe(value);
  }

  observeCpuUsage(seconds: number): void {
    const value = Math.max(seconds, 0);

    this.cpuUsage.observe(value);
  }
}
