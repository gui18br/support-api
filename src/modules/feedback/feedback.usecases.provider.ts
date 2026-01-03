import { TicketRepository } from '../ticket/domain/repositories/ticket.repository';
import { CreateFeedbackUseCase } from './application/use-cases/create-feedback.usecase';
import { FeedbackRepository } from './domain/repositories/feedback.repository';

export const feedbackUseCasesProviders = [
  {
    provide: CreateFeedbackUseCase,
    useFactory: (
      feedbackRepository: FeedbackRepository,
      ticketRepository: TicketRepository,
    ) => new CreateFeedbackUseCase(feedbackRepository, ticketRepository),
    inject: ['FeedbackRepository', 'TicketRepository'],
  },
];
