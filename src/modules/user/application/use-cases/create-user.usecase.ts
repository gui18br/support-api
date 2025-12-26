import { randomUUID } from 'crypto';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { UserDTO } from '../dtos/user.dto';
import { PasswordHasher } from '../ports/password-hasher';
import { UserRole } from '../../domain/enums/user-role.enum';
import { CreateUserResponseDTO } from '../dtos/create-user-response.dto';
import { TokenGenerator } from '../ports/token-generator';
import { ConflictException } from '@nestjs/common';

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenGenerator: TokenGenerator,
  ) {}

  async execute(dto: UserDTO): Promise<CreateUserResponseDTO> {
    const userAlreadyExists = await this.userRepository.findByEmail(dto.email);
    if (userAlreadyExists) throw new ConflictException('User already exists');

    const passwordHash = await this.passwordHasher.hash(dto.password!);

    const user = new User(
      randomUUID(),
      dto.name,
      dto.email,
      passwordHash,
      dto.role ?? UserRole.Normal,
    );

    await this.userRepository.create(user);

    const token = this.tokenGenerator.generate({
      id: user.id,
      email: user.email,
    });

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
