import { TicketStatus } from '../enums/ticket-status.enum';

export class Ticket {
  constructor(
    public readonly uuid: string,
    public readonly userUuid: string,
    public status: TicketStatus,
  ) {
    this.validate();
  }

  private validate() {
    if (!Object.values(TicketStatus).includes(this.status))
      throw new Error('Status required');
  }
}
