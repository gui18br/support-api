import { TicketRepository } from '../../domain/repositories/ticket.repository';
import { TicketResponseDTO } from '../dtos/ticket-response.dto';

export class GetTicketUseCase {
  constructor(private readonly ticketRepository: TicketRepository) {}

  async execute(id: string): Promise<TicketResponseDTO> {
    const ticket = await this.ticketRepository.getTicketById(id);

    return {
      ticket,
    };
  }
}
