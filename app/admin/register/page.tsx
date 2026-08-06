'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth'
import { UserPlus, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { getAdminPath } from '@/lib/admin-path'

export default function RegisterPage() {
  const { user, isSuperAdmin, loading: authLoading } = useAuth()
  const router = useRouter()
  const [form, setForm] = useState({ username: '', email: '', phone: '', password: '', role: 'staff' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<Array<{ id: string; username: string; email: string; phone: string; role: string; createdAt: string }>>([])

  useEffect(() => {
    if (!authLoading && !isSuperAdmin) router.push(getAdminPath())
  }, [authLoading, isSuperAdmin, router])

  useEffect(() => {
    if (isSuperAdmin) {
      fetch('/api/auth/users').then(r => r.ok ? r.json() : []).then(setUsers).catch(() => {})
    }
  }, [isSuperAdmin])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Registration failed')
      } else {
        setSuccess(`User "${data.username}" created as ${data.role}`)
        setUsers(prev => [{ id: data.id, username: data.username, email: data.email, phone: data.phone, role: data.role, createdAt: data.createdAt }, ...prev])
        setForm({ username: '', email: '', phone: '', password: '', role: 'staff' })
      }
    } catch {
      setError('Network error')
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user?')) return
    try {
      const res = await fetch(`/api/auth/users/${id}`, { method: 'DELETE' })
      if (res.ok) setUsers(prev => prev.filter(u => u.id !== id))
    } catch {}
  }

  if (authLoading || !isSuperAdmin) return null

  const roleColors: Record<string, string> = {
    super_admin: 'bg-purple-50 text-purple-700',
    admin: 'bg-blue-50 text-blue-700',
    staff: 'bg-gray-100 text-gray-600',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href={getAdminPath()} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h2 className="text-lg font-bold text-gray-900">User Management</h2>
          <p className="text-xs text-gray-500 mt-0.5">Register and manage admin users</p>
        </div>
      </div>

      {/* Register Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-5">
          <UserPlus size={16} className="text-primary" />
          <h3 className="font-bold text-gray-900 text-sm">Register New User</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Username *</label>
              <input type="text" required value={form.username} onChange={e => setForm({ ...form, username: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="e.g. john_doe" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Email *</label>
              <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="john@email.com" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Phone *</label>
              <input type="tel" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="+91 99999 99999" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Role</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-all appearance-none">
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Password *</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 pr-11 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="Min 6 characters" minLength={6} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200"><p className="text-xs text-red-600 font-medium">{error}</p></div>}
          {success && <div className="px-4 py-3 rounded-lg bg-emerald-50 border border-emerald-200"><p className="text-xs text-emerald-600 font-medium">{success}</p></div>}

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 min-h-[44px]">
            {loading ? 'Creating...' : 'Register User'}
          </button>
        </form>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-sm">Registered Users ({users.length})</h3>
        </div>
        {users.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">No users found</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {users.map(u => (
              <div key={u.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{u.username}</p>
                  <p className="text-[11px] text-gray-400">{u.email} · {u.phone}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 text-[10px] font-semibold rounded-lg ${roleColors[u.role] || 'bg-gray-100 text-gray-600'}`}>
                    {u.role.replace('_', ' ')}
                  </span>
                  {u.role !== 'super_admin' && (
                    <button onClick={() => handleDelete(u.id)}
                      className="px-3 py-1.5 text-[11px] font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
