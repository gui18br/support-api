import { Feedback } from '../entities/feedback.entity';

export interface FeedbackRepository {
  save(feedback: Feedback): Promise<void>;
  findNotAnalyzedPaginated(limit: number, offset: number): Promise<Feedback[]>;
  findAnalyzed(): Promise<Feedback[]>;
}
