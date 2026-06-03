import { z } from 'zod'

const budgetRanges = ['< $1,000', '$1,000 – $3,000', '$3,000 – $5,000', '$5,000 – $10,000', '$10,000+'] as const
const timelines = ['1–2 weeks', '2–4 weeks', '1–2 months', 'Flexible'] as const
const priorities = ['Speed', 'Design / UX', 'Conversions', 'SEO / Visibility'] as const
const sources = ['Google / Search', 'LinkedIn', 'GitHub', 'Twitter / X', 'Portfolio Review', 'Referral', 'Other'] as const

function isOneOf(options: readonly string[]) {
  return (v: string) => options.includes(v)
}

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  email: z.string().trim().email('Enter a valid email address').max(320),
  business: z.string().trim().max(200).optional().default(''),
  website: z.string().trim().max(2000).optional().default(''),
  project_type: z.string().trim().min(1, 'Select a project type'),
  project_type_other: z.string().trim().max(200).optional().default(''),
  budget: z.string().refine(isOneOf(budgetRanges), 'Select a budget range'),
  timeline: z.string().refine(isOneOf(timelines), 'Select a timeline'),
  priority: z.string().refine(isOneOf(priorities), 'Select a priority'),
  source: z.string().refine(isOneOf(sources), 'Select how you heard about us'),
  business_goal: z.string().trim().max(5000).optional().default(''),
  message: z.string().trim().max(5000).optional().default(''),
  source_override: z.string().trim().max(200).optional().default(''),
})

export const auditSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  email: z.string().trim().email('Enter a valid email address').max(320),
  website: z.string().trim().min(1, 'Website URL is required').max(2000),
  message: z.string().trim().max(5000).optional().default(''),
})

export type ContactSubmission = z.infer<typeof contactSchema>
export type AuditSubmission = z.infer<typeof auditSchema>

export function calculateLeadScore(data: ContactSubmission): number {
  let score = 0

  if (data.budget === '$5,000 – $10,000') score += 3
  if (data.budget === '$10,000+') score += 5
  if (data.budget === '$3,000 – $5,000') score += 2

  if (data.timeline === 'Flexible') score += 3
  if (data.timeline === '1–2 months') score += 1

  if (data.project_type && data.project_type !== 'other') score += 2

  if (data.source === 'Referral') score += 3
  if (data.source === 'LinkedIn') score += 1
  if (data.source === 'GitHub') score += 1

  if (data.business_goal && data.business_goal.length > 20) score += 2

  return score
}
