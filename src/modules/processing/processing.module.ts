import { Module } from '@nestjs/common';

import { processingUseCasesProviders } from './processing.usecases.provider';
import { FeedbackModule } from '../feedback/feedback.module';
import { AnalyzeFeedbackSentimentController } from './infrastructure/controllers/analyze-feedback-sentiments.controller';
import { SentimentAnalyzerGateway } from './application/gateways/sentiment-analyzer.gateway';
import { SentimentAnalyzerGatewayImpl } from './infrastructure/apis/gateway/sentiment-analyzer.gateway.impl';
import { SentimentAnalyzer } from './infrastructure/apis/sentiment.analyzer';

@Module({
  imports: [FeedbackModule],
  providers: [
    ...processingUseCasesProviders,
    SentimentAnalyzer,
    {
      provide: SentimentAnalyzerGateway,
      useClass: SentimentAnalyzerGatewayImpl,
    },
  ],
  controllers: [AnalyzeFeedbackSentimentController],
})
export class ProcessingModule {}
