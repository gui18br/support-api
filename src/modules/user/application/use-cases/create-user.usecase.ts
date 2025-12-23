import { randomUUID } from 'crypto';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';

interface CreateUserInput {
  name: string;
  email: string;
}

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: CreateUserInput): Promise<void> {
    const userAlreadyExists = await this.userRepository.findByEmail(
      input.email,
    );

    if (userAlreadyExists) {
      throw new Error('User already exists');
    }

    const user = new User(randomUUID(), input.name, input.email);

    await this.userRepository.save(user);
  }
}
