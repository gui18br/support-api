import { Module } from '@nestjs/common';
import { UserController } from './infrastructure/controllers/user.controller';
import { InMemoryUserRepository } from './infrastructure/repositories/in-memory-user.repository';
import { CreateUserUseCase } from './application/use-cases/create-user.usecase';
import { UserRepository } from './domain/repositories/user.repository';

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: 'UserRepository',
      useClass: InMemoryUserRepository,
    },
    {
      provide: CreateUserUseCase,
      useFactory: (userRepository: UserRepository) =>
        new CreateUserUseCase(userRepository),
      inject: ['UserRepository'],
    },
  ],
  exports: [],
})
export class UserModule {}
