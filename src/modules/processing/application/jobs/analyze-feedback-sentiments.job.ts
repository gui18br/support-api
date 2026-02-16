import pLimit from 'p-limit';
import { Job } from '../../domain/contracts/job.interface';
import { FeedbackRepository } from 'src/modules/feedback/domain/repositories/feedback.repository';
import { AnalyzeSentimentUseCase } from 'src/modules/sentiment/application/use-cases/analyse-sentiment.usecase';
import { Sentiment } from 'src/modules/sentiment/domain/entities/sentiment.entity';
import { ProcessingMetricsPort } from '../ports/processing-metrics.port';

export class AnalyzeFeedbackSentimentsJob implements Job {
  name = 'analyze-feedback-sentiments';

  private readonly BATCH_SIZE = 100;
  private readonly CONCURRENCY = 20;

  constructor(
    private readonly feedbackRepository: FeedbackRepository,
    private readonly analyzeSentiment: AnalyzeSentimentUseCase,
    private readonly metrics: ProcessingMetricsPort,
  ) {}

  async run(): Promise<void> {
    let page = 0;

    const startTime = Date.now();

    const cpuBefore = process.cpuUsage();
    const memBefore = process.memoryUsage();

    while (true) {
      const batchStart = Date.now();

      const feedbacks = await this.feedbackRepository.findNotAnalyzedPaginated(
        this.BATCH_SIZE,
        page * this.BATCH_SIZE,
      );

      if (!feedbacks.length) break;

      const limit = pLimit(this.CONCURRENCY);

      await Promise.all(
        feedbacks.map((feedback) =>
          limit(async () => {
            try {
              const sentiment = new Sentiment(feedback.content);

              const result = this.analyzeSentiment.execute(sentiment);

              feedback.analyzeSentiment(result.score, result.label);

              await this.feedbackRepository.save(feedback);
            } catch (error) {
              console.error(error);
            }
          }),
        ),
      );

      const batchDuration = Date.now() - batchStart;
      this.metrics.observeBatchDuration(batchDuration);
      this.metrics.observeBatchSize(feedbacks.length);
      this.metrics.observeBatchThroughput(feedbacks.length, batchDuration);

      page++;
    }

    const jobDuration = Date.now() - startTime;

    const cpuAfter = process.cpuUsage(cpuBefore);

    const memAfter = process.memoryUsage();

    const cpuUserSeconds = cpuAfter.user / 1_000_000;

    const cpuSystemSeconds = cpuAfter.system / 1_000_000;

    const totalCpuSeconds = cpuUserSeconds + cpuSystemSeconds;

    const heapDelta = memAfter.heapUsed - memBefore.heapUsed;

    const rssDelta = memAfter.rss - memBefore.rss;

    this.metrics.observeProcessingTime(jobDuration);

    this.metrics.observeCpuUsage(totalCpuSeconds);

    this.metrics.observeHeapUsage(heapDelta);

    this.metrics.observeRssUsage(rssDelta);
  }
}
