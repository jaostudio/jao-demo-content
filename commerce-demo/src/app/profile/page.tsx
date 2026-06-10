import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ProfileForm } from './profile-form'
import { getLang } from '@/lib/lang'

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/signin')
  const lang = await getLang()

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })
  if (!user) redirect('/signin')
  if (user.deletedAt) redirect('/signin')

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-[var(--font-display)] text-3xl font-bold">{lang === 'tl' ? 'Profile' : 'Profile'}</h1>
      <p className="mt-2 text-sm text-muted">{lang === 'tl' ? 'Pamahalaan ang iyong account.' : 'Manage your account.'}</p>
      <ProfileForm user={user} lang={lang} />
    </div>
  )
}
