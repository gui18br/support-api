import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AnalyzeFeedbackSentimentsJob } from '../../application/jobs/analyze-feedback-sentiments.job';

@Injectable()
export class AnalyzeFeedbackSentimentsScheduler {
  private running = false;

  constructor(private readonly job: AnalyzeFeedbackSentimentsJob) {}

  @Cron('*/5 * * * *')
  async handleCron(): Promise<void> {
    console.log('🔥 Job AnalyzeFeedbackSentimentsJob iniciado');

    if (this.running) return;

    this.running = true;
    try {
      await this.job.run();
    } finally {
      this.running = false;
    }
  }
}
