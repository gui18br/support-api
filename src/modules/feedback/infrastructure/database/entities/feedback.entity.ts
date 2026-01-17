import { SentimentLabel } from 'src/modules/sentiment/domain/enums/sentiment-label.enum';
import { TicketEntity } from 'src/modules/ticket/infrastructure/database/entities/ticket.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('feedbacks')
export class FeedbackEntity {
  @PrimaryColumn()
  uuid: string;

  @ManyToOne(() => TicketEntity, { nullable: false })
  @JoinColumn({ name: 'ticket_uuid' })
  ticket: TicketEntity;

  @Column()
  content: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'float', nullable: true })
  sentiment_score?: number;

  @Column({
    type: 'enum',
    enum: SentimentLabel,
    enumName: 'feedback_sentiment_label_enum',
    nullable: true,
  })
  sentiment_label?: SentimentLabel;

  @Column({ type: 'timestamp', nullable: true })
  sentiment_analyzed_at?: Date;
}
