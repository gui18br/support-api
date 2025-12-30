import { Body, Controller, Post } from '@nestjs/common';
import { CreateTicketUseCase } from '../../application/use-cases/create-ticket.usecase';
import { CreateTicketDTO } from '../../application/dtos/create-ticket.dto';
import { CreateTicketResponseDTO } from '../../application/dtos/create-ticket-response.dto';

@Controller('tickets')
export class TicketController {
  constructor(private readonly createTicketUseCase: CreateTicketUseCase) {}

  @Post()
  async create(
    @Body() body: CreateTicketDTO,
  ): Promise<CreateTicketResponseDTO> {
    return await this.createTicketUseCase.execute(body);
  }
}
