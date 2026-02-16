export interface ProcessingMetricsPort {
  observeProcessingTime(durationMs: number): void;
  observeHeapUsage(bytes: number): void;
  observeRssUsage(bytes: number): void;
  observeCpuUsage(seconds: number): void;
  observeBatchDuration(durationMs: number): void;
  observeBatchSize(size: number): void;
  observeBatchThroughput(processed: number, durationMs: number): void;
}
