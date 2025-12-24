import { UserRole } from '../enums/user-role.enum';

export class User {
  public readonly createdAt: Date;

  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public password: string,
    public role: UserRole,
  ) {
    this.createdAt = new Date();
    this.validate();
  }

  private validate() {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('User name is required');
    }

    if (!this.password || this.password.trim().length === 0) {
      throw new Error('User password is required');
    }

    if (!this.email.includes('@')) {
      throw new Error('Invalid email');
    }
  }
}
