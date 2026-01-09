import { Feedback } from 'src/modules/feedback/domain/entities/feedback.entity';
import { FeedbackEntity } from '../entities/feedback.entity';
import { TicketEntity } from 'src/modules/ticket/infrastructure/database/entities/ticket.entity';

export class FeedbackMapper {
  static toDomain(entity: FeedbackEntity): Feedback {
    return new Feedback(entity.uuid, entity.ticket.uuid, entity.content);
  }

  static toEntity(feedback: Feedback): FeedbackEntity {
    const entity = new FeedbackEntity();

    entity.uuid = feedback.uuid;
    entity.content = feedback.content;

    entity.ticket = {
      uuid: feedback.ticketUuid,
    } as TicketEntity;

    return entity;
  }
}
