import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getLang } from '@/lib/lang'
import Link from 'next/link'
import { SettingsForm } from './settings-form'

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/signin')
  const lang = await getLang()

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Link href="/profile" className="text-sm text-flag-blue hover:underline">
        &larr; {lang === 'tl' ? 'Bumalik sa Profile' : 'Back to Profile'}
      </Link>
      <h1 className="mt-4 font-[var(--font-display)] text-3xl font-bold">
        {lang === 'tl' ? 'Settings' : 'Settings'}
      </h1>
      <p className="mt-2 text-sm text-muted">
        {lang === 'tl' ? 'Baguhin ang password at pamahalaan ang account.' : 'Change password and manage your account.'}
      </p>
      <SettingsForm lang={lang} />
    </div>
  )
}
