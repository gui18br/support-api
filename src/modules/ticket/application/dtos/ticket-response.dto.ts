import { TicketStatus } from '../../domain/enums/ticket-status.enum';

export interface TicketResponseDTO {
  ticket: {
    uuid: string;
    userUuid: string;
    status: TicketStatus;
  };
}
