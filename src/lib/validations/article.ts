import { z } from 'zod'

function isBlockJson(val: string) {
  return val.trim().startsWith('[')
}

const mediaFormatEnum = z.enum(['DRAWING', 'WRITING', 'VIDEO', 'AUDIO'])

export const articleSchema = z.object({
  title: z.string().min(3, 'Title needs at least 3 characters').max(100),
  format: mediaFormatEnum.optional().default('WRITING'),
  content: z.string().optional().default(''),
  imageUrl: z.string().optional().nullable(),
  aiFreeDeclaration: z.boolean().optional().default(false),
  excerpt: z.string().max(200).optional().or(z.literal('')),
  categoryId: z.string().min(1, 'Select a category'),
  tagIds: z.array(z.string()).max(5).optional(),
}).refine((data) => {
  if (data.format === 'WRITING') {
    const content = data.content || ''
    if (isBlockJson(content)) {
      try {
        const parsed = JSON.parse(content)
        return Array.isArray(parsed) && parsed.length >= 1
      } catch {
        return false
      }
    }
    return content.length >= 20
  }
  return true
}, { message: 'Writing content needs at least 20 characters', path: ['content'] })

export const articleFormSchema = z.object({
  title: z.string().min(3, 'Title needs at least 3 characters').max(100),
  content: z.string().optional().default(''),
  excerpt: z.string().max(200).optional().or(z.literal('')),
  categoryId: z.string().min(1, 'Select a category'),
})

export type ArticleFormData = z.infer<typeof articleFormSchema>

export const transitionSchema = z.object({
  action: z.enum(['submit', 'approve', 'reject', 'archive', 'restore']),
})
