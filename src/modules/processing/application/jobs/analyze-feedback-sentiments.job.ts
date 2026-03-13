import pLimit from 'p-limit';
import { Job } from '../../domain/contracts/job.interface';
import { FeedbackRepository } from 'src/modules/feedback/domain/repositories/feedback.repository';
import { AnalyzeSentimentUseCase } from 'src/modules/sentiment/application/use-cases/analyse-sentiment.usecase';
import { Sentiment } from 'src/modules/sentiment/domain/entities/sentiment.entity';

export class AnalyzeFeedbackSentimentsJob implements Job {
  name = 'analyze-feedback-sentiments';

  private readonly BATCH_SIZE = 1000;
  private readonly CONCURRENCY = 40;
  private readonly limit = pLimit(this.CONCURRENCY);

  constructor(
    private readonly feedbackRepository: FeedbackRepository,
    private readonly analyzeSentiment: AnalyzeSentimentUseCase,
  ) {}

  async run(): Promise<void> {
    while (true) {
      const feedbacks = await this.feedbackRepository.findNotAnalyzedPaginated(
        this.BATCH_SIZE,
      );

      if (!feedbacks.length) break;

      await Promise.all(
        feedbacks.map((feedback) =>
          this.limit(async () => {
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
    }
  }
}
