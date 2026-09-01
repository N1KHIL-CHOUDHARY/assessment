import { z } from 'zod';

export const startSessionSchema = z.object({
  params: z.object({
    topicId: z
      .string({ required_error: 'Topic ID is required' })
      .regex(/^\d+$/, 'Topic ID must be a valid positive integer')
      .transform((val) => parseInt(val, 10)),
  }),
});

export const sessionIdParamSchema = z.object({
  params: z.object({
    sessionId: z
      .string({ required_error: 'Session ID is required' })
      .regex(/^\d+$/, 'Session ID must be a valid positive integer')
      .transform((val) => parseInt(val, 10)),
  }),
});
