import { Module } from '@nestjs/common';
import { FeedbackController } from './infrastructure/controllers/feedback.controller';
import { InMemoryFeedbackRepository } from './infrastructure/repositories/in-memory-feedback.repository';
import { feedbackUseCasesProviders } from './feedback.usecases.provider';
import { TicketModule } from '../ticket/ticket.module';

@Module({
  imports: [TicketModule],
  controllers: [FeedbackController],
  providers: [
    {
      provide: 'FeedbackRepository',
      useClass: InMemoryFeedbackRepository,
    },
    ...feedbackUseCasesProviders,
  ],
  exports: [],
})
export class FeedbackModule {}
