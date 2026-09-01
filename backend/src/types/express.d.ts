import { JwtPayload } from './auth.types';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}

export {};
