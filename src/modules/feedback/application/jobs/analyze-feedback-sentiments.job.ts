import pLimit from 'p-limit';
import { FeedbackRepository } from 'src/modules/feedback/domain/repositories/feedback.repository';
import { AnalyzeSentimentUseCase } from 'src/modules/sentiment/application/use-cases/analyse-sentiment.usecase';
import { Sentiment } from 'src/modules/sentiment/domain/entities/sentiment.entity';

const BATCH_SIZE = 100;
const CONCURRENCY = 20;

export class AnalyzeFeedbackSentimentsJob {
  constructor(
    private readonly feedbackRepository: FeedbackRepository,
    private readonly analyzeSentiment: AnalyzeSentimentUseCase,
  ) {}

  async run(): Promise<void> {
    let page = 0;

    while (true) {
      const feedbacks = await this.feedbackRepository.findNotAnalyzedPaginated(
        BATCH_SIZE,
        page * BATCH_SIZE,
      );

      if (!feedbacks.length) break;

      const limit = pLimit(CONCURRENCY);

      await Promise.all(
        feedbacks.map((feedbacks) =>
          limit(async () => {
            try {
              const sentiment = new Sentiment(feedbacks.content);
              const result = this.analyzeSentiment.execute(sentiment);

              feedbacks.analyzeSentiment(result.score, result.label);

              await this.feedbackRepository.save(feedbacks);
            } catch (error) {
              console.error(error);
            }
          }),
        ),
      );

      page++;
    }
  }
}
