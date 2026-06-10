import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type DemoRole = 'READER' | 'AUTHOR' | 'ADMIN'

interface DemoRoleState {
  enabled: boolean
  role: DemoRole
  enableDemoMode: () => void
  disableDemoMode: () => void
  setRole: (role: DemoRole) => void
}

export const useDemoRoleStore = create<DemoRoleState>()(
  persist(
    (set) => ({
      enabled: false,
      role: 'READER',
      enableDemoMode: () => set({ enabled: true }),
      disableDemoMode: () => set({ enabled: false, role: 'READER' }),
      setRole: (role) => set({ role }),
    }),
    { name: 'likha-demo-role' },
  ),
)
