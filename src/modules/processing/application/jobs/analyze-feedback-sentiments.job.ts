import pLimit from 'p-limit';
import { Job } from '../../domain/contracts/job.interface';
import { FeedbackRepository } from 'src/modules/feedback/domain/repositories/feedback.repository';
import { SentimentAnalyzerGateway } from '../gateways/sentiment-analyzer.gateway';
import { JobMetricsPort } from '../ports/job-metrics.port';

export class AnalyzeFeedbackSentimentsJob implements Job {
  name = 'analyze-feedback-sentiments';

  private readonly BATCH_SIZE = 1000;
  private readonly CONCURRENCY = 40;
  private readonly limit = pLimit(this.CONCURRENCY);

  constructor(
    private readonly feedbackRepository: FeedbackRepository,
    private readonly sentimentAnalyzerGateway: SentimentAnalyzerGateway,
    private readonly jobMetrics: JobMetricsPort,
  ) {}

  async run(): Promise<void> {
    while (true) {
      const feedbacks = await this.feedbackRepository.findNotAnalyzedPaginated(
        this.BATCH_SIZE,
      );

      if (!feedbacks.length) break;

      await Promise.all(
        feedbacks.map((feedback) => {
          const jobStart = process.hrtime.bigint();

          return this.limit(async () => {
            try {
              const result =
                await this.sentimentAnalyzerGateway.analizarSentimento(
                  feedback.content,
                );

              feedback.analyzeSentiment(result.score, result.label);

              await this.feedbackRepository.save(feedback);
            } catch (error: any) {
              console.error('Sentiment MS error:', error?.message);
            } finally {
              const durationSeconds =
                Number(process.hrtime.bigint() - jobStart) / 1e9;

              this.jobMetrics.observeJobDuration(durationSeconds);
            }
          });
        }),
      );
    }
  }
}
