import { UserRole } from '../../domain/enums/user-role.enum';

export class CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}
