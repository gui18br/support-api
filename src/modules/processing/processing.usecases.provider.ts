import { FeedbackRepository } from '../feedback/domain/repositories/feedback.repository';
import { SentimentAnalyzerGateway } from './application/gateways/sentiment-analyzer.gateway';
import { AnalyzeFeedbackSentimentsJob } from './application/jobs/analyze-feedback-sentiments.job';
import { JobMetricsPort } from './application/ports/job-metrics.port';

export const processingUseCasesProviders = [
  {
    provide: AnalyzeFeedbackSentimentsJob,
    useFactory: (
      feedbackRepository: FeedbackRepository,
      sentimentAnalyzerGateway: SentimentAnalyzerGateway,
      jobMetrics: JobMetricsPort,
    ) =>
      new AnalyzeFeedbackSentimentsJob(
        feedbackRepository,
        sentimentAnalyzerGateway,
        jobMetrics,
      ),
    inject: ['FeedbackRepository', SentimentAnalyzerGateway, 'JobMetricsPort'],
  },
];
