import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2, 'Name needs at least 2 characters').max(50),
  email: z.string().email('Enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password needs at least 8 characters')
    .regex(/[0-9]/, 'Password must include at least one number'),
})

export type RegisterFormData = z.infer<typeof registerSchema>
