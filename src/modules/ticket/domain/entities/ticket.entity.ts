import { TicketStatus } from '../enums/ticket-status.enum';

export class Ticket {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    private _status: TicketStatus,
  ) {
    this.validate();
  }

  get status(): TicketStatus {
    return this._status;
  }

  private validate() {
    if (!this.userId) {
      throw new Error('User id is required');
    }

    if (!Object.values(TicketStatus).includes(this._status)) {
      throw new Error(`Invalid ticket status`);
    }
  }
}
