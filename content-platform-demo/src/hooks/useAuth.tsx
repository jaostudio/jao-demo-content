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
  token: string | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ user?: AuthUser; error?: string }>
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  loading: true,
  signIn: async () => ({}),
  signOut: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('likha-token')
    if (!stored) {
      setLoading(false)
      return
    }
    setToken(stored)

    apiClient.withToken(stored).getMe()
      .then((u) => setUser(u))
      .catch(() => {
        localStorage.removeItem('likha-token')
        setToken(null)
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const res = await apiClient.login({ email, password })
      localStorage.setItem('likha-token', res.token)
      setToken(res.token)
      setUser(res.user)
      return { user: res.user }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Login failed' }
    }
  }, [])

  const signOut = useCallback(() => {
    localStorage.removeItem('likha-token')
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
