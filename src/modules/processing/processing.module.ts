import { Module } from '@nestjs/common';

import { SentimentModule } from '../sentiment/sentiment.module';
import { processingUseCasesProviders } from './processing.usecases.provider';
import { FeedbackModule } from '../feedback/feedback.module';
import { AnalyzeFeedbackSentimentController } from './infrastructure/controllers/analyze-feedback-sentiments.controller';
import { PrometheusJobMetrics } from './infrastructure/metrics/prometheus-job-metrics';

@Module({
  imports: [SentimentModule, FeedbackModule],
  providers: [
    {
      provide: 'JobMetricsPort',
      useClass: PrometheusJobMetrics,
    },
    ...processingUseCasesProviders,
  ],
  controllers: [AnalyzeFeedbackSentimentController],
})
export class ProcessingModule {}
