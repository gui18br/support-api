/* eslint-disable 
  @typescript-eslint/no-unsafe-return,
  @typescript-eslint/no-unsafe-call,
  @typescript-eslint/no-unsafe-member-access
*/
import jwt from 'jsonwebtoken';
import { TokenGenerator } from '../../application/ports/token-generator';

export class JwtTokenGenerator implements TokenGenerator {
  generate(payload: Record<string, unknown>): string {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '3h',
    });
  }
}
