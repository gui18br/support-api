import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserUseCase } from '../../application/use-cases/create-user.usecase';

@Controller('users')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  async create(@Body() body: { name: string; email: string }) {
    await this.createUserUseCase.execute(body);
    return { message: 'Usuário criado com sucesso' };
  }
}
