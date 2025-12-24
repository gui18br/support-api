import { randomUUID } from 'crypto';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { PasswordHasher } from '../ports/password-hasher';
import { UserRole } from '../../domain/enums/user-role.enum';

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(dto: CreateUserDTO): Promise<void> {
    const userAlreadyExists = await this.userRepository.findByEmail(dto.email);
    if (userAlreadyExists) throw new Error('User already exists');

    const passwordHash = await this.passwordHasher.hash(dto.password);

    const user = new User(
      randomUUID(),
      dto.name,
      dto.email,
      passwordHash,
      dto.role ?? UserRole.Normal,
    );

    await this.userRepository.create(user);
  }
}
