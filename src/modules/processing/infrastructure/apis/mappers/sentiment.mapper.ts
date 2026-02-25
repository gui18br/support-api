import { Sentiment } from 'src/modules/processing/domain/entities/sentiment.entity';
import { SentimentResponseDTO } from '../dtos/sentiment-response.dto';

export class SentimentMapper {
  static mapperToDomain(dto: SentimentResponseDTO): Sentiment {
    return new Sentiment(dto.label, dto.score);
  }
}
