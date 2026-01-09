import { BadRequestException } from '@nestjs/common';

export class Feedback {
  public readonly createdAt: Date;

  constructor(
    public readonly uuid: string,
    public readonly ticketUuid: string,
    public content: string,
  ) {
    this.createdAt = new Date();
    this.validate();
  }

  private validate() {
    if (!this.ticketUuid) {
      throw new BadRequestException('Ticket uuid is required');
    }

    if (!this.content) {
      throw new BadRequestException('Content is required');
    }
  }
}
