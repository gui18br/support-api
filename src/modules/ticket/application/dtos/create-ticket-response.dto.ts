import { TicketStatus } from '../../domain/enums/ticket-status.enum';

export interface CreateTicketResponseDTO {
  ticket: {
    id: string;
    userId: string;
    status: TicketStatus;
  };
}
