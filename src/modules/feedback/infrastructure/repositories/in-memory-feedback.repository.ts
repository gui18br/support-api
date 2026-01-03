import { Feedback } from '../../domain/entities/feedback.entity';
import { FeedbackRepository } from '../../domain/repositories/feedback.repository';

export class InMemoryFeedbackRepository implements FeedbackRepository {
  private feedbacks: Feedback[] = [];

  // eslint-disable-next-line @typescript-eslint/require-await
  async create(feedback: Feedback): Promise<void> {
    this.feedbacks.push(feedback);
  }
}
