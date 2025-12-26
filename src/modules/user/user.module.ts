import { Module } from '@nestjs/common';
import { UserController } from './infrastructure/controllers/user.controller';
import { InMemoryUserRepository } from './infrastructure/repositories/in-memory-user.repository';
import { BcryptHasher } from './infrastructure/security/bcrypt-hasher';
import { JwtTokenGenerator } from './infrastructure/cryptography/jwt-token-generator';
import { userUseCasesProviders } from './user.usecases.providers';

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: 'UserRepository',
      useClass: InMemoryUserRepository,
    },
    {
      provide: 'PasswordHasher',
      useClass: BcryptHasher,
    },
    {
      provide: 'JwtTokenGenerator',
      useClass: JwtTokenGenerator,
    },

    ...userUseCasesProviders,
  ],
})
export class UserModule {}
