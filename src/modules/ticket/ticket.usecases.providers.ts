import { UserRepository } from '../user/domain/repositories/user.repository';
import { CreateTicketUseCase } from './application/use-cases/create-ticket.usecase';
import { TicketRepository } from './domain/repositories/ticket.repository';

export const ticketUseCasesProviders = [
  {
    provide: CreateTicketUseCase,
    useFactory: (
      ticketRepository: TicketRepository,
      userRepository: UserRepository,
    ) => new CreateTicketUseCase(ticketRepository, userRepository),
    inject: ['TicketRepository', 'UserRepository'],
  },
];
