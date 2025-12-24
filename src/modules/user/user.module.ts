import { Module } from '@nestjs/common';
import { UserController } from './infrastructure/controllers/user.controller';
import { InMemoryUserRepository } from './infrastructure/repositories/in-memory-user.repository';
import { CreateUserUseCase } from './application/use-cases/create-user.usecase';
import { UserRepository } from './domain/repositories/user.repository';
import { BcryptHasher } from './infrastructure/security/bcrypt-hasher';

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
      provide: CreateUserUseCase,
      useFactory: (
        userRepository: UserRepository,
        passwordHasher: BcryptHasher,
      ) => new CreateUserUseCase(userRepository, passwordHasher),
      inject: ['UserRepository', 'PasswordHasher'],
    },
  ],
  exports: [],
})
export class UserModule {}
