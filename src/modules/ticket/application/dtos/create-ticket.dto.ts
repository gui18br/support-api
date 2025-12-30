import { TicketStatus } from '../../domain/enums/ticket-status.enum';

export class CreateTicketDTO {
  userId: string;
  status: TicketStatus;
}
