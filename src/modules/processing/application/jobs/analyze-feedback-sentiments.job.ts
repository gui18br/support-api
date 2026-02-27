import pLimit from 'p-limit';
import { Job } from '../../domain/contracts/job.interface';
import { FeedbackRepository } from 'src/modules/feedback/domain/repositories/feedback.repository';
import { SentimentAnalyzerGateway } from '../gateways/sentiment-analyzer.gateway';

export class AnalyzeFeedbackSentimentsJob implements Job {
  name = 'analyze-feedback-sentiments';

  private readonly BATCH_SIZE = 100;
  private readonly CONCURRENCY = 20;

  constructor(
    private readonly feedbackRepository: FeedbackRepository,
    private readonly sentimentAnalyzerGateway: SentimentAnalyzerGateway,
  ) {}

  async run(): Promise<void> {
    let page = 0;

    while (true) {
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
              const result =
                await this.sentimentAnalyzerGateway.analizarSentimento(
                  feedback.content,
                );

              feedback.analyzeSentiment(result.score, result.label);

              await this.feedbackRepository.save(feedback);
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
