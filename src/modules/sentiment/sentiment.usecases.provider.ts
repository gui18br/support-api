import { AnalyzeSentimentUseCase } from './application/use-cases/analyse-sentiment.usecase';
import { SentimentAnalyzer } from './domain/repositories/sentiment.repository';

export const feedbackUseCasesProviders = [
  {
    provide: AnalyzeSentimentUseCase,
    useFactory: (sentimentAnalyzer: SentimentAnalyzer) =>
      new AnalyzeSentimentUseCase(sentimentAnalyzer),
    inject: ['SimpleSentimentAnalyzer'],
  },
];
