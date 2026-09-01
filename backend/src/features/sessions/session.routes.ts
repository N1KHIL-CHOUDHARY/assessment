import { Router } from 'express';
import { sessionController } from './session.controller';
import { interactionController } from '../interactions/interaction.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { sessionIdParamSchema } from './session.validator';
import {
  createInteractionSchema,
  getInteractionsSchema,
} from '../interactions/interaction.validator';

const router = Router();

// All session endpoints require authentication
router.use(authenticate);

// GET /api/sessions/:sessionId
router.get('/:sessionId', validate(sessionIdParamSchema), sessionController.getSessionById);

// PATCH /api/sessions/:sessionId/end
router.patch('/:sessionId/end', validate(sessionIdParamSchema), sessionController.endSession);

// POST /api/sessions/:sessionId/interactions
router.post(
  '/:sessionId/interactions',
  validate(createInteractionSchema),
  interactionController.createInteraction
);

// GET /api/sessions/:sessionId/interactions
router.get(
  '/:sessionId/interactions',
  validate(getInteractionsSchema),
  interactionController.getSessionInteractions
);

export default router;
