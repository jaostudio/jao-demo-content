import { NEW_LAYOUT_ENABLED } from '@/lib/new/flags'
import SignInForm from './signin-form'
import { SignInPage as NewSignInPage } from '@/components/new/pages/auth/signin'

export const dynamic = 'force-dynamic'

export default function SignInPage() {
  if (NEW_LAYOUT_ENABLED) {
    return <NewSignInPage />
  }
  return <SignInForm />
}
