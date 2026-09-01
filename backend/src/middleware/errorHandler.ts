import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/apiResponse';
import { env } from '../config/env';

export class AppError extends Error {
  public statusCode: number;
  public details?: unknown;

  constructor(message: string, statusCode = 400, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

interface PrismaErrorPayload {
  code?: string;
  meta?: { target?: string[]; [key: string]: unknown };
  message?: string;
  name?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): void {
  // Handle AppError
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode, err.details);
    return;
  }

  // Handle SyntaxError (e.g. malformed JSON in body)
  if (err instanceof SyntaxError && 'status' in err && (err as { status: number }).status === 400) {
    sendError(res, 'Malformed JSON in request body', 400);
    return;
  }

  // Handle Prisma / Database Known Request Errors
  if (typeof err === 'object' && err !== null && 'code' in err) {
    const prismaErr = err as PrismaErrorPayload;
    switch (prismaErr.code) {
      case 'P2002': {
        const target = (prismaErr.meta?.target as string[]) || ['Field'];
        sendError(res, `A record with this ${target.join(', ')} already exists.`, 409, {
          target: prismaErr.meta?.target,
        });
        return;
      }
      case 'P2025':
        sendError(res, 'Resource not found or has already been deleted.', 404);
        return;
      case 'P2003':
        sendError(res, 'Invalid reference to a related resource.', 400);
        return;
      default:
        sendError(
          res,
          'Database operation failed.',
          400,
          env.NODE_ENV === 'development' ? { code: prismaErr.code, meta: prismaErr.meta } : undefined
        );
        return;
    }
  }

  // Handle Prisma Validation Errors
  if (typeof err === 'object' && err !== null && 'name' in err && (err as { name: string }).name === 'PrismaClientValidationError') {
    const validationErr = err as PrismaErrorPayload;
    sendError(
      res,
      'Invalid data provided to database query.',
      400,
      env.NODE_ENV === 'development' ? { message: validationErr.message } : undefined
    );
    return;
  }

  // Unhandled / Internal Server Error
  const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
  console.error('[UNHANDLED ERROR]:', err);

  sendError(
    res,
    env.NODE_ENV === 'production' ? 'Internal server error. Please try again later.' : errorMessage,
    500,
    env.NODE_ENV === 'development' && err instanceof Error ? { stack: err.stack } : undefined
  );
}
