import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateTicketUseCase } from '../../application/use-cases/create-ticket.usecase';
import { CreateTicketDTO } from '../../application/dtos/create-ticket.dto';
import { TicketResponseDTO } from '../../application/dtos/ticket-response.dto';
import { GetTicketUseCase } from '../../application/use-cases/get-ticket.usecase';

@Controller('tickets')
export class TicketController {
  constructor(
    private readonly createTicketUseCase: CreateTicketUseCase,
    private readonly getTicketUseCase: GetTicketUseCase,
  ) {}

  @Post()
  async create(@Body() body: CreateTicketDTO): Promise<TicketResponseDTO> {
    return await this.createTicketUseCase.execute(body);
  }

  @Get(':uuid')
  async get(@Param('uuid') uuid: string): Promise<TicketResponseDTO> {
    return await this.getTicketUseCase.execute(uuid);
  }
}
