'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Filter, ChevronLeft, ChevronRight, Activity, LogIn, LogOut, UserPlus, UserMinus, CalendarCheck, CalendarX, BedDouble, Users, DollarSign, Receipt, ArrowDownCircle, ArrowUpCircle, RefreshCw } from 'lucide-react'

interface AuditLog {
  id: string
  userId: string
  username: string
  action: string
  entity: string
  entityId: string | null
  details: string | null
  createdAt: string
}

const actionLabels: Record<string, string> = {
  login: 'Logged in',
  logout: 'Logged out',
  'user.created': 'Created user',
  'user.deleted': 'Deleted user',
  'booking.created': 'Created booking',
  'booking.updated': 'Updated booking',
  'booking.checked_in': 'Checked in guest',
  'booking.checked_out': 'Checked out guest',
  'guest.created': 'Added guest',
  'guest.updated': 'Updated guest',
  'room.status_changed': 'Changed room status',
  'income.added': 'Added income',
  'expense.added': 'Added expense',
}

const actionIcons: Record<string, typeof Activity> = {
  login: LogIn,
  logout: LogOut,
  'user.created': UserPlus,
  'user.deleted': UserMinus,
  'booking.created': CalendarCheck,
  'booking.updated': CalendarCheck,
  'booking.checked_in': BedDouble,
  'booking.checked_out': BedDouble,
  'guest.created': Users,
  'guest.updated': Users,
  'room.status_changed': BedDouble,
  'income.added': ArrowDownCircle,
  'expense.added': ArrowUpCircle,
}

const actionColors: Record<string, string> = {
  login: 'bg-emerald-50 text-emerald-600',
  logout: 'bg-gray-100 text-gray-500',
  'user.created': 'bg-purple-50 text-purple-600',
  'user.deleted': 'bg-red-50 text-red-600',
  'booking.created': 'bg-blue-50 text-blue-600',
  'booking.updated': 'bg-amber-50 text-amber-600',
  'booking.checked_in': 'bg-emerald-50 text-emerald-600',
  'booking.checked_out': 'bg-gray-100 text-gray-600',
  'guest.created': 'bg-indigo-50 text-indigo-600',
  'guest.updated': 'bg-amber-50 text-amber-600',
  'room.status_changed': 'bg-orange-50 text-orange-600',
  'income.added': 'bg-emerald-50 text-emerald-600',
  'expense.added': 'bg-red-50 text-red-600',
}

const entityFilters = [
  { value: '', label: 'All' },
  { value: 'auth', label: 'Auth' },
  { value: 'booking', label: 'Bookings' },
  { value: 'guest', label: 'Guests' },
  { value: 'room', label: 'Rooms' },
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expenses' },
  { value: 'user', label: 'Users' },
]

function formatTime(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDay = Math.floor(diffHr / 24)
  if (diffDay < 7) return `${diffDay}d ago`
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

function formatFullTime(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function AdminActivityLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [entityFilter, setEntityFilter] = useState('')
  const [searchUser, setSearchUser] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const limit = 30

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (entityFilter) params.set('entity', entityFilter)
    if (searchUser) params.set('user', searchUser)
    try {
      const res = await fetch(`/api/audit-logs?${params}`)
      const data = await res.json()
      setLogs(data.logs || [])
      setTotal(data.total || 0)
    } catch {
      setLogs([])
    }
    setLoading(false)
  }, [page, entityFilter, searchUser])

  useEffect(() => { fetchLogs() }, [fetchLogs])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Activity Logs</h2>
          <p className="text-xs text-gray-500 mt-0.5">{total} total actions recorded</p>
        </div>
        <button onClick={fetchLogs} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all min-h-[38px]">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-2.5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={searchUser} onChange={e => { setSearchUser(e.target.value); setPage(1) }}
              placeholder="Filter by user..."
              className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[36px]" />
          </div>
          <div className="flex gap-1 overflow-x-auto">
            {entityFilters.map(f => (
              <button key={f.value} onClick={() => { setEntityFilter(f.value); setPage(1) }}
                className={`px-3 py-2 rounded-md text-xs font-semibold whitespace-nowrap border transition-all min-h-[36px] ${
                  entityFilter === f.value
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Log List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
            <p className="text-xs text-gray-500 mt-3">Loading logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-10 text-center">
            <Activity size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-900">No activity yet</p>
            <p className="text-xs text-gray-500 mt-1">Actions will appear here as users interact with the system</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {logs.map(log => {
              const Icon = actionIcons[log.action] || Activity
              const colorClass = actionColors[log.action] || 'bg-gray-100 text-gray-500'
              const isExpanded = expandedId === log.id
              let details: Record<string, unknown> | null = null
              try { details = log.details ? JSON.parse(log.details) : null } catch { /* ignore */ }

              return (
                <div key={log.id} className="px-4 py-3 hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : log.id)}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
                      <Icon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        <span className="font-semibold">{log.username}</span>
                        <span className="text-gray-500 mx-1">&middot;</span>
                        {actionLabels[log.action] || log.action}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5" title={formatFullTime(log.createdAt)}>
                        {formatTime(log.createdAt)}
                      </p>
                    </div>
                    {details && (
                      <span className="text-[10px] text-gray-400 shrink-0 hidden sm:block">
                        {Object.entries(details).map(([k, v]) => `${k}: ${v}`).join(', ')}
                      </span>
                    )}
                  </div>
                  {isExpanded && details && (
                    <div className="mt-2 ml-11 p-2.5 bg-gray-50 rounded-lg text-xs text-gray-600 space-y-1">
                      {Object.entries(details).map(([k, v]) => (
                        <div key={k} className="flex gap-2">
                          <span className="font-semibold text-gray-700 capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>
                          <span>{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed min-h-[36px]">
              <ChevronLeft size={14} />
            </button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed min-h-[36px]">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
