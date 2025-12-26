export interface CreateUserResponseDTO {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}
