import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { AddressForm } from './address-form'
import { getLang } from '@/lib/lang'
import Link from 'next/link'

export default async function AddressesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/signin')
  const lang = await getLang()

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { addresses: { orderBy: { isDefault: 'desc' } } },
  })
  if (!user) redirect('/signin')

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Link href="/profile" className="text-sm text-flag-blue hover:underline">
        &larr; {lang === 'tl' ? 'Bumalik sa Profile' : 'Back to Profile'}
      </Link>
      <h1 className="mt-4 font-[var(--font-display)] text-3xl font-bold">
        {lang === 'tl' ? 'Mga Address' : 'Address Book'}
      </h1>
      <p className="mt-2 text-sm text-muted">
        {lang === 'tl' ? 'I-manage ang iyong mga address para sa delivery.' : 'Manage your delivery addresses.'}
      </p>
      <AddressForm addresses={user.addresses} lang={lang} />
    </div>
  )
}
