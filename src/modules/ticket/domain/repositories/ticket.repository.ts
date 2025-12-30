import { Ticket } from '../entities/ticket.entity';

export interface TicketRepository {
  create(ticket: Ticket): Promise<void>;
  getTicketById(id: string): Promise<Ticket>;
}
