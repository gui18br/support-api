export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
  ) {
    this.validate();
  }

  private validate() {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('User name is required');
    }

    if (!this.email.includes('@')) {
      throw new Error('Invalid email');
    }
  }
}
