'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { apiClient } from '@/lib/utils/api-client'

interface AuthUser {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signIn: async () => ({}),
  signOut: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('likha-token')
    if (!token) {
      setLoading(false)
      return
    }

    apiClient.withToken(token).getMe()
      .then((u) => setUser(u))
      .catch(() => {
        localStorage.removeItem('likha-token')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const res = await apiClient.login({ email, password })
      localStorage.setItem('likha-token', res.token)
      setUser(res.user)
      return {}
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Login failed' }
    }
  }, [])

  const signOut = useCallback(() => {
    localStorage.removeItem('likha-token')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
