import { Module } from '@nestjs/common';
import { FeedbackController } from './infrastructure/controllers/feedback.controller';
import { feedbackUseCasesProviders } from './feedback.usecases.provider';
import { TicketModule } from '../ticket/ticket.module';
import { TypeOrmFeedbackRepository } from './infrastructure/database/repositories/typeorm-feedback.repository';
import { FeedbackEntity } from './infrastructure/database/entities/feedback.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyzeFeedbackSentimentController } from './infrastructure/controllers/analyze-feedback-sentiments.controller';
import { AnalyzeFeedbackSentimentsJob } from './application/jobs/analyze-feedback-sentiments.job';
import { AnalyzeFeedbackSentimentsScheduler } from './infrastructure/schedulers/analyze-feedback-sentiment.scheduler';

@Module({
  imports: [TypeOrmModule.forFeature([FeedbackEntity]), TicketModule],
  controllers: [FeedbackController, AnalyzeFeedbackSentimentController],
  providers: [
    {
      provide: 'TypeOrmFeedbackRepository',
      useClass: TypeOrmFeedbackRepository,
    },
    AnalyzeFeedbackSentimentsJob,
    AnalyzeFeedbackSentimentsScheduler,
    ...feedbackUseCasesProviders,
  ],
  exports: [],
})
export class FeedbackModule {}
