import { apiClient } from './client';
import { ApiResponse, DashboardData } from '@/types';

export const dashboardApi = {
  async getDashboard(): Promise<DashboardData> {
    const response = await apiClient.get<ApiResponse<DashboardData>>('/dashboard');
    return response.data.data;
  },
};
