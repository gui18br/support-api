import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AnalyzeFeedbackSentimentsJob } from '../../application/jobs/analyze-feedback-sentiments.job';

@Injectable()
export class AnalyzeFeedbackSentimentsScheduler {
  constructor(private readonly job: AnalyzeFeedbackSentimentsJob) {}

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Cron('*/5 * * * *')
  async handleCron(): Promise<void> {
    await this.job.run();
  }
}
