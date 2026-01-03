import { Body, Controller, Post } from '@nestjs/common';
import { CreateFeedbackUseCase } from '../../application/use-cases/create-feedback.usecase';
import { CreateFeedbackDTO } from '../../application/dtos/create-feedback.dto';
import { FeedbackResponseDTO } from '../../application/dtos/feedback-response';

@Controller('feedbacks')
export class FeedbackController {
  constructor(private readonly createFeedbackUseCase: CreateFeedbackUseCase) {}

  @Post()
  async create(@Body() body: CreateFeedbackDTO): Promise<FeedbackResponseDTO> {
    return await this.createFeedbackUseCase.execute(body);
  }
}
