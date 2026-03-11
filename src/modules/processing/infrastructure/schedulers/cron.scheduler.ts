import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AnalyzeFeedbacksOrchestrator } from '../../application/orchestrators/analyze-feedbacks.orchestrator';

@Injectable()
export class AnalyzeFeedbackSentimentsScheduler {
  private running = false;

  constructor(private readonly orchestrator: AnalyzeFeedbacksOrchestrator) {}

  @Cron('*/5 * * * *')
  async handleCron(): Promise<void> {
    console.log('🔥 Job AnalyzeFeedbackSentimentsJob iniciado');

    if (this.running) return;

    this.running = true;
    try {
      await this.orchestrator.run();
    } finally {
      this.running = false;
    }
  }
}
