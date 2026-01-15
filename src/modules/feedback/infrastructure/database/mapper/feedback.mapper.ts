import { Feedback } from 'src/modules/feedback/domain/entities/feedback.entity';
import { FeedbackEntity } from '../entities/feedback.entity';
import { TicketEntity } from 'src/modules/ticket/infrastructure/database/entities/ticket.entity';

export class FeedbackMapper {
  static toDomain(entity: FeedbackEntity): Feedback {
    const feedback = new Feedback(
      entity.uuid,
      entity.ticket?.uuid,
      entity.content,
      entity.createdAt,
    );

    feedback.sentimentScore = entity.sentiment_score;
    feedback.sentimentLabel = entity.sentiment_label;
    feedback.sentimentAnalyzedAt = entity.sentiment_analyzed_at;

    return feedback;
  }

  static toEntity(feedback: Feedback): FeedbackEntity {
    const entity = new FeedbackEntity();

    entity.uuid = feedback.uuid;
    entity.content = feedback.content;
    entity.createdAt = feedback.createdAt;
    entity.sentiment_score = feedback.sentimentScore;
    entity.sentiment_label = feedback.sentimentLabel;
    entity.sentiment_analyzed_at = feedback.sentimentAnalyzedAt;

    entity.ticket = {
      uuid: feedback.ticketUuid,
    } as TicketEntity;

    return entity;
  }
}
