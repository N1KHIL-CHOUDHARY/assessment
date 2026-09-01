import { z } from 'zod';

export const createTopicSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: 'Topic title is required' })
      .trim()
      .min(2, 'Topic title must be at least 2 characters')
      .max(150, 'Topic title cannot exceed 150 characters'),
  }),
});

export const topicIdParamSchema = z.object({
  params: z.object({
    topicId: z
      .string({ required_error: 'Topic ID is required' })
      .regex(/^\d+$/, 'Topic ID must be a valid positive integer')
      .transform((val) => parseInt(val, 10)),
  }),
});

export type CreateTopicInput = z.infer<typeof createTopicSchema>['body'];
