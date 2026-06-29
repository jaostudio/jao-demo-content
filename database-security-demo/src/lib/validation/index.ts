import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email').max(255),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
})

export const documentCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  body: z.string().min(1, 'Body is required').max(10000),
})

export const securityLabSimulationSchema = z.object({
  type: z.enum([
    'cross-tenant',
    'admin-action',
    'org-id-injection',
    'audit-tamper',
    'escalated-edit',
  ]),
})

export const adminCreateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email').max(255),
  role: z.enum(['ORG_USER', 'ORG_ADMIN', 'SYSTEM_ADMIN']),
  orgId: z.string().nullable().optional(),
})

export const adminCreateOrgSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
})

export const settingsUpdateSchema = z.object({
  passwordMinLength: z.number().int().min(4).max(64).optional(),
  sessionTimeoutMinutes: z.number().int().min(5).max(480).optional(),
  mfaRequired: z.boolean().optional(),
  maxLoginAttempts: z.number().int().min(1).max(20).optional(),
})
