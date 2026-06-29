import { AlertTriangle } from 'lucide-react'

export const metadata = {
  title: 'Privacy',
  description: 'Privacy information for Likha.',
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">Demo Platform Notice</p>
            <p className="mt-1">Likha is a fictional demo platform. This privacy policy is placeholder product copy and not legal advice.</p>
          </div>
        </div>
      </div>

      <h1 className="text-xl font-semibold text-text-primary">Privacy</h1>
      <p className="mt-1 text-sm text-fog-gray">How your data is handled on Likha.</p>

      <div className="mt-8 space-y-6 text-sm text-text-secondary leading-relaxed">
        <section>
          <h2 className="font-semibold text-text-primary">What we collect</h2>
          <p className="mt-1">When you create an account, we collect your name, email address, and profile information. When you publish work, we store your content, process documentation, and media uploads. We collect basic interaction data such as follows, likes, and comments.</p>
        </section>

        <section>
          <h2 className="font-semibold text-text-primary">How we use it</h2>
          <p className="mt-1">Your data powers your profile, your work, and your interactions on the platform. We use email for account verification and notifications you opt into. We do not sell your data or share it with third parties for advertising.</p>
        </section>

        <section>
          <h2 className="font-semibold text-text-primary">Cookies</h2>
          <p className="mt-1">We use a session cookie to keep you signed in. No tracking cookies, no analytics scripts from third parties.</p>
        </section>

        <section>
          <h2 className="font-semibold text-text-primary">Your control</h2>
          <p className="mt-1">You can edit or delete your profile at any time. Works can be archived or removed. Contact us to request full account deletion.</p>
        </section>

        <p className="pt-4 text-xs text-fog-gray">Last updated: June 2026.</p>
      </div>
    </div>
  )
}
