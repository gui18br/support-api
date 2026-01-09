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
    const ticket = await this.ticketRepository.findById(dto.ticketUuid);

    if (!ticket) throw new NotFoundException('Ticket não encontrado');

    const feedback = new Feedback(randomUUID(), dto.ticketUuid, dto.content);

    await this.feedbackRepository.save(feedback);

    return {
      feedback: {
        uuid: feedback.uuid,
        ticketUuid: feedback.ticketUuid,
        content: feedback.content,
      },
    };
  }
}
