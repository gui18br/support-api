import { UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { LoginUserResponseDTO } from '../dtos/login-user-response.dto';
import { LoginUserDTO } from '../dtos/login-user.dto';
import { PasswordHasher } from '../ports/password-hasher';
import { TokenGenerator } from '../ports/token-generator';

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenGenerator: TokenGenerator,
  ) {}

  async execute(dto: LoginUserDTO): Promise<LoginUserResponseDTO> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('User dont exists');

    const decriptedPassword = await this.passwordHasher.compare(
      dto.password,
      user.password,
    );

    if (!decriptedPassword)
      throw new UnauthorizedException('Email e/ou senha inválidos');

    const token = this.tokenGenerator.generate({
      uuid: user.uuid,
      email: user.email,
    });

    return {
      accessToken: token,
      user: {
        uuid: user.uuid,
        email: user.email,
        role: user.role,
      },
    };
  }
}
