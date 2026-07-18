'use client'

import type { AdminSection } from '@/app/admin/page'
import { useAdminData } from '@/context/admin-data'
import { TrendingUp, TrendingDown, CalendarCheck, BedDouble, DollarSign, Users, ArrowUpRight, Clock, Plus, X } from 'lucide-react'
import { useState } from 'react'

const statusColor: Record<string, string> = {
  'Checked In': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Confirmed': 'bg-blue-50 text-blue-700 border-blue-200',
  'Pending': 'bg-amber-50 text-amber-700 border-amber-200',
  'Checked Out': 'bg-gray-50 text-gray-500 border-gray-200',
}

interface Props {
  onNavigate: (section: AdminSection) => void
}

export function AdminDashboard({ onNavigate }: Props) {
  const { bookings, rooms, guests, expenses, income, activities } = useAdminData()
  const [showQuickAdd, setShowQuickAdd] = useState(false)

  const totalRevenue = income.reduce((s, i) => s + i.amount, 0)
  const occupancyRate = rooms.length > 0 ? Math.round((rooms.filter(r => r.status === 'Occupied').length / rooms.length) * 100) : 0
  const activeBookings = bookings.filter(b => b.status !== 'Checked Out').length
  const totalGuests = guests.length

  const roomStatus = [
    { status: 'Occupied', count: rooms.filter(r => r.status === 'Occupied').length, color: 'bg-blue-500' },
    { status: 'Available', count: rooms.filter(r => r.status === 'Available').length, color: 'bg-emerald-500' },
    { status: 'Maintenance', count: rooms.filter(r => r.status === 'Maintenance').length, color: 'bg-amber-500' },
    { status: 'Reserved', count: rooms.filter(r => r.status === 'Reserved').length, color: 'bg-purple-500' },
  ]

  const stats = [
    { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, change: '+12.5%', up: true, icon: DollarSign, color: 'bg-emerald-500' },
    { label: 'Occupancy Rate', value: `${occupancyRate}%`, change: '+3.2%', up: true, icon: BedDouble, color: 'bg-blue-500' },
    { label: 'Active Bookings', value: String(activeBookings), change: '-2', up: false, icon: CalendarCheck, color: 'bg-amber-500' },
    { label: 'Total Guests', value: String(totalGuests), change: '+156', up: true, icon: Users, color: 'bg-purple-500' },
  ]

  return (
    <div className="space-y-5">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${stat.color}/10 rounded-lg flex items-center justify-center`}>
                  <Icon size={18} className={`${stat.color.replace('bg-', 'text-')}`} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold ${stat.up ? 'text-emerald-600' : 'text-red-500'}`}>
                  {stat.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  <span>{stat.change}</span>
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm">Recent Bookings</h3>
            <button onClick={() => onNavigate('bookings')} className="text-xs text-primary font-semibold hover:underline">
              View All
            </button>
          </div>
          <div className="overflow-x-auto relative">
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
            <table className="w-full text-left min-w-[500px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-5 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Guest</th>
                  <th className="px-5 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Room</th>
                  <th className="px-5 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Dates</th>
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
                    <td className="px-5 py-3.5 text-sm text-gray-600 hidden sm:table-cell">{booking.room}</td>
                    <td className="px-5 py-3.5 text-xs text-gray-500 hidden md:table-cell">{booking.checkIn} - {booking.checkOut}</td>
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

        {/* Room Status + Quick Actions */}
        <div className="space-y-4 sm:space-y-5">
          {/* Room Status */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-900 text-sm mb-4">Room Status</h3>
            <div className="space-y-3">
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
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Total Rooms</span>
                <span className="font-bold text-gray-900">{rooms.length}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-900 text-sm mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: 'New Booking', section: 'bookings' as AdminSection },
                { label: 'Check-in Guest', section: 'bookings' as AdminSection },
                { label: 'Room Availability', section: 'rooms' as AdminSection },
                { label: 'Add Expense', section: 'financials' as AdminSection },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={() => onNavigate(action.section)}
                  className="w-full flex items-center justify-between px-3.5 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-sm text-gray-700 font-medium transition-colors min-h-[44px]"
                >
                  {action.label}
                  <ArrowUpRight size={14} className="text-gray-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-900 text-sm mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex gap-3">
                  <Clock size={14} className="text-gray-400 mt-0.5 shrink-0" />
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
    </div>
  )
}
