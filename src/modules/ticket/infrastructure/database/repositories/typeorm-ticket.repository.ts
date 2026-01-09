import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from '../../../domain/entities/ticket.entity';
import { TicketRepository } from '../../../domain/repositories/ticket.repository';
import { TicketEntity } from '../entities/ticket.entity';
import { Repository } from 'typeorm';
import { TicketMapper } from '../mapper/ticket.mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TypeOrmTicketRepository implements TicketRepository {
  constructor(
    @InjectRepository(TicketEntity)
    private readonly ormRepo: Repository<TicketEntity>,
  ) {}

  async save(ticket: Ticket): Promise<void> {
    const entity = TicketMapper.toEntity(ticket);
    await this.ormRepo.save(entity);
  }

  async findById(uuid: string): Promise<Ticket | null> {
    const entity = await this.ormRepo.findOne({
      where: { uuid },
      relations: ['user'],
    });
    return entity ? TicketMapper.toDomain(entity) : null;
  }
}
