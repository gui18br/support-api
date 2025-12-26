import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { CreateUserUseCase } from '../../application/use-cases/create-user.usecase';
import { CreateUserDTO } from '../../application/dtos/create-user.dto';
import { LoginUserUseCase } from '../../application/use-cases/login-user.usecase';
import { LoginUserDTO } from '../../application/dtos/login-user.dto';
import { LoginUserResponseDTO } from '../../application/dtos/login-user-response.dto';
import { CreateUserResponseDTO } from '../../application/dtos/create-user-response.dto';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.usecase';
import { UpdateUserResponseDTO } from '../../application/dtos/update-user-response.dto copy';
import { UpdateUserDTO } from '../../application/dtos/update-user.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
  ) {}

  @Post()
  async create(@Body() body: CreateUserDTO): Promise<CreateUserResponseDTO> {
    return await this.createUserUseCase.execute(body);
  }

  @Post('login')
  async login(@Body() body: LoginUserDTO): Promise<LoginUserResponseDTO> {
    return await this.loginUserUseCase.execute(body);
  }

  @Put(':id')
  async update(
    @Body() body: UpdateUserDTO,
    @Param('id') id: string,
  ): Promise<UpdateUserResponseDTO> {
    return await this.updateUserUseCase.execute(body, id);
  }
}
