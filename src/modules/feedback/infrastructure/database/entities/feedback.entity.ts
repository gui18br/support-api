import { TicketEntity } from 'src/modules/ticket/infrastructure/database/entities/ticket.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('feedbacks')
export class FeedbackEntity {
  @PrimaryColumn()
  uuid: string;

  @ManyToOne(() => TicketEntity, { nullable: false })
  @JoinColumn({ name: 'ticket_id' })
  ticket: TicketEntity;

  @Column()
  content: string;
}
