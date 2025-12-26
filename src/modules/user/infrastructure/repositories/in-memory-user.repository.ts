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

  // eslint-disable-next-line @typescript-eslint/require-await
  async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async updateUser(user: User): Promise<User> {
    const index = this.users.findIndex(
      (userFind) => userFind.email === user.email,
    );

    this.users[index] = user;

    return this.users[index];
  }
}
