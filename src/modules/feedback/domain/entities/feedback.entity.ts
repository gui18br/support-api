import { BadRequestException } from '@nestjs/common';
import { SentimentLabel } from 'src/modules/sentiment/domain/enums/sentiment-label.enum';

export class Feedback {
  public readonly createdAt: Date;
  public sentimentScore?: number;
  public sentimentLabel?: SentimentLabel;
  public sentimentAnalyzedAt?: Date;

  constructor(
    public readonly uuid: string,
    public readonly ticketUuid: string,
    public content: string,
    createdAt?: Date,
  ) {
    this.createdAt = createdAt ?? new Date();
    this.validate();
  }

  analyzeSentiment(score: number, label: SentimentLabel) {
    this.sentimentScore = score;
    this.sentimentLabel = label;
    this.sentimentAnalyzedAt = new Date();
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
