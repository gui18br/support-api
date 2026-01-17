import { Module } from '@nestjs/common';
import { SimpleSentimentAnalyzer } from './infrastructure/simple-sentiment-analyzer';
import { AnalyzeSentimentUseCase } from './application/use-cases/analyse-sentiment.usecase';
import { feedbackUseCasesProviders } from './sentiment.usecases.provider';

@Module({
  imports: [],
  providers: [
    {
      provide: 'SimpleSentimentAnalyzer',
      useClass: SimpleSentimentAnalyzer,
    },
    ...feedbackUseCasesProviders,
  ],
  exports: [AnalyzeSentimentUseCase],
})
export class SentimentModule {}
