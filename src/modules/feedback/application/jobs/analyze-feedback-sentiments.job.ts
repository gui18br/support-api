import { AnalyzeSentimentUseCase } from 'src/modules/sentiment/application/use-cases/analyse-sentiment.usecase';
import { FeedbackRepository } from '../../domain/repositories/feedback.repository';
import { Sentiment } from 'src/modules/sentiment/domain/entities/sentiment.entity';

export class AnalyzeFeedbackSentimentsJob {
  constructor(
    private readonly feedbackRepository: FeedbackRepository,
    private readonly analyzeSentiment: AnalyzeSentimentUseCase,
  ) {}

  async run(): Promise<void> {
    const feedbacks = await this.feedbackRepository.findNotAnalyzed();

    for (const feedback of feedbacks) {
      const sentiment = new Sentiment(feedback.content);
      const result = this.analyzeSentiment.execute(sentiment);

      feedback.analyzeSentiment(result.score, result.label);
      await this.feedbackRepository.save(feedback);
    }
  }
}
