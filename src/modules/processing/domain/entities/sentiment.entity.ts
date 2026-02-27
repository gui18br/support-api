import { SentimentLabel } from '../enums/sentiment-label.enum';

export class Sentiment {
  constructor(
    public label: SentimentLabel,
    public score: number,
  ) {}
}
