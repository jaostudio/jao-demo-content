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

function setDemoCookie(role: DemoRole) {
  document.cookie = `likha-demo-role=${role};path=/;max-age=86400;SameSite=Lax`
}

function clearDemoCookie() {
  document.cookie = 'likha-demo-role=;path=/;max-age=0'
}

export const useDemoRoleStore = create<DemoRoleState>()(
  persist(
    (set, get) => ({
      enabled: false,
      role: 'READER',
      enableDemoMode: () => {
        set({ enabled: true })
        setDemoCookie(get().role)
      },
      disableDemoMode: () => {
        set({ enabled: false, role: 'READER' })
        clearDemoCookie()
      },
      setRole: (role) => {
        set({ role })
        if (get().enabled) setDemoCookie(role)
      },
    }),
    {
      name: 'likha-demo-role',
      onRehydrateStorage: () => (state) => {
        if (state?.enabled) {
          setDemoCookie(state.role)
        }
      },
    },
  ),
)
