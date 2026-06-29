import type { Metadata } from 'next'
import { RegisterPage as NewRegisterPage } from '@/components/new/pages/auth/register'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Join',
  description: 'Create an account on Likha and start sharing your creative process.',
}

export default function RegisterPage() {
  return <NewRegisterPage />
}
