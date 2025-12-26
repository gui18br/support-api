export interface LoginUserResponseDTO {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}
