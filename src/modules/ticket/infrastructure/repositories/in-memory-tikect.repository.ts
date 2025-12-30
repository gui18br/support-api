import { Ticket } from '../../domain/entities/ticket.entity';
import { TicketRepository } from '../../domain/repositories/ticket.repository';

export class InMemoryTicketRepository implements TicketRepository {
  private tickets: Ticket[] = [];

  // eslint-disable-next-line @typescript-eslint/require-await
  async create(ticket: Ticket): Promise<void> {
    this.tickets.push(ticket);
  }
}
