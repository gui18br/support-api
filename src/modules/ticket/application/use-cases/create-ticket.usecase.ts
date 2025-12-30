import { randomUUID } from 'crypto';
import { NotFoundException } from '@nestjs/common';

import { Ticket } from '../../domain/entities/ticket.entity';
import { TicketRepository } from '../../domain/repositories/ticket.repository';
import { CreateTicketDTO } from '../dtos/create-ticket.dto';
import { CreateTicketResponseDTO } from '../dtos/create-ticket-response.dto';
import { UserRepository } from 'src/modules/user/domain/repositories/user.repository';

export class CreateTicketUseCase {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(dto: CreateTicketDTO): Promise<CreateTicketResponseDTO> {
    const user = await this.userRepository.findById(dto.userId);

    if (!user) throw new NotFoundException('Usuário não encontrado');

    const ticket = new Ticket(randomUUID(), dto.userId, dto.status);

    await this.ticketRepository.create(ticket);

    return {
      ticket: {
        id: ticket.id,
        userId: ticket.userId,
        status: ticket.status,
      },
    };
  }
}
