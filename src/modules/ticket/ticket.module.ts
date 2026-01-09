import { Module } from '@nestjs/common';
import { TicketController } from './infrastructure/controllers/ticket.controller';
import { ticketUseCasesProviders } from './ticket.usecases.providers';
import { UserModule } from '../user/user.module';
import { TypeOrmTicketRepository } from './infrastructure/database/repositories/typeorm-ticket.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketEntity } from './infrastructure/database/entities/ticket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TicketEntity]), UserModule],
  controllers: [TicketController],
  providers: [
    {
      provide: 'TypeOrmTicketRepository',
      useClass: TypeOrmTicketRepository,
    },
    ...ticketUseCasesProviders,
  ],
  exports: ['TypeOrmTicketRepository'],
})
export class TicketModule {}
