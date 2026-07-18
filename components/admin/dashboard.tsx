'use client'

import type { AdminSection } from '@/app/admin/page'
import { useAdminData } from '@/context/admin-data'
import { TrendingUp, TrendingDown, CalendarCheck, BedDouble, DollarSign, ArrowUpRight, Clock, CalendarClock } from 'lucide-react'

function fmtDate(d: string) {
  if (!d) return ''
  const date = new Date(d + 'T00:00:00')
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const statusColor: Record<string, string> = {
  'Checked In': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Confirmed': 'bg-blue-50 text-blue-700 border-blue-200',
  'Pending': 'bg-amber-50 text-amber-700 border-amber-200',
  'Checked Out': 'bg-gray-50 text-gray-500 border-gray-200',
}

const paymentColor: Record<string, string> = {
  'Fully Paid': 'text-emerald-600',
  'Partial': 'text-blue-600',
  'Pending': 'text-amber-600',
}

interface Props {
  onNavigate: (section: AdminSection) => void
}

export function AdminDashboard({ onNavigate }: Props) {
  const { bookings, rooms, expenses, income, activities } = useAdminData()

  const totalRevenue = income.reduce((s, i) => s + i.amount, 0)
  const occupancyRate = rooms.length > 0 ? Math.round((rooms.filter(r => r.status === 'Occupied').length / rooms.length) * 100) : 0
  const activeBookings = bookings.filter(b => b.status !== 'Checked Out').length
  const pendingAmount = bookings.filter(b => b.payment !== 'Fully Paid' && b.status !== 'Checked Out').reduce((s, b) => s + (b.amount - b.paidAmount), 0)

  const upcomingBookings = bookings
    .filter(b => b.status === 'Confirmed' || b.status === 'Pending')
    .sort((a, b) => a.checkIn.localeCompare(b.checkIn))
    .slice(0, 5)

  const roomStatus = [
    { status: 'Occupied', count: rooms.filter(r => r.status === 'Occupied').length, color: 'bg-blue-500' },
    { status: 'Available', count: rooms.filter(r => r.status === 'Available').length, color: 'bg-emerald-500' },
    { status: 'Maintenance', count: rooms.filter(r => r.status === 'Maintenance').length, color: 'bg-amber-500' },
    { status: 'Reserved', count: rooms.filter(r => r.status === 'Reserved').length, color: 'bg-purple-500' },
  ]

  const stats = [
    { label: 'Revenue', value: `$${totalRevenue.toLocaleString()}`, change: '+12.5%', up: true, icon: DollarSign, bgColor: 'bg-emerald-50', textColor: 'text-emerald-600' },
    { label: 'Occupancy', value: `${occupancyRate}%`, change: '+3.2%', up: true, icon: BedDouble, bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
    { label: 'Bookings', value: String(activeBookings), change: '', up: true, icon: CalendarCheck, bgColor: 'bg-amber-50', textColor: 'text-amber-600' },
    { label: 'Pending', value: `$${pendingAmount.toLocaleString()}`, change: '', up: false, icon: Clock, bgColor: 'bg-red-50', textColor: 'text-red-600' },
  ]

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-3 sm:p-5">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 ${stat.bgColor} rounded-lg flex items-center justify-center shrink-0`}>
                  <Icon size={16} className={stat.textColor} />
                </div>
                <div className={`flex items-center gap-0.5 text-[10px] sm:text-xs font-semibold ${stat.up ? 'text-emerald-600' : 'text-red-500'}`}>
                  {stat.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  <span>{stat.change}</span>
                </div>
              </div>
              <p className="text-xl sm:text-3xl font-bold text-gray-900 truncate">{stat.value}</p>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Upcoming Bookings */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarClock size={16} className="text-primary" />
            <h3 className="font-bold text-gray-900 text-sm">Upcoming Bookings</h3>
          </div>
          <button onClick={() => onNavigate('bookings')} className="text-xs text-primary font-semibold hover:underline">
            View All
          </button>
        </div>

        {upcomingBookings.length === 0 ? (
          <div className="p-8 text-center">
            <CalendarClock size={28} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">No upcoming bookings</p>
          </div>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-50">
              {upcomingBookings.map((b) => (
                <div key={b.id} className="px-4 py-3">
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 truncate">{b.guest}</p>
                      <p className="text-[10px] text-gray-400">{b.room} #{b.roomNo}</p>
                    </div>
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border shrink-0 ml-2 ${statusColor[b.status]}`}>
                      {b.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-[11px] text-gray-400">In: {fmtDate(b.checkIn)}</p>
                      <span className="text-gray-300">·</span>
                      <p className="text-[11px] text-gray-400">{b.nights}n</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-semibold ${paymentColor[b.payment]}`}>{b.payment}</span>
                      <span className="text-sm font-bold text-gray-900">${b.amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto no-scrollbar">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-5 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Guest</th>
                    <th className="px-5 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Room</th>
                    <th className="px-5 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Check-in</th>
                    <th className="px-5 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Nights</th>
                    <th className="px-5 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                    <th className="px-5 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingBookings.map((b) => (
                    <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-semibold text-gray-900">{b.guest}</p>
                        <p className="text-[10px] text-gray-400">{b.id}</p>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-600">{b.room} #{b.roomNo}</td>
                      <td className="px-5 py-3.5 text-xs text-gray-500">{fmtDate(b.checkIn)}</td>
                      <td className="px-5 py-3.5 text-xs text-gray-500">{b.nights}n</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${statusColor[b.status]}`}>{b.status}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-semibold ${paymentColor[b.payment]}`}>{b.payment}</span>
                      </td>
                      <td className="px-5 py-3.5 text-sm font-bold text-gray-900 text-right">${b.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-sm">Recent Bookings</h3>
          <button onClick={() => onNavigate('bookings')} className="text-xs text-primary font-semibold hover:underline">
            View All
          </button>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-50">
          {bookings.slice(0, 4).map((booking) => (
            <div key={booking.id} className="px-4 py-3">
              <div className="flex items-start justify-between mb-1.5">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 truncate">{booking.guest}</p>
                  <p className="text-[10px] text-gray-400">{booking.id} · {booking.room}</p>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border shrink-0 ml-2 ${statusColor[booking.status]}`}>
                  {booking.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-gray-400">{fmtDate(booking.checkIn)} - {fmtDate(booking.checkOut)}</p>
                <p className="text-sm font-bold text-gray-900">${booking.amount.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-5 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Guest</th>
                <th className="px-5 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Room</th>
                <th className="px-5 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Dates</th>
                <th className="px-5 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 5).map((booking) => (
                <tr key={booking.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-semibold text-gray-900">{booking.guest}</p>
                    <p className="text-[10px] text-gray-400">{booking.id}</p>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{booking.room}</td>
                  <td className="px-5 py-3.5 text-xs text-gray-500">{fmtDate(booking.checkIn)} - {fmtDate(booking.checkOut)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${statusColor[booking.status]}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-gray-900 text-right">${booking.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Room Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
          <h3 className="font-bold text-gray-900 text-sm mb-3 sm:mb-4">Room Status</h3>
          <div className="space-y-2.5">
            {roomStatus.map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  <span className="text-sm text-gray-600">{item.status}</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Total Rooms</span>
              <span className="font-bold text-gray-900">{rooms.length}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
          <h3 className="font-bold text-gray-900 text-sm mb-3 sm:mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: 'New Booking', section: 'bookings' as AdminSection },
              { label: 'Check-in Guest', section: 'bookings' as AdminSection },
              { label: 'Add Expense', section: 'financials' as AdminSection },
              { label: 'View Guests', section: 'guests' as AdminSection },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => onNavigate(action.section)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-sm text-gray-700 font-medium transition-colors min-h-[44px]"
              >
                {action.label}
                <ArrowUpRight size={14} className="text-gray-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 sm:col-span-2 lg:col-span-1">
          <h3 className="font-bold text-gray-900 text-sm mb-3 sm:mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {activities.slice(0, 4).map((activity) => (
              <div key={activity.id} className="flex gap-2.5">
                <Clock size={13} className="text-gray-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-600 leading-relaxed">{activity.text}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
