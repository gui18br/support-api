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
      provide: 'TypeOrmFeedbackRepository',
      useClass: TypeOrmFeedbackRepository,
    },
    ...feedbackUseCasesProviders,
  ],
  exports: [],
})
export class FeedbackModule {}
