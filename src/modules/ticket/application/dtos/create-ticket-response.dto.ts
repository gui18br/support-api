import { TicketStatus } from '../../domain/enums/ticket-status.enum';

export interface TicketResponseDTO {
  ticket: {
    id: string;
    userId: string;
    status: TicketStatus;
  };
}
