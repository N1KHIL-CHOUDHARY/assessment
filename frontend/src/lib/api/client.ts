import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse, ApiErrorPayload } from '@/types';

export const TOKEN_STORAGE_KEY = 'cognibloom_token';
export const USER_STORAGE_KEY = 'cognibloom_user';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request Interceptor: Attach JWT Bearer Token if available
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Format error payloads & handle 401 gracefully
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ApiResponse<any>>) => {
    const status = error.response?.status;
    const responseData = error.response?.data;

    let normalizedMessage = 'An unexpected error occurred. Please try again.';

    if (responseData?.message) {
      normalizedMessage = responseData.message;
    } else if (responseData?.error?.message) {
      normalizedMessage = responseData.error.message;
    } else if (status === 401) {
      normalizedMessage = 'Your session has expired or you are unauthorized. Please sign in.';
    } else if (status === 404) {
      normalizedMessage = 'Requested resource was not found.';
    } else if (status === 409) {
      normalizedMessage = 'A conflicting record already exists.';
    } else if (status && status >= 500) {
      normalizedMessage = 'Server encountered an error. Please try again shortly.';
    }

    const customError: ApiErrorPayload = {
      message: normalizedMessage,
      statusCode: status,
      errors: responseData?.error?.errors,
      details: responseData?.error?.details,
    };

    if (typeof window !== 'undefined') {
      const requestUrl = error.config?.url || '';
      if (status === 401 && !requestUrl.includes('/auth/login') && !requestUrl.includes('/auth/register')) {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
        window.dispatchEvent(new Event('cognibloom_auth_expired'));
      }
    }

    return Promise.reject(customError);
  }
);
