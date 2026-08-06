'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth'
import { Eye, EyeOff, Lock, User } from 'lucide-react'
import { getAdminPath } from '@/lib/admin-path'

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(username, password)
    setLoading(false)
    if (result.error) {
      setError(result.error)
    } else {
      router.push(getAdminPath())
    }
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Lock size={24} className="text-primary" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Gramamstays Admin</h1>
            <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Username</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" required value={username} onChange={e => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Enter username" autoFocus />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Enter password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-xs text-red-600 font-medium">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
