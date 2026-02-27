import { Sentiment } from '../../domain/entities/sentiment.entity';

export abstract class SentimentAnalyzerGateway {
  abstract analizarSentimento(text: string): Promise<Sentiment>;
}
