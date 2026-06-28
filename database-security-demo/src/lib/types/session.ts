export type Role = 'SYSTEM_ADMIN' | 'ORG_ADMIN' | 'ORG_USER'

export type SessionUser = {
  id: string
  email: string
  name: string | null
  role: Role
  organizationId: string | null
  organizationName: string | null
}
