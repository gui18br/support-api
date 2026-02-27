import { SentimentAnalyzerGateway } from 'src/modules/processing/application/gateways/sentiment-analyzer.gateway';
import { Sentiment } from 'src/modules/processing/domain/entities/sentiment.entity';
import { SentimentAnalyzer } from '../sentiment.analyzer';
import { SentimentMapper } from '../mappers/sentiment.mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SentimentAnalyzerGatewayImpl implements SentimentAnalyzerGateway {
  constructor(private analyzer: SentimentAnalyzer) {}

  async analizarSentimento(text: string): Promise<Sentiment> {
    const response = await this.analyzer.analizarSentimento({ text: text });

    return SentimentMapper.mapperToDomain(response);
  }
}
