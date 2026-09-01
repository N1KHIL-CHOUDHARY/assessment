import { apiClient } from './client';
import { ApiResponse, StartSessionResponseData, SessionDetail, EndSessionResponseData } from '@/types';

export const sessionApi = {
  async startSession(topicId: number): Promise<StartSessionResponseData> {
    const response = await apiClient.post<ApiResponse<StartSessionResponseData>>(`/topics/${topicId}/sessions`);
    return response.data.data;
  },

  async getSessionById(sessionId: number): Promise<SessionDetail> {
    const response = await apiClient.get<ApiResponse<SessionDetail>>(`/sessions/${sessionId}`);
    return response.data.data;
  },

  async endSession(sessionId: number): Promise<EndSessionResponseData> {
    const response = await apiClient.patch<ApiResponse<EndSessionResponseData>>(`/sessions/${sessionId}/end`);
    return response.data.data;
  },
};
