import { UserRole } from '../enums/user-role.enum';

export class User {
  public readonly createdAt: Date;

  constructor(
    public readonly uuid: string,
    public name: string,
    public email: string,
    public password: string,
    public role: UserRole,
    createdAt?: Date,
  ) {
    this.validate();
    this.createdAt = createdAt ?? new Date();
  }

  private validate() {
    if (!this.name.trim()) throw new Error('Name required');
    if (!this.email.includes('@')) throw new Error('Invalid email');
  }
}
