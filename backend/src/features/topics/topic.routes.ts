
import { Router } from 'express';
import { topicController } from './topic.controller';
import { sessionController } from '../sessions/session.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createTopicSchema, topicIdParamSchema } from './topic.validator';
import { startSessionSchema } from '../sessions/session.validator';

const router = Router();

// All topic endpoints require authentication
router.use(authenticate);

// POST /api/topics
router.post('/', validate(createTopicSchema), topicController.createTopic);

// GET /api/topics
router.get('/', topicController.getTopics);

// GET /api/topics/:topicId
router.get('/:topicId', validate(topicIdParamSchema), topicController.getTopicById);

// POST /api/topics/:topicId/sessions
router.post('/:topicId/sessions', validate(startSessionSchema), sessionController.startSession);

export default router;
