import { AnalyzeFeedbackSentimentsJob } from '../jobs/analyze-feedback-sentiments.job';

export class AnalyzeFeedbacksOrchestrator {
  constructor(private readonly job: AnalyzeFeedbackSentimentsJob) {}

  async run(): Promise<void> {
    await Promise.all([
      this.job.run(),
      this.job.run(),
      this.job.run(),
      this.job.run(),
    ]);
  }
}
