'use client'

import type { AdminSection } from '@/app/admin/page'
import { useAdminData } from '@/context/admin-data'
import { TrendingUp, TrendingDown, CalendarCheck, BedDouble, DollarSign, ArrowUpRight, Clock, CalendarClock, LogIn, LogOut, Users, Activity, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react'

function fmtDate(d: string) {
  if (!d) return ''
  const date = d.includes('T') ? new Date(d) : new Date(d + 'T00:00:00')
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

function relativeTime(time: string) {
  if (time === 'Just now') return 'Just now'
  const now = Date.now()
  const past = new Date(time).getTime()
  if (isNaN(past)) return time
  const diff = Math.floor((now - past) / 1000)
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

const statusColor: Record<string, string> = {
  'Checked In': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'Confirmed': 'bg-blue-50 text-blue-700 border border-blue-200',
  'Pending': 'bg-amber-50 text-amber-700 border border-amber-200',
  'Checked Out': 'bg-gray-100 text-gray-500 border border-gray-200',
}

const statusDot: Record<string, string> = {
  'Checked In': 'bg-emerald-500',
  'Confirmed': 'bg-blue-500',
  'Pending': 'bg-amber-500',
  'Checked Out': 'bg-gray-400',
}

const paymentColor: Record<string, string> = {
  'Fully Paid': 'text-emerald-600 bg-emerald-50',
  'Partial': 'text-blue-600 bg-blue-50',
  'Pending': 'text-amber-600 bg-amber-50',
}

const roomStatusConfig = [
  { status: 'Occupied', color: 'bg-blue-500', lightColor: 'bg-blue-100' },
  { status: 'Available', color: 'bg-emerald-500', lightColor: 'bg-emerald-100' },
  { status: 'Maintenance', color: 'bg-amber-500', lightColor: 'bg-amber-100' },
  { status: 'Reserved', color: 'bg-purple-500', lightColor: 'bg-purple-100' },
]

interface Props {
  onNavigate: (section: AdminSection) => void
  onOpenForm?: (form: 'booking' | 'income' | 'expense') => void
  onNavigateWithFilter?: (section: AdminSection, filter: string) => void
}

export function AdminDashboard({ onNavigate, onOpenForm, onNavigateWithFilter }: Props) {
  const { bookings, rooms, expenses, income, activities } = useAdminData()
  const now = new Date()
  const todayStr = now.toISOString().split('T')[0]
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const lastMonth = now.getMonth() === 0 ? `${now.getFullYear() - 1}-12` : `${now.getFullYear()}-${String(now.getMonth()).padStart(2, '0')}`

  const thisMonthIncome = income.filter(i => {
    const d = new Date(i.date + 'T00:00:00')
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` === thisMonth
  }).reduce((s, i) => s + i.amount, 0)

  const lastMonthIncome = income.filter(i => {
    const d = new Date(i.date + 'T00:00:00')
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` === lastMonth
  }).reduce((s, i) => s + i.amount, 0)

  const revenueChange = lastMonthIncome > 0 ? Math.round(((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100) : 0

  const totalRevenue = income.reduce((s, i) => s + i.amount, 0)
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0)
  const occupancyRate = rooms.length > 0 ? Math.round((rooms.filter(r => r.status === 'Occupied').length / rooms.length) * 100) : 0
  const activeBookings = bookings.filter(b => b.status !== 'Checked Out').length
  const pendingAmount = bookings.filter(b => b.payment !== 'Fully Paid' && b.status !== 'Checked Out').reduce((s, b) => s + (b.amount - b.paidAmount), 0)

  const todayCheckIns = bookings.filter(b => {
    const ci = b.checkIn?.split('T')[0] || b.checkIn
    return ci === todayStr && b.status !== 'Checked Out'
  })
  const todayCheckOuts = bookings.filter(b => {
    const co = b.checkOut?.split('T')[0] || b.checkOut
    return co === todayStr
  })
  const todayRevenue = income.filter(i => i.date === todayStr).reduce((s, i) => s + i.amount, 0)

  const upcomingBookings = bookings
    .filter(b => b.status !== 'Checked Out')
    .sort((a, b) => a.checkIn.localeCompare(b.checkIn))
    .slice(0, 10)

  const roomStatus = roomStatusConfig.map(config => ({
    ...config,
    count: rooms.filter(r => r.status === config.status).length,
  }))

  const stats = [
    { label: 'Revenue', value: `₹${totalRevenue.toLocaleString()}`, change: revenueChange !== 0 ? `${revenueChange > 0 ? '+' : ''}${revenueChange}%` : '', up: revenueChange >= 0, icon: DollarSign, bgColor: 'bg-emerald-100', textColor: 'text-emerald-600', section: 'financials' as AdminSection },
    { label: 'Occupancy', value: `${occupancyRate}%`, change: '', up: true, icon: BedDouble, bgColor: 'bg-blue-100', textColor: 'text-blue-600', section: 'properties' as AdminSection },
    { label: 'Active', value: String(activeBookings), change: '', up: true, icon: CalendarCheck, bgColor: 'bg-amber-100', textColor: 'text-amber-600', section: 'bookings' as AdminSection },
    { label: 'Pending', value: `₹${pendingAmount.toLocaleString()}`, change: '', up: false, icon: Clock, bgColor: 'bg-red-100', textColor: 'text-red-600', section: 'bookings' as AdminSection, filter: 'Pending' },
  ]

  const quickActions = [
    { label: 'New Booking', form: 'booking' as const, icon: CalendarCheck, color: 'bg-blue-500', textColor: 'text-white' },
    { label: 'Add Income', form: 'income' as const, icon: ArrowDownToLine, color: 'bg-emerald-500', textColor: 'text-white' },
    { label: 'Add Expense', form: 'expense' as const, icon: ArrowUpFromLine, color: 'bg-red-500', textColor: 'text-white' },
  ]

  return (
    <div className="space-y-4 sm:space-y-5 pb-20 lg:pb-5">
      {/* Quick Actions Toolbar - Mobile Only */}
      <div className="lg:hidden bg-white rounded-xl border border-gray-200 p-2.5">
        <div className="flex gap-2">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <button
                key={action.label}
                onClick={() => onOpenForm?.(action.form)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg ${action.color} ${action.textColor} text-[11px] font-semibold active:scale-95 transition-all`}
              >
                <Icon size={13} />
                {action.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Today's Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 hover:border-gray-300 transition-all active:scale-[0.98]">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
              <LogIn size={15} className="text-blue-600" />
            </div>
            <span className="text-[11px] text-gray-500 font-medium">Check-ins</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">{todayCheckIns.length}</p>
          {todayCheckIns.length > 0 && (
            <p className="text-[10px] text-gray-400 mt-1 truncate">{todayCheckIns[0].guest}{todayCheckIns.length > 1 ? ` +${todayCheckIns.length - 1}` : ''}</p>
          )}
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 hover:border-gray-300 transition-all active:scale-[0.98]">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
              <LogOut size={15} className="text-amber-600" />
            </div>
            <span className="text-[11px] text-gray-500 font-medium">Check-outs</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">{todayCheckOuts.length}</p>
          {todayCheckOuts.length > 0 && (
            <p className="text-[10px] text-gray-400 mt-1 truncate">{todayCheckOuts[0].guest}{todayCheckOuts.length > 1 ? ` +${todayCheckOuts.length - 1}` : ''}</p>
          )}
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 col-span-2 sm:col-span-1 hover:border-gray-300 transition-all active:scale-[0.98]">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
              <DollarSign size={15} className="text-emerald-600" />
            </div>
            <span className="text-[11px] text-gray-500 font-medium">Today&apos;s Revenue</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-600">₹{todayRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <button key={stat.label} onClick={() => stat.filter ? onNavigateWithFilter?.(stat.section, stat.filter) : onNavigate(stat.section)} className="text-left w-full bg-white rounded-xl border border-gray-200 p-3 sm:p-4 hover:border-gray-300 hover:shadow-sm transition-all active:scale-[0.98] cursor-pointer group">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className={`w-9 h-9 ${stat.bgColor} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                  <Icon size={15} className={stat.textColor} />
                </div>
                {stat.change && (
                  <div className={`flex items-center gap-0.5 text-[10px] font-semibold ${stat.up ? 'text-emerald-600' : 'text-red-500'}`}>
                    {stat.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    <span>{stat.change}</span>
                  </div>
                )}
              </div>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">{stat.value}</p>
              <p className="text-[10px] sm:text-[11px] text-gray-500 mt-0.5">{stat.label}</p>
            </button>
          )
        })}
      </div>

      {/* Upcoming Bookings */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <CalendarClock size={14} className="text-primary" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">Upcoming Bookings</h3>
          </div>
          <button onClick={() => onNavigate('bookings')} className="text-xs text-primary font-semibold hover:underline">
            View All
          </button>
        </div>

        {upcomingBookings.length === 0 ? (
          <div className="p-10 sm:p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <CalendarClock size={22} className="text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">No upcoming bookings</p>
            <p className="text-xs text-gray-500">All caught up!</p>
          </div>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-gray-50">
              {upcomingBookings.map((b) => (
                <div key={b.id} className="px-4 py-3.5 hover:bg-gray-50/50 transition-colors active:bg-gray-100/50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900">{b.guest}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{b.room} #{b.roomNo}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded-lg ${statusColor[b.status]} shrink-0 ml-2`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot[b.status]}`} />
                      {b.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <p className="text-[11px] text-gray-500">{fmtDate(b.checkIn)}</p>
                      <span className="text-gray-300">·</span>
                      <p className="text-[11px] text-gray-500">{b.nights}n</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${paymentColor[b.payment]}`}>{b.payment}</span>
                      <span className="text-sm font-bold text-gray-900">₹{b.amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/80">
                    <th className="px-5 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Guest</th>
                    <th className="px-5 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Room</th>
                    <th className="px-5 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Check-in</th>
                    <th className="px-5 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Nights</th>
                    <th className="px-5 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                    <th className="px-5 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {upcomingBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-semibold text-gray-900">{b.guest}</p>
                        <p className="text-[11px] text-gray-400">{b.id}</p>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-600">{b.room} #{b.roomNo}</td>
                      <td className="px-5 py-3.5 text-xs text-gray-500">{fmtDate(b.checkIn)}</td>
                      <td className="px-5 py-3.5 text-xs text-gray-500">{b.nights}n</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded-lg ${statusColor[b.status]}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusDot[b.status]}`} />
                          {b.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[11px] font-semibold px-2 py-1 rounded-lg ${paymentColor[b.payment]}`}>{b.payment}</span>
                      </td>
                      <td className="px-5 py-3.5 text-sm font-bold text-gray-900 text-right">₹{b.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Room Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <BedDouble size={14} className="text-primary" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">Room Status</h3>
          </div>
          <div className="space-y-3">
            {roomStatus.map((item) => (
              <div key={item.status}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    <span className="text-xs text-gray-600">{item.status}</span>
                  </div>
                  <span className="text-xs font-bold text-gray-900">{item.count}</span>
                </div>
                {rooms.length > 0 && (
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${item.color} transition-all`} style={{ width: `${(item.count / rooms.length) * 100}%` }} />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Total Rooms</span>
              <span className="font-bold text-gray-900">{rooms.length}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions - Desktop Only */}
        <div className="hidden lg:block bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Activity size={14} className="text-primary" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">Quick Actions</h3>
          </div>
          <div className="space-y-2">
            {[
              { label: 'New Booking', form: 'booking' as const, icon: CalendarCheck, color: 'bg-blue-100 text-blue-600' },
              { label: 'Add Income', form: 'income' as const, icon: TrendingUp, color: 'bg-emerald-100 text-emerald-600' },
              { label: 'Add Expense', form: 'expense' as const, icon: TrendingDown, color: 'bg-red-100 text-red-600' },
              { label: 'View Guests', section: 'guests' as AdminSection, icon: Users, color: 'bg-purple-100 text-purple-600' },
              { label: 'Staff Directory', section: 'staff' as AdminSection, icon: Users, color: 'bg-amber-100 text-amber-600' },
            ].map((action) => {
              const Icon = action.icon
              return (
                <button
                  key={action.label}
                  onClick={() => 'form' in action ? onOpenForm?.(action.form) : onNavigate(action.section)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-sm text-gray-700 font-medium transition-colors"
                >
                  <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center`}>
                    <Icon size={14} />
                  </div>
                  {action.label}
                  <ArrowUpRight size={14} className="text-gray-400 ml-auto" />
                </button>
              )
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Clock size={14} className="text-primary" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">Recent Activity</h3>
          </div>
          <div className="space-y-3">
            {activities.length === 0 ? (
              <div className="py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <Activity size={16} className="text-gray-300" />
                </div>
                <p className="text-xs text-gray-500">No activity yet</p>
              </div>
            ) : activities.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock size={12} className="text-gray-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-600 leading-relaxed">{activity.text}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{relativeTime(activity.time)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
