import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserUseCase } from '../../application/use-cases/create-user.usecase';
import { CreateUserDTO } from '../../application/dtos/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  async create(@Body() body: CreateUserDTO) {
    await this.createUserUseCase.execute(body);

    return {
      message: 'Usuário criado com sucesso',
    };
  }
}
