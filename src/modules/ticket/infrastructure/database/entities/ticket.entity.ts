import { TicketStatus } from 'src/modules/ticket/domain/enums/ticket-status.enum';
import { UserEntity } from 'src/modules/user/infrastructure/database/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('tickets')
export class TicketEntity {
  @PrimaryColumn()
  uuid: string;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    enumName: 'ticket_status_enum',
  })
  status: TicketStatus;
}
