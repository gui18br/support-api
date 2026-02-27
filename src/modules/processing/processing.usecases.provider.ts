import { FeedbackRepository } from '../feedback/domain/repositories/feedback.repository';
import { SentimentAnalyzerGateway } from './application/gateways/sentiment-analyzer.gateway';
import { AnalyzeFeedbackSentimentsJob } from './application/jobs/analyze-feedback-sentiments.job';

export const processingUseCasesProviders = [
  {
    provide: AnalyzeFeedbackSentimentsJob,
    useFactory: (
      feedbackRepository: FeedbackRepository,
      sentimentAnalyzerGateway: SentimentAnalyzerGateway,
    ) =>
      new AnalyzeFeedbackSentimentsJob(
        feedbackRepository,
        sentimentAnalyzerGateway,
      ),
    inject: ['FeedbackRepository', SentimentAnalyzerGateway],
  },
];
