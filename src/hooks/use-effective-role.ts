import { useSession } from 'next-auth/react'
import { useDemoRoleStore } from '@/store/demo-role-store'

export function useEffectiveRole() {
  const { data: session } = useSession()
  const { enabled, role: demoRole } = useDemoRoleStore()

  if (session?.user) {
    return { role: (session.user as { role?: string }).role ?? 'READER', isDemoMode: false }
  }

  if (enabled) {
    return { role: demoRole, isDemoMode: true }
  }

  return { role: 'READER' as const, isDemoMode: false }
}
