import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { sendError } from '../utils/apiResponse';

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(res, 'Authentication required. Missing or malformed Authorization header.', 401);
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    sendError(res, 'Authentication token missing.', 401);
    return;
  }

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      sendError(res, 'Authentication token has expired. Please log in again.', 401);
      return;
    }
    sendError(res, 'Invalid authentication token.', 401);
  }
}
