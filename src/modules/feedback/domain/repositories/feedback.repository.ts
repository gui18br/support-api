import { Feedback } from '../entities/feedback.entity';

export interface FeedbackRepository {
  create(feedback: Feedback): Promise<void>;
}
