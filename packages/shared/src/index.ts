import { z } from 'zod';

export const EmailSchema = z
  .string()
  .min(1, { message: 'Email address coordinates are required.' })
  .email({ message: 'Invalid email address coordinates format.' });

export const PasswordSchema = z
  .string()
  .min(8, { message: 'Password key must be at least 8 characters long.' })
  .regex(/[A-Z]/, { message: 'Password key must contain at least one uppercase letter.' })
  .regex(/[a-z]/, { message: 'Password key must contain at least one lowercase letter.' })
  .regex(/[0-9]/, { message: 'Password key must contain at least one numeric digit.' })
  .regex(/[^A-Za-z0-9]/, { message: 'Password key must contain at least one special character.' });

export const PhoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone coordinates format. Use E.164 (+[country][number]).' });

export * from './env';
