import { Module } from '@nestjs/common';

import { SentimentModule } from '../sentiment/sentiment.module';
import { processingUseCasesProviders } from './processing.usecases.provider';
import { FeedbackModule } from '../feedback/feedback.module';
import { AnalyzeFeedbackSentimentController } from './infrastructure/controllers/analyze-feedback-sentiments.controller';

@Module({
  imports: [SentimentModule, FeedbackModule],
  controllers: [AnalyzeFeedbackSentimentController],
  providers: [...processingUseCasesProviders],
})
export class ProcessingModule {}
