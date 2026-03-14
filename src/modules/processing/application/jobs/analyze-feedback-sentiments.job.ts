import pLimit from 'p-limit';
import { Job } from '../../domain/contracts/job.interface';
import { FeedbackRepository } from 'src/modules/feedback/domain/repositories/feedback.repository';
import { Feedback } from 'src/modules/feedback/domain/entities/feedback.entity';
import { Sentiment } from 'src/modules/sentiment/domain/entities/sentiment.entity';
import { AnalyzeSentimentUseCase } from 'src/modules/sentiment/application/use-cases/analyse-sentiment.usecase';
import { JobMetricsPort } from '../ports/job-metrics.port';

export class AnalyzeFeedbackSentimentsJob implements Job {
  name = 'analyze-feedback-sentiments';

  private readonly BATCH_SIZE = 1000;
  private readonly WORKERS = 4;
  private readonly WORKER_CONCURRENCY = 10;

  constructor(
    private readonly feedbackRepository: FeedbackRepository,
    private readonly sentimentAnalyzer: AnalyzeSentimentUseCase,
    private readonly jobMetrics: JobMetricsPort,
  ) {}

  async run(): Promise<void> {
    while (true) {
      const feedbacks = await this.feedbackRepository.findNotAnalyzedPaginated(
        this.BATCH_SIZE,
      );

      if (!feedbacks.length) break;

      const queues = this.splitIntoWorkers(feedbacks);

      const workers = queues.map((queue) => this.runWorker(queue));

      await Promise.all(workers);
    }
  }

  private splitIntoWorkers(feedbacks: Feedback[]): Feedback[][] {
    const queues: Feedback[][] = Array.from({ length: this.WORKERS }, () => []);

    feedbacks.forEach((feedback, index) => {
      queues[index % this.WORKERS].push(feedback);
    });

    return queues;
  }

  private async runWorker(queue: Feedback[]) {
    const limit = pLimit(this.WORKER_CONCURRENCY);

    await Promise.all(
      queue.map((feedback) => {
        const jobStart = process.hrtime.bigint();

        return limit(async () => {
          try {
            const sentiment = new Sentiment(feedback.content);

            const result = await this.sentimentAnalyzer.execute(sentiment);

            feedback.analyzeSentiment(result.score, result.label);

            await this.feedbackRepository.save(feedback);
          } catch (error: any) {
            console.error('Sentiment error:', error?.message);
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
