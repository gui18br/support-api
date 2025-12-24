import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  // eslint-disable-next-line @typescript-eslint/require-await
  async create(user: User): Promise<void> {
    this.users.push(user);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null;
  }
}
