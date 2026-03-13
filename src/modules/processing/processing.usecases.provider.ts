import { FeedbackRepository } from '../feedback/domain/repositories/feedback.repository';
import { AnalyzeSentimentUseCase } from '../sentiment/application/use-cases/analyse-sentiment.usecase';
import { AnalyzeFeedbackSentimentsJob } from './application/jobs/analyze-feedback-sentiments.job';
import { AnalyzeFeedbacksUseCase } from './application/use-cases/analyze-feedbacks.usecase';

export const processingUseCasesProviders = [
  {
    provide: AnalyzeFeedbackSentimentsJob,
    useFactory: (
      feedbackRepository: FeedbackRepository,
      analyzeSentiment: AnalyzeSentimentUseCase,
    ) => new AnalyzeFeedbackSentimentsJob(feedbackRepository, analyzeSentiment),
    inject: ['FeedbackRepository', AnalyzeSentimentUseCase],
  },
  {
    provide: AnalyzeFeedbacksUseCase,
    useFactory: (job: AnalyzeFeedbackSentimentsJob) =>
      new AnalyzeFeedbacksUseCase(job),
    inject: [AnalyzeFeedbackSentimentsJob],
  },
];
