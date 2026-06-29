import type { Metadata } from 'next'
import { SignInPage as NewSignInPage } from '@/components/new/pages/auth/signin'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to Likha — your creative workspace for process-first art.',
}

export default function SignInPage() {
  return <NewSignInPage />
}
