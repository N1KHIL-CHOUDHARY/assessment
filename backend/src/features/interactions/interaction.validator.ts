import { z } from 'zod';
import { InteractionMode, Feedback } from '../../types/domain.types';

export const createInteractionSchema = z.object({
  params: z.object({
    sessionId: z
      .string({ required_error: 'Session ID is required' })
      .regex(/^\d+$/, 'Session ID must be a valid positive integer')
      .transform((val) => parseInt(val, 10)),
  }),
  body: z.object({
    mode: z.nativeEnum(InteractionMode, {
      errorMap: () => ({
        message: `Invalid interaction mode. Must be one of: ${Object.values(InteractionMode).join(', ')}`,
      }),
    }),
    question: z
      .string({ required_error: 'Question is required' })
      .trim()
      .min(3, 'Question must be at least 3 characters long')
      .max(2000, 'Question cannot exceed 2000 characters'),
  }),
});

export const getInteractionsSchema = z.object({
  params: z.object({
    sessionId: z
      .string({ required_error: 'Session ID is required' })
      .regex(/^\d+$/, 'Session ID must be a valid positive integer')
      .transform((val) => parseInt(val, 10)),
  }),
  query: z.object({
    page: z
      .string()
      .regex(/^\d+$/)
      .transform((v) => Math.max(1, parseInt(v, 10)))
      .optional(),
    limit: z
      .string()
      .regex(/^\d+$/)
      .transform((v) => Math.min(100, Math.max(1, parseInt(v, 10))))
      .optional(),
    order: z
      .enum(['asc', 'desc'])
      .optional()
      .default('asc'),
  }),
});

export const feedbackSchema = z.object({
  params: z.object({
    interactionId: z
      .string({ required_error: 'Interaction ID is required' })
      .regex(/^\d+$/, 'Interaction ID must be a valid positive integer')
      .transform((val) => parseInt(val, 10)),
  }),
  body: z.object({
    feedback: z.nativeEnum(Feedback, {
      errorMap: () => ({
        message: `Invalid feedback value. Must be one of: ${Object.values(Feedback).join(', ')}`,
      }),
    }),
  }),
});

export interface CreateInteractionInput {
  mode: InteractionMode;
  question: string;
}

export interface FeedbackInput {
  feedback: Feedback;
}
