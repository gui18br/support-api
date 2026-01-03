import { BadRequestException } from '@nestjs/common';

export class Feedback {
  public readonly createdAt: Date;

  constructor(
    public readonly id: string,
    public readonly ticketId: string,
    public content: string,
  ) {
    this.createdAt = new Date();
    this.validate();
  }

  private validate() {
    if (!this.ticketId) {
      throw new BadRequestException('Ticket id is required');
    }

    if (!this.content) {
      throw new BadRequestException('Content is required');
    }
  }
}
