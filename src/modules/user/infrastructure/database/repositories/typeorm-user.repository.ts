import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/modules/user/domain/repositories/user.repository';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { User } from 'src/modules/user/domain/entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TypeOrmUSerRepository implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly ormRepo: Repository<UserEntity>,
  ) {}

  async save(user: User): Promise<void> {
    const entity = UserMapper.toEntity(user);
    await this.ormRepo.save(entity);
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.ormRepo.findOne({
      where: { email },
    });

    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findById(uuid: string): Promise<User | null> {
    const entity = await this.ormRepo.findOneBy({ uuid });
    return entity ? UserMapper.toDomain(entity) : null;
  }
}
