import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AnalyzeFeedbacksUseCase } from '../../application/use-cases/analyze-feedbacks.usecase';

@Injectable()
export class AnalyzeFeedbackSentimentsScheduler {
  private running = false;

  constructor(private readonly useCase: AnalyzeFeedbacksUseCase) {}

  @Cron('*/5 * * * *')
  async handleCron(): Promise<void> {
    console.log('🔥 Job AnalyzeFeedbackSentimentsJob iniciado');

    if (this.running) return;

    this.running = true;
    try {
      await this.useCase.run();
    } finally {
      this.running = false;
    }
  }
}
