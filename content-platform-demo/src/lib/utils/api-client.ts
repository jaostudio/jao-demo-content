import { ApiClient } from '@content-platform/shared'

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('likha-token')
}

export const apiClient = new ApiClient('', getToken())

export function createServerClient(token?: string | null) {
  return new ApiClient('', token ?? null)
}
