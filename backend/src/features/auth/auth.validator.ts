import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    username: z
      .string({ required_error: 'Username is required' })
      .trim()
      .min(3, 'Username must be at least 3 characters long')
      .max(50, 'Username cannot exceed 50 characters')
      .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .toLowerCase()
      .email('Invalid email address'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters long')
      .max(100, 'Password cannot exceed 100 characters'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    identifier: z
      .string()
      .trim()
      .optional(),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email('Invalid email address')
      .optional(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(1, 'Password is required'),
  }).refine((data) => data.email || data.identifier, {
    message: 'Either email or identifier (username/email) is required',
    path: ['email'],
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
