import { Module } from '@nestjs/common';
import { SimpleSentimentAnalyzer } from './infrastructure/simple-sentiment-analyzer';
import { AnalyzeSentimentUseCase } from './application/use-cases/analyse-sentiment.usecase';
import { feedbackUseCasesProviders } from './sentiment.usecases.provider';
import { PrometheusSentimentMetrics } from './infrastructure/metrics/prometheus-sentiment.metrics';

@Module({
  imports: [],
  providers: [
    {
      provide: 'SimpleSentimentAnalyzer',
      useClass: SimpleSentimentAnalyzer,
    },
    {
      provide: 'SentimentMetricsPort',
      useClass: PrometheusSentimentMetrics,
    },
    ...feedbackUseCasesProviders,
  ],
  exports: [AnalyzeSentimentUseCase],
})
export class SentimentModule {}
