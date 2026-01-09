export interface CreateUserResponseDTO {
  accessToken: string;
  user: {
    uuid: string;
    email: string;
    role: string;
  };
}
