import { z } from 'zod';

export const emailSchema = z.string().email('Invalid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter')
  .regex(/[a-z]/, 'Password must contain a lowercase letter')
  .regex(/[0-9]/, 'Password must contain a number');

export const nameSchema = z.string().min(1, 'Name is required').max(100);

export const bloodTypeSchema = z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']);

export const phoneSchema = z.string().regex(/^\+?[\d\s\-()]{7,20}$/, 'Invalid phone number');

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  role: z.enum(['patient', 'responder']).optional(),
});

export const identitySchema = z.object({
  bloodType: bloodTypeSchema.optional(),
  allergies: z.array(z.string()).optional(),
  medications: z.array(z.string()).optional(),
  conditions: z.array(z.string()).optional(),
  emergencyContacts: z
    .array(
      z.object({
        name: z.string().min(1),
        relationship: z.string().min(1),
        phone: phoneSchema,
        email: emailSchema.optional(),
      }),
    )
    .optional(),
  permissions: z.array(z.string()).optional(),
});

export const eventSchema = z.object({
  type: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  severity: z.enum(['info', 'warning', 'critical']).optional(),
  timestamp: z.string().datetime().optional(),
});

export const twinCreateSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  age: z.number().int().min(0).max(150).optional(),
  sex: z.enum(['male', 'female', 'other']).optional(),
  heightCm: z.number().min(50).max(300).optional(),
  weightKg: z.number().min(1).max(500).optional(),
});