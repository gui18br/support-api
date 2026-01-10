import { Module } from '@nestjs/common';
import { SimpleSentimentAnalyzer } from './infrastructure/simple-sentiment-analyzer';
import { AnalyzeSentimentUseCase } from './application/use-cases/analyse-sentiment.usecase';

@Module({
  imports: [],
  providers: [
    {
      provide: 'SimpleSentimentAnalyzer',
      useClass: SimpleSentimentAnalyzer,
    },
    AnalyzeSentimentUseCase,
  ],
  exports: [AnalyzeSentimentUseCase],
})
export class SentimentModule {}
