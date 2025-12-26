import { UserRole } from '../../domain/enums/user-role.enum';

export class UpdateUserDTO {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}
