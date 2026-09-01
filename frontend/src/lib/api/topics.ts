import { apiClient } from './client';
import { ApiResponse, TopicListItem, TopicDetail, CreateTopicPayload, CreateTopicResponseData } from '@/types';

export const topicApi = {
  async getTopics(): Promise<TopicListItem[]> {
    const response = await apiClient.get<ApiResponse<TopicListItem[]>>('/topics');
    return response.data.data;
  },

  async getTopicById(topicId: number): Promise<TopicDetail> {
    const response = await apiClient.get<ApiResponse<TopicDetail>>(`/topics/${topicId}`);
    return response.data.data;
  },

  async createTopic(payload: CreateTopicPayload): Promise<CreateTopicResponseData> {
    const response = await apiClient.post<ApiResponse<CreateTopicResponseData>>('/topics', payload);
    return response.data.data;
  },
};
