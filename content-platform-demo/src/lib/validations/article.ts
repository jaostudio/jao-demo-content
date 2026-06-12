import { z } from 'zod'

function isBlockJson(val: string) {
  return val.trim().startsWith('[')
}

export const articleSchema = z.object({
  title: z.string().min(3, 'Title needs at least 3 characters').max(100),
  content: z.string().refine((val) => {
    if (isBlockJson(val)) {
      try {
        const parsed = JSON.parse(val)
        return Array.isArray(parsed) && parsed.length >= 1
      } catch {
        return false
      }
    }
    return val.length >= 20
  }, 'Content needs at least 20 characters or one block').max(100000, 'Content too long'),
  excerpt: z.string().max(200).optional().or(z.literal('')),
  categoryId: z.string().min(1, 'Select a category'),
  tagIds: z.array(z.string()).max(5).optional(),
})

export const articleFormSchema = z.object({
  title: z.string().min(3, 'Title needs at least 3 characters').max(100),
  content: z.string().min(20, 'Content needs at least 20 characters'),
  excerpt: z.string().max(200).optional().or(z.literal('')),
  categoryId: z.string().min(1, 'Select a category'),
})

export type ArticleFormData = z.infer<typeof articleFormSchema>

export const transitionSchema = z.object({
  action: z.enum(['submit', 'approve', 'reject', 'archive', 'restore']),
})
