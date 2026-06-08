export type DemoEmail = 'admin@likha.ph' | 'maria@likha.ph' | 'isabel@test.ph' | null

export interface DemoUserInfo {
  email: DemoEmail
  label: string
  name: string
  role: string
  avatarUrl: string | null
}

export const DEMO_USERS: DemoUserInfo[] = [
  { email: null, label: 'Not logged in', name: '', role: '', avatarUrl: null },
  { email: 'admin@likha.ph', label: 'Admin', name: 'Admin', role: 'ADMIN', avatarUrl: null },
  { email: 'maria@likha.ph', label: 'Maria (Vendor)', name: 'Maria Santos', role: 'VENDOR', avatarUrl: '/avatars/maria-santos.jpg' },
  { email: 'isabel@test.ph', label: 'Isabel (Buyer)', name: 'Isabel Reyes', role: 'BUYER', avatarUrl: null },
]

export function findDemoUser(email: DemoEmail): DemoUserInfo | undefined {
  return DEMO_USERS.find((u) => u.email === email)
}
