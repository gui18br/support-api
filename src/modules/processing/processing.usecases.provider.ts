import { FeedbackRepository } from '../feedback/domain/repositories/feedback.repository';
import { AnalyzeSentimentUseCase } from '../sentiment/application/use-cases/analyse-sentiment.usecase';
import { AnalyzeFeedbackSentimentsJob } from './application/jobs/analyze-feedback-sentiments.job';
import { AnalyzeFeedbacksOrchestrator } from './application/orchestrators/analyze-feedbacks.orchestrator';

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
    provide: AnalyzeFeedbacksOrchestrator,
    useFactory: (job: AnalyzeFeedbackSentimentsJob) =>
      new AnalyzeFeedbacksOrchestrator(job),
    inject: [AnalyzeFeedbackSentimentsJob],
  },
];
