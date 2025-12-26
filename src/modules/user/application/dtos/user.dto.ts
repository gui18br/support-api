import { UserRole } from '../../domain/enums/user-role.enum';

export class UserDTO {
  name: string;
  email: string;
  password?: string;
  role?: UserRole;
}
