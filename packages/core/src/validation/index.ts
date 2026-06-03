import { z } from 'zod'

export const emailSchema = z.string().email('Invalid email address').max(255)

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be at most 128 characters')

export const slugSchema = z
  .string()
  .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
  .min(1)
  .max(200)

export const urlSchema = z.string().url('Invalid URL').max(2048)

export const idSchema = z.string().min(1, 'ID is required')

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export const searchSchema = z.object({
  q: z.string().max(200).default(''),
  sort: z.enum(['asc', 'desc']).default('desc'),
  sortBy: z.string().max(50).default('createdAt'),
})

export function validate<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean
  data?: T
  error?: string
} {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  const firstError = result.error.errors[0]
  return { success: false, error: firstError?.message ?? 'Validation failed' }
}
