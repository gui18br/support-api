import { Ticket } from '../entities/ticket.entity';

export interface TicketRepository {
  save(ticket: Ticket): Promise<void>;
  findById(uuid: string): Promise<Ticket | null>;
}
