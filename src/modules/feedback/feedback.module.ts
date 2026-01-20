import { Module } from '@nestjs/common';
import { FeedbackController } from './infrastructure/controllers/feedback.controller';
import { feedbackUseCasesProviders } from './feedback.usecases.provider';
import { TicketModule } from '../ticket/ticket.module';
import { TypeOrmFeedbackRepository } from './infrastructure/database/repositories/typeorm-feedback.repository';
import { FeedbackEntity } from './infrastructure/database/entities/feedback.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyzeFeedbackSentimentController } from './infrastructure/controllers/analyze-feedback-sentiments.controller';

import { SentimentModule } from '../sentiment/sentiment.module';
import { AnalyzeFeedbackSentimentsScheduler } from './infrastructure/schedulers/analyze-feedback-sentiment.scheduler';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeedbackEntity]),
    TicketModule,
    SentimentModule,
  ],
  controllers: [FeedbackController, AnalyzeFeedbackSentimentController],
  providers: [
    {
      provide: 'FeedbackRepository',
      useClass: TypeOrmFeedbackRepository,
    },
    AnalyzeFeedbackSentimentsScheduler,
    ...feedbackUseCasesProviders,
  ],
  exports: ['FeedbackRepository'],
})
export class FeedbackModule {}
