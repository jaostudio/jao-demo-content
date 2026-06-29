import { RegistrationForm } from './registration-form'
import { ShieldX } from 'lucide-react'
import Link from 'next/link'

export default function RegisterPage() {
  const enabled = process.env.DEMO_REGISTRATION_ENABLED === 'true'

  if (!enabled) {
    return (
      <main className="grid-bg min-h-screen flex items-center justify-center px-4">
        <div className="glass-card-static p-8 w-full max-w-sm text-center">
          <ShieldX className="w-10 h-10 text-isla-muted mx-auto mb-4" />
          <h1 className="text-xl font-bold text-isla-white mb-2">Registration Disabled</h1>
          <p className="text-sm text-isla-muted mb-6">
            New account registration is currently disabled on this deployment.
          </p>
          <Link
            href="/demo"
            className="inline-block rounded-lg bg-isla-amethyst px-6 py-2.5 text-sm font-medium text-white hover:bg-isla-amethyst/90 transition-colors"
          >
            View Demo Accounts
          </Link>
          <p className="mt-4 text-xs text-isla-muted">
            Already have an account?{' '}
            <Link href="/signin" className="text-isla-pacific underline hover:no-underline">Sign In</Link>
          </p>
        </div>
      </main>
    )
  }

  return <RegistrationForm />
}
