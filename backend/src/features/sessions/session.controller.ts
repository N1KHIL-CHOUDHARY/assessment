import { Request, Response, NextFunction } from 'express';
import { sessionService } from './session.service';
import { sendCreated, sendSuccess } from '../../utils/apiResponse';

export class SessionController {
  async startSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const topicId = Number(req.params.topicId);
      const session = await sessionService.startSession(userId, topicId);
      sendCreated(res, session, 'Learning session started successfully');
    } catch (error) {
      next(error);
    }
  }

  async getSessionById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const sessionId = Number(req.params.sessionId);
      const session = await sessionService.getSessionById(userId, sessionId);
      sendSuccess(res, session);
    } catch (error) {
      next(error);
    }
  }

  async endSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const sessionId = Number(req.params.sessionId);
      const session = await sessionService.endSession(userId, sessionId);
      sendSuccess(res, session, 'Learning session ended successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const sessionController = new SessionController();
