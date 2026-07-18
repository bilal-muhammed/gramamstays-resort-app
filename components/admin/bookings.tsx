'use client'

import { useState } from 'react'
import { useAdminData } from '@/context/admin-data'
import { useToast } from '@/context/toast'
import { Search, Plus, Pencil, Trash2, X, ChevronDown, CalendarCheck } from 'lucide-react'
import type { Booking } from '@/types/admin'

const statusColor: Record<string, string> = {
  'Checked In': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Confirmed': 'bg-blue-50 text-blue-700 border-blue-200',
  'Pending': 'bg-amber-50 text-amber-700 border-amber-200',
  'Checked Out': 'bg-gray-50 text-gray-500 border-gray-200',
}

const paymentColor: Record<string, string> = {
  'Paid': 'text-emerald-600',
  'Pending': 'text-amber-600',
  'Deposit': 'text-blue-600',
}

const emptyBooking = {
  guest: '', email: '', phone: '', room: 'Garden Suite', roomNo: '',
  checkIn: '', checkOut: '', nights: 1, status: 'Pending' as const, amount: 0, payment: 'Pending' as const,
}

export function AdminBookings() {
  const { bookings, addBooking, updateBooking, deleteBooking } = useAdminData()
  const { toast } = useToast()
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyBooking)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const filters = ['All', 'Checked In', 'Confirmed', 'Pending', 'Checked Out']

  const filtered = bookings.filter(b => {
    const matchFilter = activeFilter === 'All' || b.status === activeFilter
    const matchSearch = b.guest.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.room.toLowerCase().includes(searchQuery.toLowerCase())
    return matchFilter && matchSearch
  })

  const openAdd = () => {
    setEditingId(null)
    setForm(emptyBooking)
    setShowForm(true)
  }

  const openEdit = (b: Booking) => {
    setEditingId(b.id)
    setForm({ guest: b.guest, email: b.email, phone: b.phone, room: b.room, roomNo: b.roomNo, checkIn: b.checkIn, checkOut: b.checkOut, nights: b.nights, status: b.status, amount: b.amount, payment: b.payment })
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      updateBooking(editingId, form)
      toast('success', 'Booking updated')
    } else {
      addBooking(form)
      toast('success', 'Booking created')
    }
    setShowForm(false)
    setEditingId(null)
    setForm(emptyBooking)
  }

  const handleDelete = (id: string) => {
    deleteBooking(id)
    setDeleteConfirm(null)
    toast('success', 'Booking deleted')
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Bookings</h2>
          <p className="text-xs text-gray-500">{filtered.length} booking{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openAdd} className="flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors min-h-[44px]">
          <Plus size={15} /> New Booking
        </button>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 overflow-x-auto no-scrollbar">
          {filters.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`px-3.5 py-2.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap min-h-[40px] ${activeFilter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700 active:bg-white/50'}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search bookings..."
            className="w-full pl-9 pr-3 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 text-center">
            <CalendarCheck size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-500">No bookings found</p>
            <p className="text-xs text-gray-400 mt-1">{searchQuery ? 'Try a different search' : 'Click "New Booking" to get started'}</p>
          </div>
        ) : (
        <div className="overflow-x-auto relative">
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase">Booking</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase">Guest</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase">Room</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase">Dates</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase">Payment</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase text-right">Amount</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3.5 text-xs font-semibold text-gray-900">{b.id}</td>
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-medium text-gray-900">{b.guest}</p>
                    <p className="text-[10px] text-gray-400">{b.email}</p>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-600">{b.room} #{b.roomNo}</td>
                  <td className="px-4 py-3.5 text-xs text-gray-500">{b.checkIn} - {b.checkOut}</td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${statusColor[b.status]}`}>{b.status}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-semibold ${paymentColor[b.payment]}`}>{b.payment}</span>
                  </td>
                  <td className="px-4 py-3.5 text-sm font-bold text-gray-900 text-right">${b.amount.toLocaleString()}</td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(b)} className="p-2.5 rounded-lg hover:bg-gray-100 active:bg-gray-200 text-gray-400 hover:text-gray-600 min-w-[40px] min-h-[40px] flex items-center justify-center"><Pencil size={14} /></button>
                      <button onClick={() => setDeleteConfirm(b.id)} className="p-2.5 rounded-lg hover:bg-red-50 active:bg-red-100 text-gray-400 hover:text-red-500 min-w-[40px] min-h-[40px] flex items-center justify-center"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
            <CalendarCheck size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-500">No bookings found</p>
            <p className="text-xs text-gray-400 mt-1">{searchQuery ? 'Try a different search' : 'Click "New Booking" to get started'}</p>
          </div>
        ) : filtered.map(b => (
          <div key={b.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-gray-900">{b.guest}</p>
                <p className="text-[10px] text-gray-400">{b.id}</p>
              </div>
              <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${statusColor[b.status]} shrink-0 ml-2`}>{b.status}</span>
            </div>
            <div className="space-y-1 text-xs text-gray-500 mb-3">
              <p>{b.room} #{b.roomNo}</p>
              <p>{b.checkIn} - {b.checkOut} ({b.nights} nights)</p>
              <p className={`font-semibold ${paymentColor[b.payment]}`}>{b.payment}</p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-sm font-bold text-gray-900">${b.amount.toLocaleString()}</span>
              <div className="flex gap-1.5">
                <button onClick={() => openEdit(b)} className="p-2.5 rounded-lg hover:bg-gray-100 active:bg-gray-200 text-gray-400 hover:text-gray-600 min-w-[44px] min-h-[44px] flex items-center justify-center"><Pencil size={15} /></button>
                <button onClick={() => setDeleteConfirm(b.id)} className="p-2.5 rounded-lg hover:bg-red-50 active:bg-red-100 text-gray-400 hover:text-red-500 min-w-[44px] min-h-[44px] flex items-center justify-center"><Trash2 size={15} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg sm:mx-4 max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white z-10 px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">{editingId ? 'Edit Booking' : 'New Booking'}</h3>
              <button onClick={() => setShowForm(false)} className="p-2.5 rounded-lg hover:bg-gray-100 min-w-[44px] min-h-[44px] flex items-center justify-center"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Guest Name *</label>
                  <input type="text" required value={form.guest} onChange={e => setForm({ ...form, guest: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Email *</label>
                  <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Phone</label>
                  <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Room *</label>
                  <select value={form.room} onChange={e => setForm({ ...form, room: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white">
                    <option>Presidential Suite</option>
                    <option>Villa Deluxe</option>
                    <option>Garden Suite</option>
                  </select>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Room No.</label>
                  <input type="text" value={form.roomNo} onChange={e => setForm({ ...form, roomNo: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Nights *</label>
                  <input type="number" min="1" required value={form.nights} onChange={e => setForm({ ...form, nights: Number(e.target.value) })}
                    className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Check-in *</label>
                  <input type="text" required placeholder="Jul 18" value={form.checkIn} onChange={e => setForm({ ...form, checkIn: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Check-out *</label>
                  <input type="text" required placeholder="Jul 22" value={form.checkOut} onChange={e => setForm({ ...form, checkOut: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Booking['status'] })}
                    className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white">
                    <option>Pending</option>
                    <option>Confirmed</option>
                    <option>Checked In</option>
                    <option>Checked Out</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Payment</label>
                  <select value={form.payment} onChange={e => setForm({ ...form, payment: e.target.value as Booking['payment'] })}
                    className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white">
                    <option>Pending</option>
                    <option>Deposit</option>
                    <option>Paid</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Amount ($) *</label>
                <input type="number" min="0" required value={form.amount} onChange={e => setForm({ ...form, amount: Number(e.target.value) })}
                  className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
              <div className="flex gap-3 pt-2 pb-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 min-h-[48px]">Cancel</button>
                <button type="submit" className="flex-1 py-3.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 min-h-[48px]">{editingId ? 'Update' : 'Create'} Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-sm sm:mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-gray-900 mb-2">Delete Booking?</h3>
            <p className="text-sm text-gray-500 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 min-h-[48px]">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-3.5 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 min-h-[48px]">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
