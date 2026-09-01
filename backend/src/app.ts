import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import apiRouter from './routes';
import { notFoundHandler } from './middleware/notFoundHandler';
import { errorHandler } from './middleware/errorHandler';

export function createApp(): Express {
  const app = express();

  // Security headers
  app.use(helmet());

  // CORS middleware
  app.use(
    cors({
      origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN,
      credentials: true,
    })
  );

  // Request logger
  if (env.NODE_ENV !== 'test') {
    app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
  }

  // Body parsers
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // Root welcome endpoint
  app.get('/', (req, res) => {
    res.json({
      name: 'Cognibloom Backend API',
      version: '1.0.0',
      description: 'AI-powered learning platform REST API',
      health: '/api/health',
      docs: '/api/docs',
    });
  });

  // Mount API router
  app.use('/api', apiRouter);

  // 404 Fallback
  app.use(notFoundHandler);

  // Global Error Handler
  app.use(errorHandler);

  return app;
}

export const app = createApp();
