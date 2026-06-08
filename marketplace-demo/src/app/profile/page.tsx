import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/auth'

export default async function ProfilePage() {
  const user = await getSessionUser()
  if (!user) redirect('/auth/signin')

  if (user.role === 'VENDOR') redirect('/dashboard/profile')
  if (user.role === 'ADMIN') redirect('/admin')

  redirect('/orders')
}
