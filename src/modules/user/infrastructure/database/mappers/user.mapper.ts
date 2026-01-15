import { User } from 'src/modules/user/domain/entities/user.entity';
import { UserEntity } from '../entities/user.entity';

export class UserMapper {
  static toDomain(entity: UserEntity): User {
    return new User(
      entity.uuid,
      entity.name,
      entity.email,
      entity.password,
      entity.role,
      entity.createdAt,
    );
  }

  static toEntity(user: User): UserEntity {
    const entity = new UserEntity();
    Object.assign(entity, user);
    return entity;
  }
}
