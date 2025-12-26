import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UpdateUserResponseDTO } from '../dtos/update-user-response.dto copy';
import { UserRole } from '../../domain/enums/user-role.enum';
import { UpdateUserDTO } from '../dtos/update-user.dto';

export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    dto: UpdateUserDTO,
    id: string,
  ): Promise<UpdateUserResponseDTO> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new UnauthorizedException('User dont exists');

    if (!Object.values(UserRole).includes(dto.role!)) {
      throw new BadRequestException('Invalid user role');
    }

    user.email = dto.email ?? user.email;
    user.name = dto.name ?? user.name;
    user.role = dto.role ?? user.role;

    const userUpdated = await this.userRepository.updateUser(user);

    return {
      user: {
        id: userUpdated.id,
        email: userUpdated.email,
        role: userUpdated.role,
      },
    };
  }
}
