import { Module } from '@nestjs/common';

import { SentimentModule } from '../sentiment/sentiment.module';
import { processingUseCasesProviders } from './processing.usecases.provider';
import { FeedbackModule } from '../feedback/feedback.module';
import { AnalyzeFeedbackSentimentController } from './infrastructure/controllers/analyze-feedback-sentiments.controller';
import { PrometheusProcessingMetrics } from './infrastructure/metrics/prometheus-processing.metrics';

@Module({
  imports: [SentimentModule, FeedbackModule],
  providers: [
    {
      provide: 'ProcessingMetricsPort',
      useClass: PrometheusProcessingMetrics,
    },
    ...processingUseCasesProviders,
  ],
  controllers: [AnalyzeFeedbackSentimentController],
})
export class ProcessingModule {}
