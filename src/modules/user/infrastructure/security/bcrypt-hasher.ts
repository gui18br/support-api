import * as bcrypt from 'bcrypt';
import { PasswordHasher } from '../../application/ports/password-hasher';

export class BcryptHasher implements PasswordHasher {
  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, 10);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
