import { TicketRepository } from 'src/modules/ticket/domain/repositories/ticket.repository';
import { FeedbackRepository } from '../../domain/repositories/feedback.repository';
import { CreateFeedbackDTO } from '../dtos/create-feedback.dto';
import { FeedbackResponseDTO } from '../dtos/feedback-response';
import { NotFoundException } from '@nestjs/common';
import { Feedback } from '../../domain/entities/feedback.entity';
import { randomUUID } from 'crypto';

export class CreateFeedbackUseCase {
  constructor(
    private readonly feedbackRepository: FeedbackRepository,
    private readonly ticketRepository: TicketRepository,
  ) {}

  async execute(dto: CreateFeedbackDTO): Promise<FeedbackResponseDTO> {
    const ticket = await this.ticketRepository.getTicketById(dto.ticketId);

    if (!ticket) throw new NotFoundException('Ticket não encontrado');

    const feedback = new Feedback(randomUUID(), dto.ticketId, dto.content);

    await this.feedbackRepository.create(feedback);

    return {
      feedback: {
        id: feedback.id,
        ticketId: feedback.ticketId,
        content: feedback.content,
      },
    };
  }
}
