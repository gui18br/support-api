import { Sentiment } from '../../domain/entities/sentiment.entity';

export interface SentimentAnalyzerGateway {
  analizarSentimento(text: string): Promise<Sentiment>;
}
