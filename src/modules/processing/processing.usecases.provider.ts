import { FeedbackRepository } from '../feedback/domain/repositories/feedback.repository';
import { AnalyzeSentimentUseCase } from '../sentiment/application/use-cases/analyse-sentiment.usecase';
import { AnalyzeFeedbackSentimentsJob } from './application/jobs/analyze-feedback-sentiments.job';
import { JobMetricsPort } from './application/ports/job-metrics.port';
import { AnalyzeFeedbacksUseCase } from './application/use-cases/analyze-feedbacks.usecase';

export const processingUseCasesProviders = [
  {
    provide: AnalyzeFeedbackSentimentsJob,
    useFactory: (
      feedbackRepository: FeedbackRepository,
      analyzeSentiment: AnalyzeSentimentUseCase,
      jobMetrics: JobMetricsPort,
    ) =>
      new AnalyzeFeedbackSentimentsJob(
        feedbackRepository,
        analyzeSentiment,
        jobMetrics,
      ),
    inject: ['FeedbackRepository', AnalyzeSentimentUseCase, 'JobMetricsPort'],
  },
  {
    provide: AnalyzeFeedbacksUseCase,
    useFactory: (job: AnalyzeFeedbackSentimentsJob) =>
      new AnalyzeFeedbacksUseCase(job),
    inject: [AnalyzeFeedbackSentimentsJob],
  },
];
