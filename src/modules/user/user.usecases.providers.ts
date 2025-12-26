import { CreateUserUseCase } from './application/use-cases/create-user.usecase';
import { LoginUserUseCase } from './application/use-cases/login-user.usecase';
import { UserRepository } from './domain/repositories/user.repository';
import { BcryptHasher } from './infrastructure/security/bcrypt-hasher';
import { JwtTokenGenerator } from './infrastructure/cryptography/jwt-token-generator';
import { UpdateUserUseCase } from './application/use-cases/update-user.usecase';

export const userUseCasesProviders = [
  {
    provide: CreateUserUseCase,
    useFactory: (
      userRepository: UserRepository,
      passwordHasher: BcryptHasher,
      jwtTokenGenerator: JwtTokenGenerator,
    ) =>
      new CreateUserUseCase(userRepository, passwordHasher, jwtTokenGenerator),
    inject: ['UserRepository', 'PasswordHasher', 'JwtTokenGenerator'],
  },
  {
    provide: LoginUserUseCase,
    useFactory: (
      userRepository: UserRepository,
      passwordHasher: BcryptHasher,
      jwtTokenGenerator: JwtTokenGenerator,
    ) =>
      new LoginUserUseCase(userRepository, passwordHasher, jwtTokenGenerator),
    inject: ['UserRepository', 'PasswordHasher', 'JwtTokenGenerator'],
  },
  {
    provide: UpdateUserUseCase,
    useFactory: (userRepository: UserRepository) =>
      new UpdateUserUseCase(userRepository),
    inject: ['UserRepository'],
  },
];
