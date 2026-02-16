import { FeedbackRepository } from '../feedback/domain/repositories/feedback.repository';
import { AnalyzeSentimentUseCase } from '../sentiment/application/use-cases/analyse-sentiment.usecase';
import { AnalyzeFeedbackSentimentsJob } from './application/jobs/analyze-feedback-sentiments.job';
import { ProcessingMetricsPort } from './application/ports/processing-metrics.port';

export const processingUseCasesProviders = [
  {
    provide: AnalyzeFeedbackSentimentsJob,
    useFactory: (
      feedbackRepository: FeedbackRepository,
      analyzeSentiment: AnalyzeSentimentUseCase,
      metrics: ProcessingMetricsPort,
    ) =>
      new AnalyzeFeedbackSentimentsJob(
        feedbackRepository,
        analyzeSentiment,
        metrics,
      ),
    inject: ['FeedbackRepository', AnalyzeSentimentUseCase],
  },
];
