import { TicketStatus } from '../../domain/enums/ticket-status.enum';

export class CreateTicketDTO {
  userUuid: string;
  status: TicketStatus;
}
