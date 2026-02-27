import { Module } from '@nestjs/common';
import { FeedbackController } from './infrastructure/controllers/feedback.controller';
import { feedbackUseCasesProviders } from './feedback.usecases.provider';
import { TicketModule } from '../ticket/ticket.module';
import { TypeOrmFeedbackRepository } from './infrastructure/database/repositories/typeorm-feedback.repository';
import { FeedbackEntity } from './infrastructure/database/entities/feedback.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([FeedbackEntity]), TicketModule],
  controllers: [FeedbackController],
  providers: [
    {
      provide: 'FeedbackRepository',
      useClass: TypeOrmFeedbackRepository,
    },
    // AnalyzeFeedbackSentimentsScheduler,
    ...feedbackUseCasesProviders,
  ],
  exports: ['FeedbackRepository'],
})
export class FeedbackModule {}
