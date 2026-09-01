export interface JwtPayload {
  userId: number;
  email: string;
  username: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  createdAt: Date;
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
}
