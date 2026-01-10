import { BadRequestException } from '@nestjs/common';

export class Sentiment {
  constructor(public text: string) {
    this.validate();
  }

  private validate() {
    if (!this.text) throw new BadRequestException('Text is required.');
  }
}
