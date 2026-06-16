import { useAuth } from '@/hooks/useAuth'
import { useDemoRoleStore } from '@/store/demo-role-store'

export function useEffectiveRole() {
  const { user } = useAuth()
  const { enabled, role: demoRole } = useDemoRoleStore()

  if (user) {
    return { role: user.role ?? 'READER', isDemoMode: false }
  }

  if (enabled) {
    return { role: demoRole, isDemoMode: true }
  }

  return { role: 'READER' as const, isDemoMode: false }
}
