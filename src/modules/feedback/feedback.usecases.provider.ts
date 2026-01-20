import { AnalyzeSentimentUseCase } from '../sentiment/application/use-cases/analyse-sentiment.usecase';
import { TicketRepository } from '../ticket/domain/repositories/ticket.repository';
import { AnalyzeFeedbackSentimentsJob } from './application/jobs/analyze-feedback-sentiments.job';
import { CreateFeedbackUseCase } from './application/use-cases/create-feedback.usecase';
import { FeedbackRepository } from './domain/repositories/feedback.repository';

export const feedbackUseCasesProviders = [
  {
    provide: CreateFeedbackUseCase,
    useFactory: (
      feedbackRepository: FeedbackRepository,
      ticketRepository: TicketRepository,
    ) => new CreateFeedbackUseCase(feedbackRepository, ticketRepository),
    inject: ['FeedbackRepository', 'TypeOrmTicketRepository'],
  },
  {
    provide: AnalyzeFeedbackSentimentsJob,
    useFactory: (
      feedbackRepository: FeedbackRepository,
      analyzeSentiment: AnalyzeSentimentUseCase,
    ) => new AnalyzeFeedbackSentimentsJob(feedbackRepository, analyzeSentiment),
    inject: ['FeedbackRepository', AnalyzeSentimentUseCase],
  },
];
