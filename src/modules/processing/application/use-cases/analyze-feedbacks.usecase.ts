import { AnalyzeFeedbackSentimentsJob } from '../jobs/analyze-feedback-sentiments.job';

export class AnalyzeFeedbacksUseCase {
  constructor(private readonly job: AnalyzeFeedbackSentimentsJob) {}

  async run(): Promise<void> {
    await this.job.run();
  }
}
