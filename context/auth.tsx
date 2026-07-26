'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { UserRole } from '@/lib/auth'

interface User {
  id: string
  username: string
  email: string
  phone: string
  role: UserRole
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<{ error?: string }>
  logout: () => Promise<void>
  isSuperAdmin: boolean
  canAccess: (section: string) => boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

const ROLE_SECTIONS: Record<UserRole, string[]> = {
  super_admin: ['dashboard', 'bookings', 'properties', 'guests', 'financials', 'staff', 'register', 'logs'],
  admin: ['dashboard', 'bookings', 'properties', 'guests', 'financials', 'staff', 'logs'],
  staff: ['dashboard', 'bookings', 'guests', 'logs'],
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (!res.ok) return { error: data.error || 'Login failed' }
      setUser(data)
      return {}
    } catch {
      return { error: 'Network error' }
    }
  }, [])

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
  }, [])

  const isSuperAdmin = user?.role === 'super_admin'
  const canAccess = useCallback((section: string) => {
    if (!user) return false
    return ROLE_SECTIONS[user.role]?.includes(section) ?? false
  }, [user])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isSuperAdmin, canAccess }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
