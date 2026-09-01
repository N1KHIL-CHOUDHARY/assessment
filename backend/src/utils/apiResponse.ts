import { Response } from 'express';
import { ApiResponse } from '../types/api.types';

export function sendSuccess<T>(
  res: Response,
  data?: T,
  message?: string,
  statusCode = 200,
  meta?: ApiResponse['meta']
): Response {
  const response: ApiResponse<T> = {
    success: true,
    ...(message ? { message } : {}),
    ...(data !== undefined ? { data } : {}),
    ...(meta ? { meta } : {}),
  };
  return res.status(statusCode).json(response);
}

export function sendCreated<T>(res: Response, data: T, message?: string): Response {
  return sendSuccess(res, data, message, 201);
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 400,
  errorDetails?: unknown
): Response {
  const response: ApiResponse = {
    success: false,
    message,
    ...(errorDetails ? { error: errorDetails as Record<string, unknown> } : {}),
  };
  return res.status(statusCode).json(response);
}
