
import { Router } from 'express';
import { interactionController } from './interaction.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { feedbackSchema } from './interaction.validator';

const router = Router();

// All interaction routes require authentication
router.use(authenticate);

// PATCH /api/interactions/:interactionId/feedback
router.patch(
  '/:interactionId/feedback',
  validate(feedbackSchema),
  interactionController.updateFeedback
);

export default router;
