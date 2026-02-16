import { Histogram } from 'prom-client';
import { ProcessingMetricsPort } from '../../application/ports/processing-metrics.port';

export class PrometheusProcessingMetrics implements ProcessingMetricsPort {
  private readonly processingDuration = new Histogram({
    name: 'processing_processing_duration_seconds',
    help: 'Tempo de processamento do módulo processing',
    buckets: [0.1, 0.3, 0.5, 1, 2, 3, 5],
  });

  private readonly cpuUsage = new Histogram({
    name: 'processing_cpu_usage_seconds',
    help: 'CPU usada por análise de processing',
    buckets: [0.001, 0.005, 0.01, 0.05, 0.1],
  });

  private readonly heapUsage = new Histogram({
    name: 'processing_heap_used_bytes',
    help: 'Heap consumido por análise',
    buckets: [1024, 10_000, 50_000, 100_000, 500_000],
  });

  private readonly rssUsage = new Histogram({
    name: 'processing_rss_used_bytes',
    help: 'RSS delta por análise',
  });

  private readonly batchDuration = new Histogram({
    name: 'processing_batch_duration_seconds',
    help: 'Tempo de execução por batch',
    buckets: [0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  });

  private readonly batchSize = new Histogram({
    name: 'processing_batch_size',
    help: 'Quantidade de feedbacks por batch',
    buckets: [10, 50, 100, 200, 500],
  });

  private readonly batchThroughput = new Histogram({
    name: 'processing_batch_throughput',
    help: 'Feedbacks processados por segundo por batch',
    buckets: [10, 50, 100, 200, 500],
  });

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

  observeBatchDuration(durationMs: number): void {
    this.batchDuration.observe(durationMs / 1000);
  }

  observeBatchSize(size: number): void {
    this.batchSize.observe(size);
  }

  observeBatchThroughput(processed: number, durationMs: number): void {
    if (durationMs <= 0) return;

    const throughput = processed / (durationMs / 1000);

    const value = Math.max(throughput, 0);

    this.batchThroughput.observe(value);
  }
}
