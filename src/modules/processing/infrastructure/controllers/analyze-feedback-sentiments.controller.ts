import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AnalyzeFeedbacksUseCase } from '../../application/use-cases/analyze-feedbacks.usecase';

@Controller('admin/feedbacks')
export class AnalyzeFeedbackSentimentController {
  constructor(private readonly useCase: AnalyzeFeedbacksUseCase) {}

  @Post('analyze-sentiments')
  @HttpCode(HttpStatus.ACCEPTED)
  async runManually(): Promise<{ message: string }> {
    await this.useCase.run();

    return {
      message: 'Processamento iniciado em paralelo',
    };
  }
}
