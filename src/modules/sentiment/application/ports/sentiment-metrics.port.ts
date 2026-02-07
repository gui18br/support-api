import { SentimentLabel } from '../../domain/enums/sentiment-label.enum';

export interface SentimentMetricsPort {
  incrementRequest(result: SentimentLabel): void;
  incrementError(): void;
  observeProcessingTime(durationMs: number): void;
  observeHeapUsage(bytes: number): void;
  observeRssUsage(bytes: number): void;
}
