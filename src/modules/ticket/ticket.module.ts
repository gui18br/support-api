import { Module } from '@nestjs/common';
import { TicketController } from './infrastructure/controllers/ticket.controller';
import { InMemoryTicketRepository } from './infrastructure/repositories/in-memory-tikect.repository';
import { ticketUseCasesProviders } from './ticket.usecases.providers';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [TicketController],
  providers: [
    {
      provide: 'TicketRepository',
      useClass: InMemoryTicketRepository,
    },
    ...ticketUseCasesProviders,
  ],
})
export class TicketModule {}
