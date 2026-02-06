import { SentimentMetricsPort } from './application/ports/sentiment-metrics.port';
import { AnalyzeSentimentUseCase } from './application/use-cases/analyse-sentiment.usecase';
import { SentimentAnalyzer } from './domain/repositories/sentiment.repository';

export const feedbackUseCasesProviders = [
  {
    provide: AnalyzeSentimentUseCase,
    useFactory: (
      sentimentAnalyzer: SentimentAnalyzer,
      metrics: SentimentMetricsPort,
    ) => new AnalyzeSentimentUseCase(sentimentAnalyzer, metrics),
    inject: ['SimpleSentimentAnalyzer', 'SentimentMetricsPort'],
  },
];
