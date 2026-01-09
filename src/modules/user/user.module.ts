import { Module } from '@nestjs/common';
import { UserController } from './infrastructure/controllers/user.controller';
import { BcryptHasher } from './infrastructure/security/bcrypt-hasher';
import { JwtTokenGenerator } from './infrastructure/cryptography/jwt-token-generator';
import { userUseCasesProviders } from './user.usecases.providers';
import { TypeOrmUSerRepository } from './infrastructure/database/repositories/typeorm-user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infrastructure/database/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    {
      provide: 'TypeOrmUSerRepository',
      useClass: TypeOrmUSerRepository,
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
  exports: ['TypeOrmUSerRepository'],
})
export class UserModule {}
