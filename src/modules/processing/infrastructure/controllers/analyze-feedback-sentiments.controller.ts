import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AnalyzeFeedbacksOrchestrator } from '../../application/orchestrators/analyze-feedbacks.orchestrator';

@Controller('admin/feedbacks')
export class AnalyzeFeedbackSentimentController {
  constructor(private readonly orchestrator: AnalyzeFeedbacksOrchestrator) {}

  @Post('analyze-sentiments')
  @HttpCode(HttpStatus.ACCEPTED)
  async runManually(): Promise<{ message: string }> {
    await this.orchestrator.run();

    return {
      message: 'Processamento iniciado em paralelo',
    };
  }
}
