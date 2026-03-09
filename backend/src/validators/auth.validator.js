import { z } from 'zod';

const registerSchema = z.object({
  name: z.string({ error: 'Name is required' })
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(50, { message: 'Name must be under 50 characters' })
    .trim(),

  email: z.string({ error: 'Email is required' })
    .email({ message: 'Please provide a valid email' })
    .trim()
    .toLowerCase(),

  password: z.string({ error: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(100, { message: 'Password must be under 100 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' }),
});

const loginSchema = z.object({
  email: z.string({ error: 'Email is required' })
    .email({ message: 'Please provide a valid email' })
    .trim()
    .toLowerCase(),

  password: z.string({ error: 'Password is required' }),
});

export { registerSchema, loginSchema };