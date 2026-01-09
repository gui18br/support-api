import { UnauthorizedException } from '@nestjs/common';
import { TicketRepository } from '../../domain/repositories/ticket.repository';
import { TicketResponseDTO } from '../dtos/ticket-response.dto';

export class GetTicketUseCase {
  constructor(private readonly ticketRepository: TicketRepository) {}

  async execute(uuid: string): Promise<TicketResponseDTO> {
    const ticket = await this.ticketRepository.findById(uuid);

    if (!ticket) throw new UnauthorizedException('Ticket dont exists');

    return {
      ticket,
    };
  }
}
