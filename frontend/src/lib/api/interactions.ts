import { apiClient } from './client';
import { ApiResponse, Interaction, CreateInteractionPayload, FeedbackPayload, PaginationMeta } from '@/types';

export const interactionApi = {
  async createInteraction(sessionId: number, payload: CreateInteractionPayload): Promise<Interaction> {
    const response = await apiClient.post<ApiResponse<Interaction>>(`/sessions/${sessionId}/interactions`, payload);
    return response.data.data;
  },

  async getSessionInteractions(
    sessionId: number,
    query?: { page?: number; limit?: number; order?: 'asc' | 'desc' }
  ): Promise<{ interactions: Interaction[]; meta: PaginationMeta }> {
    const params = new URLSearchParams();
    if (query?.page) params.append('page', query.page.toString());
    if (query?.limit) params.append('limit', query.limit.toString());
    if (query?.order) params.append('order', query.order);

    const response = await apiClient.get<ApiResponse<Interaction[]>>(`/sessions/${sessionId}/interactions`, {
      params,
    });

    return {
      interactions: response.data.data,
      meta: response.data.meta || {
        page: query?.page || 1,
        limit: query?.limit || 20,
        total: response.data.data.length,
        totalPages: 1,
      },
    };
  },

  async submitFeedback(interactionId: number, payload: FeedbackPayload): Promise<Interaction> {
    const response = await apiClient.patch<ApiResponse<Interaction>>(`/interactions/${interactionId}/feedback`, payload);
    return response.data.data;
  },
};
