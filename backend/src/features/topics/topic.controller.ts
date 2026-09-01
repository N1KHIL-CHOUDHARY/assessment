import { Request, Response, NextFunction } from 'express';
import { topicService } from './topic.service';
import { sendCreated, sendSuccess } from '../../utils/apiResponse';

export class TopicController {
  async createTopic(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const topic = await topicService.createTopic(userId, req.body);
      sendCreated(res, topic, 'Topic created successfully');
    } catch (error) {
      next(error);
    }
  }

  async getTopics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const topics = await topicService.getUserTopics(userId);
      sendSuccess(res, topics);
    } catch (error) {
      next(error);
    }
  }

  async getTopicById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const topicId = Number(req.params.topicId);
      const topic = await topicService.getTopicById(userId, topicId);
      sendSuccess(res, topic);
    } catch (error) {
      next(error);
    }
  }
}

export const topicController = new TopicController();
