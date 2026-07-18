'use client'

import { useState, useRef, useCallback } from 'react'
import { useAdminData } from '@/context/admin-data'
import { useToast } from '@/context/toast'
import { Search, Plus, Pencil, Trash2, X, CalendarCheck } from 'lucide-react'
import type { Booking } from '@/types/admin'

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

const emptyBooking = {
  guest: '', email: '', phone: '', room: 'Garden Suite', roomNo: '',
  checkIn: '', checkOut: '', nights: 1, status: 'Pending' as const, amount: 0, paidAmount: 0, payment: 'Pending' as const,
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
  const checkInRef = useRef<HTMLInputElement>(null)
  const checkOutRef = useRef<HTMLInputElement>(null)

  const openPicker = useCallback((ref: React.RefObject<HTMLInputElement | null>) => {
    ref.current?.showPicker?.()
  }, [])

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
    setForm({ guest: b.guest, email: b.email, phone: b.phone, room: b.room, roomNo: b.roomNo, checkIn: b.checkIn, checkOut: b.checkOut, nights: b.nights, status: b.status, amount: b.amount, paidAmount: b.paidAmount, payment: b.payment })
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
        <button onClick={openAdd} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors min-h-[44px]">
          <Plus size={15} /> New Booking
        </button>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-1.5 bg-gray-100 rounded-xl p-1.5 overflow-x-auto no-scrollbar w-full">
          {filters.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`px-3.5 py-2.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap min-h-[44px] ${activeFilter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700 active:bg-white/50'}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="relative w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search bookings..."
            className="w-full pl-9 pr-3 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200">
        {filtered.length === 0 ? (
          <div className="p-10 text-center">
            <CalendarCheck size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-500">No bookings found</p>
            <p className="text-xs text-gray-400 mt-1">{searchQuery ? 'Try a different search' : 'Click "New Booking" to get started'}</p>
          </div>
        ) : (
        <div className="overflow-x-auto relative no-scrollbar">
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
                  <td className="px-4 py-3.5 text-xs text-gray-500">{fmtDate(b.checkIn)} - {fmtDate(b.checkOut)}</td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${statusColor[b.status]}`}>{b.status}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-semibold ${paymentColor[b.payment]}`}>{b.payment}</span>
                  </td>
                  <td className="px-4 py-3.5 text-sm font-bold text-gray-900 text-right">${b.amount.toLocaleString()}</td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(b)} className="p-2.5 rounded-lg hover:bg-gray-100 active:bg-gray-200 text-gray-400 hover:text-gray-600 min-w-[44px] min-h-[44px] flex items-center justify-center"><Pencil size={14} /></button>
                      <button onClick={() => setDeleteConfirm(b.id)} className="p-2.5 rounded-lg hover:bg-red-50 active:bg-red-100 text-gray-400 hover:text-red-500 min-w-[44px] min-h-[44px] flex items-center justify-center"><Trash2 size={14} /></button>
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
              <p>{fmtDate(b.checkIn)} to {fmtDate(b.checkOut)} ({b.nights} nights)</p>
              <p className={`font-semibold ${paymentColor[b.payment]}`}>{b.payment}</p>
              {b.payment !== 'Fully Paid' && b.amount > b.paidAmount && (
                <p className="text-amber-600 font-medium">Balance: ${(b.amount - b.paidAmount).toLocaleString()}</p>
              )}
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
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg sm:mx-4 max-h-[90vh] overflow-y-auto safe-area-bottom" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white z-10 px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">{editingId ? 'Edit Booking' : 'New Booking'}</h3>
              <button onClick={() => setShowForm(false)} className="p-2.5 rounded-lg hover:bg-gray-100 min-w-[44px] min-h-[44px] flex items-center justify-center"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
              {/* Guest Info */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1.5">Guest Name *</label>
                <input type="text" required value={form.guest} onChange={e => setForm({ ...form, guest: e.target.value })}
                  className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Full name" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1.5">Phone *</label>
                  <input type="tel" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Phone" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1.5">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Email" />
                </div>
              </div>

              {/* Room & Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1.5">Room *</label>
                  <select value={form.room} onChange={e => setForm({ ...form, room: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-gray-900">
                    <option>Garden Suite</option>
                    <option>Villa Deluxe</option>
                    <option>Presidential Suite</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1.5">Room No.</label>
                  <input type="text" value={form.roomNo} onChange={e => setForm({ ...form, roomNo: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="e.g. 101" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1.5">Check-in *</label>
                  <input ref={checkInRef} type="date" required value={form.checkIn} onFocus={() => openPicker(checkInRef)} onChange={e => {
                    const checkIn = e.target.value
                    setForm(prev => {
                      const nights = checkIn && prev.checkOut ? Math.max(1, Math.ceil((new Date(prev.checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)) : prev.nights
                      return { ...prev, checkIn, nights }
                    })
                  }} className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 cursor-pointer [caret-color:transparent] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1.5">Check-out *</label>
                  <input ref={checkOutRef} type="date" required value={form.checkOut} onFocus={() => openPicker(checkOutRef)} onChange={e => {
                    const checkOut = e.target.value
                    setForm(prev => {
                      const nights = prev.checkIn && checkOut ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(prev.checkIn).getTime()) / 86400000)) : prev.nights
                      return { ...prev, checkOut, nights }
                    })
                  }} className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 cursor-pointer [caret-color:transparent] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1.5">Nights</label>
                  <input type="number" min="1" readOnly value={form.nights}
                    className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 bg-gray-50 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1.5">Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Booking['status'] })}
                    className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-gray-900">
                    <option>Pending</option>
                    <option>Confirmed</option>
                    <option>Checked In</option>
                    <option>Checked Out</option>
                  </select>
                </div>
              </div>

              {/* Payment */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1.5">Total Amount ($) *</label>
                  <input type="number" min="0" required value={form.amount} onChange={e => setForm({ ...form, amount: Number(e.target.value) })}
                    className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1.5">Paid ($)</label>
                  <input type="number" min="0" value={form.paidAmount} onChange={e => setForm({ ...form, paidAmount: Number(e.target.value) })}
                    className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1.5">Payment Status</label>
                  <select value={form.payment} onChange={e => setForm({ ...form, payment: e.target.value as Booking['payment'] })}
                    className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-gray-900">
                    <option>Pending</option>
                    <option>Partial</option>
                    <option>Fully Paid</option>
                  </select>
                </div>
                <div className="flex items-end">
                  {form.amount > 0 && form.paidAmount < form.amount && (
                    <p className="text-[11px] text-amber-600 font-medium pb-1">Balance: ${(form.amount - form.paidAmount).toLocaleString()}</p>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2 pb-1">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 min-h-[44px]">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 min-h-[44px]">{editingId ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-sm sm:mx-4 max-h-[90vh] overflow-y-auto safe-area-bottom" onClick={e => e.stopPropagation()}>
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
