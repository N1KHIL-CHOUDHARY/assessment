import { apiClient } from './client';
import { ApiResponse, AuthResponseData, CurrentUserResponseData, LoginPayload, RegisterPayload, User } from '@/types';

export const authApi = {
  async login(payload: LoginPayload): Promise<AuthResponseData> {
    const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/login', payload);
    return response.data.data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponseData> {
    const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/register', payload);
    return response.data.data;
  },

  async getMe(): Promise<User> {
    const response = await apiClient.get<ApiResponse<CurrentUserResponseData>>('/auth/me');
    return response.data.data.user;
  },
};
