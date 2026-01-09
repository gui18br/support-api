export interface LoginUserResponseDTO {
  accessToken: string;
  user: {
    uuid: string;
    email: string;
    role: string;
  };
}
