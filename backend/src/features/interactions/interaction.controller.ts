import { Request, Response, NextFunction } from 'express';
import { interactionService } from './interaction.service';
import { sendCreated, sendSuccess } from '../../utils/apiResponse';

export class InteractionController {
  async createInteraction(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const sessionId = Number(req.params.sessionId);
      const interaction = await interactionService.createInteraction(userId, sessionId, req.body);
      sendCreated(res, interaction, 'Interaction processed successfully');
    } catch (error) {
      next(error);
    }
  }

  async getSessionInteractions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const sessionId = Number(req.params.sessionId);
      const page = req.query.page ? Number(req.query.page) : undefined;
      const limit = req.query.limit ? Number(req.query.limit) : undefined;
      const order = req.query.order as 'asc' | 'desc' | undefined;

      const result = await interactionService.getSessionInteractions(userId, sessionId, {
        page,
        limit,
        order,
      });

      sendSuccess(res, result.interactions, undefined, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  async updateFeedback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const interactionId = Number(req.params.interactionId);
      const interaction = await interactionService.updateFeedback(userId, interactionId, req.body);
      sendSuccess(res, interaction, 'Feedback submitted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const interactionController = new InteractionController();
