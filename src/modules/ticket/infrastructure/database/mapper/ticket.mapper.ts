import { Ticket } from 'src/modules/ticket/domain/entities/ticket.entity';
import { TicketEntity } from '../entities/ticket.entity';

import { UserEntity } from 'src/modules/user/infrastructure/database/entities/user.entity';

export class TicketMapper {
  static toDomain(entity: TicketEntity): Ticket {
    return new Ticket(entity.uuid, entity.user.uuid, entity.status);
  }

  static toEntity(ticket: Ticket): TicketEntity {
    const entity = new TicketEntity();

    entity.uuid = ticket.uuid;
    entity.status = ticket.status;

    entity.user = {
      uuid: ticket.userUuid,
    } as UserEntity;

    return entity;
  }
}
