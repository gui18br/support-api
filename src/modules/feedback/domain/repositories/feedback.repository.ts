import { Feedback } from '../entities/feedback.entity';

export interface FeedbackRepository {
  save(feedback: Feedback): Promise<void>;
  findNotAnalyzed(): Promise<Feedback[]>;
}
