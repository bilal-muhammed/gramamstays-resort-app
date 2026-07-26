'use client'

import { useState, useRef, useCallback } from 'react'
import { useAdminData } from '@/context/admin-data'
import { useToast } from '@/context/toast'
import { Search, Plus, Pencil, Trash2, X, CalendarCheck, Filter, Users, Compass, Flame, UtensilsCrossed, BedDouble, Sparkles, TreePine } from 'lucide-react'
import type { Booking } from '@/types/admin'

const addonOptions = [
  { id: 'trekking', label: 'Trekking', icon: Compass },
  { id: 'campfire', label: 'Campfire Night', icon: Flame },
  { id: 'food', label: 'Special Food', icon: UtensilsCrossed },
  { id: 'extra-bed', label: 'Extra Bed', icon: BedDouble },
  { id: 'spa', label: 'Spa Session', icon: Sparkles },
  { id: 'nature-walk', label: 'Nature Walk', icon: TreePine },
  { id: 'picnic', label: 'Picnic', icon: UtensilsCrossed },
  { id: 'tour', label: 'Guided Tour', icon: Compass },
  { id: 'yoga', label: 'Yoga Class', icon: Sparkles },
  { id: 'birdwatching', label: 'Bird Watching', icon: TreePine },
  { id: 'boating', label: 'Boating', icon: Compass },
  { id: 'fishing', label: 'Fishing', icon: TreePine },
]

function fmtDate(d: string) {
  if (!d) return ''
  const date = d.includes('T') ? new Date(d) : new Date(d + 'T00:00:00')
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function toDateInput(d: string) {
  if (!d) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d
  return new Date(d).toISOString().split('T')[0]
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

const emptyBooking = {
  guest: '', email: '', phone: '', room: '', roomNo: '',
  checkIn: '', checkOut: '', nights: 1, status: 'Pending' as const, amount: 0, paidAmount: 0, payment: 'Pending' as const,
  addons: [] as string[], addonNote: '',
}

export function AdminBookings() {
  const { bookings, addBooking, updateBooking, deleteBooking, properties } = useAdminData()
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

  const filterCounts = {
    All: bookings.length,
    'Checked In': bookings.filter(b => b.status === 'Checked In').length,
    Confirmed: bookings.filter(b => b.status === 'Confirmed').length,
    Pending: bookings.filter(b => b.status === 'Pending').length,
    'Checked Out': bookings.filter(b => b.status === 'Checked Out').length,
  }

  const openAdd = () => {
    setEditingId(null)
    setForm(emptyBooking)
    setShowForm(true)
  }

  const openEdit = (b: Booking) => {
    setEditingId(b.id)
    setForm({ guest: b.guest, email: b.email, phone: b.phone, room: b.room, roomNo: b.roomNo, checkIn: toDateInput(b.checkIn), checkOut: toDateInput(b.checkOut), nights: b.nights, status: b.status, amount: b.amount, paidAmount: b.paidAmount, payment: b.payment, addons: Array.isArray(b.addons) ? b.addons : [], addonNote: b.addonNote || '' })
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (form.status === 'Checked Out' && form.amount > 0 && form.paidAmount < form.amount) {
      toast('error', `Cannot check out — ₹${(form.amount - form.paidAmount).toLocaleString()} balance pending. Clear the balance first.`)
      return
    }
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
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Bookings</h2>
          <p className="text-xs text-gray-500 mt-0.5">{filtered.length} of {bookings.length} bookings</p>
        </div>
        <button onClick={openAdd} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all min-h-[38px] shadow-sm">
          <Plus size={16} /> New Booking
        </button>
      </div>

      {/* Filters + Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-2.5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1 overflow-x-auto no-scrollbar flex-1">
            {filters.map(f => (
              <button key={f} onClick={() => setActiveFilter(f)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md transition-all whitespace-nowrap min-h-[36px] ${
                  activeFilter === f 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                }`}>
                {f}
                {filterCounts[f as keyof typeof filterCounts] > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeFilter === f ? 'bg-primary/10 text-primary' : 'bg-gray-200 text-gray-500'}`}>
                    {filterCounts[f as keyof typeof filterCounts]}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="relative sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search bookings..."
              className="w-full pl-9 pr-3 py-2.5 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <CalendarCheck size={24} className="text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">No bookings found</p>
            <p className="text-xs text-gray-500 mb-4">{searchQuery ? 'Try a different search' : 'Create your first booking'}</p>
            {!searchQuery && (
              <button onClick={openAdd} className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all">
                <Plus size={14} /> New Booking
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  <th className="px-5 py-3.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Guest</th>
                  <th className="px-5 py-3.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Room</th>
                  <th className="px-5 py-3.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Dates</th>
                  <th className="px-5 py-3.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Add-ons</th>
                  <th className="px-5 py-3.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-5 py-3.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider text-right">Amount</th>
                  <th className="px-5 py-3.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider text-right">Pending</th>
                  <th className="px-5 py-3.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-gray-900">{b.guest}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{b.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-700">{b.room}</p>
                      <p className="text-[11px] text-gray-400">#{b.roomNo}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-700">{fmtDate(b.checkIn)}</p>
                      <p className="text-[11px] text-gray-400">{b.nights} nights</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(b.addons) && b.addons.slice(0, 2).map(id => {
                          const opt = addonOptions.find(o => o.id === id)
                          return opt ? (
                            <span key={id} className="px-1.5 py-0.5 text-[9px] font-semibold rounded bg-primary/10 text-primary">{opt.label}</span>
                          ) : null
                        })}
                        {Array.isArray(b.addons) && b.addons.length > 2 && (
                          <span className="px-1.5 py-0.5 text-[9px] font-semibold rounded bg-gray-100 text-gray-500">+{b.addons.length - 2}</span>
                        )}
                        {b.addonNote && (
                          <span className="px-1.5 py-0.5 text-[9px] font-semibold rounded bg-amber-50 text-amber-700">Note</span>
                        )}
                        {(!Array.isArray(b.addons) || b.addons.length === 0) && !b.addonNote && (
                          <span className="text-gray-300">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-lg ${statusColor[b.status]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusDot[b.status]}`} />
                        {b.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2 py-1 text-[11px] font-semibold rounded-lg ${paymentColor[b.payment]}`}>
                        {b.payment}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-gray-900 text-right">₹{b.amount.toLocaleString()}</td>
                    <td className="px-5 py-4 text-right">
                      {b.payment !== 'Fully Paid' && b.amount > b.paidAmount ? (
                        <span className="inline-flex px-2 py-1 text-[11px] font-semibold text-amber-600 bg-amber-50 rounded-lg">
                          ₹{(b.amount - b.paidAmount).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(b)} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => setDeleteConfirm(b.id)} className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 size={15} />
                        </button>
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
      <div className="lg:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <CalendarCheck size={24} className="text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">No bookings found</p>
            <p className="text-xs text-gray-500 mb-4">{searchQuery ? 'Try a different search' : 'Create your first booking'}</p>
            {!searchQuery && (
              <button onClick={openAdd} className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all">
                <Plus size={14} /> New Booking
              </button>
            )}
          </div>
        ) : filtered.map(b => (
          <div key={b.id} className="bg-white rounded-lg border border-gray-200 p-3 hover:border-gray-300 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-gray-900">{b.guest}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{b.room} #{b.roomNo}</p>
              </div>
              <span className={`inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded-lg ${statusColor[b.status]} shrink-0 ml-2`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusDot[b.status]}`} />
                {b.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Check-in</p>
                <p className="text-xs font-medium text-gray-700">{fmtDate(b.checkIn)}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Check-out</p>
                <p className="text-xs font-medium text-gray-700">{fmtDate(b.checkOut)}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Nights</p>
                <p className="text-xs font-medium text-gray-700">{b.nights}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Payment</p>
                <span className={`inline-flex px-2 py-0.5 text-[10px] font-semibold rounded ${paymentColor[b.payment]}`}>
                  {b.payment}
                </span>
              </div>
            </div>

            {(Array.isArray(b.addons) && b.addons.length > 0) || b.addonNote ? (
              <div className="mb-3 flex flex-wrap gap-1">
                {Array.isArray(b.addons) && b.addons.map(id => {
                  const opt = addonOptions.find(o => o.id === id)
                  return opt ? (
                    <span key={id} className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-semibold rounded bg-primary/10 text-primary">{opt.label}</span>
                  ) : null
                })}
                {b.addonNote && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-semibold rounded bg-amber-50 text-amber-700">Custom</span>
                )}
              </div>
            ) : null}

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">Total</p>
                <p className="text-base font-bold text-gray-900">₹{b.amount.toLocaleString()}</p>
              </div>
              {b.payment !== 'Fully Paid' && b.amount > b.paidAmount && (
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">Pending</p>
                  <p className="text-base font-bold text-amber-600">₹{(b.amount - b.paidAmount).toLocaleString()}</p>
                </div>
              )}
              <div className="flex gap-2">
                <button onClick={() => openEdit(b)} className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">
                  <Pencil size={15} />
                </button>
                <button onClick={() => setDeleteConfirm(b.id)} className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-lg sm:mx-4 max-h-[92vh] overflow-y-auto safe-area-bottom" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{editingId ? 'Edit Booking' : 'New Booking'}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{editingId ? 'Update booking details' : 'Create a new reservation'}</p>
              </div>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Guest Info */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Guest Name *</label>
                <input type="text" required value={form.guest} onChange={e => setForm({ ...form, guest: e.target.value })}
                  className="w-full px-4 py-3 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Full name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Phone *</label>
                  <input type="tel" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Phone" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Email" />
                </div>
              </div>

              {/* Room & Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Room *</label>
                  <select value={form.room} onChange={e => setForm({ ...form, room: e.target.value })}
                    className="w-full px-4 py-3 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-all appearance-none">
                    <option value="">Select property</option>
                    {properties.filter(p => p.status === 'Active').map(p => (
                      <option key={p.id} value={p.name}>{p.name} — ₹{p.price.toLocaleString()}/night</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Room No.</label>
                  <input type="text" value={form.roomNo} onChange={e => setForm({ ...form, roomNo: e.target.value })}
                    className="w-full px-4 py-3 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="e.g. 101" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Check-in *</label>
                  <input ref={checkInRef} type="date" required value={form.checkIn} onFocus={() => openPicker(checkInRef)} onChange={e => {
                    const checkIn = e.target.value
                    setForm(prev => {
                      const nights = checkIn && prev.checkOut ? Math.max(1, Math.ceil((new Date(prev.checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)) : prev.nights
                      return { ...prev, checkIn, nights }
                    })
                  }} className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Check-out *</label>
                  <input ref={checkOutRef} type="date" required value={form.checkOut} onFocus={() => openPicker(checkOutRef)} onChange={e => {
                    const checkOut = e.target.value
                    setForm(prev => {
                      const nights = prev.checkIn && checkOut ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(prev.checkIn).getTime()) / 86400000)) : prev.nights
                      return { ...prev, checkOut, nights }
                    })
                  }} className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Nights</label>
                  <input type="number" min="1" readOnly value={form.nights}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 bg-gray-50 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Booking['status'] })}
                    className="w-full px-4 py-3 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-all appearance-none">
                    <option>Pending</option>
                    <option>Confirmed</option>
                    <option>Checked In</option>
                    <option>Checked Out</option>
                  </select>
                  {form.status === 'Checked Out' && form.amount > 0 && form.paidAmount < form.amount && (
                    <p className="text-[11px] text-red-600 font-medium mt-1.5">Cannot check out with ₹{(form.amount - form.paidAmount).toLocaleString()} balance pending</p>
                  )}
                </div>
              </div>

              {/* Payment */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Payment Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Total Amount (₹) *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                      <input type="number" min="0" required value={form.amount} onChange={e => {
                        const amount = Number(e.target.value)
                        setForm(prev => {
                          const payment = amount > 0 && prev.paidAmount >= amount ? 'Fully Paid' : prev.paidAmount > 0 ? 'Partial' : 'Pending'
                          return { ...prev, amount, payment }
                        })
                      }}
                        className="w-full pl-8 pr-4 py-3 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Paid (₹)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                      <input type="number" min="0" value={form.paidAmount} onChange={e => {
                        const paidAmount = Number(e.target.value)
                        setForm(prev => {
                          const payment = prev.amount > 0 && paidAmount >= prev.amount ? 'Fully Paid' : paidAmount > 0 ? 'Partial' : 'Pending'
                          return { ...prev, paidAmount, payment }
                        })
                      }}
                        className="w-full pl-8 pr-4 py-3 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Payment Status</label>
                    <select value={form.payment} onChange={e => setForm({ ...form, payment: e.target.value as Booking['payment'] })}
                      className="w-full px-4 py-3 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-all appearance-none">
                      <option>Pending</option>
                      <option>Partial</option>
                      <option>Fully Paid</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    {form.amount > 0 && form.paidAmount < form.amount && (
                      <div className="w-full px-4 py-3 rounded-xl bg-amber-50 border border-amber-200">
                        <p className="text-xs text-amber-600 font-medium">Balance: ₹{(form.amount - form.paidAmount).toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Add-ons */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Add-ons & Extras</h4>
                  {form.addons.length > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">{form.addons.length} selected</span>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {addonOptions.map(opt => {
                    const Icon = opt.icon
                    const isSelected = form.addons.includes(opt.id)
                    return (
                      <button key={opt.id} type="button" onClick={() => {
                        setForm(prev => ({
                          ...prev,
                          addons: isSelected
                            ? prev.addons.filter(a => a !== opt.id)
                            : [...prev.addons, opt.id],
                        }))
                      }}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-primary/10 border-primary/30 text-primary'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}>
                        <Icon size={14} className={isSelected ? 'text-primary' : 'text-gray-400'} />
                        <span className="flex-1 text-left">{opt.label}</span>
                      </button>
                    )
                  })}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Custom Add-on / Notes</label>
                  <textarea value={form.addonNote} onChange={e => setForm({ ...form, addonNote: e.target.value })}
                    className="w-full px-4 py-3 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none h-20 transition-all" placeholder="e.g. Birthday cake decoration, airport transfer..." />
                </div>
                {(form.addons.length > 0 || form.addonNote) && (
                  <div className="flex flex-wrap gap-1.5">
                    {form.addons.map(id => {
                      const opt = addonOptions.find(o => o.id === id)
                      return opt ? (
                        <span key={id} className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold rounded-lg bg-primary/10 text-primary">
                          {opt.label}
                          <button type="button" onClick={() => setForm(prev => ({ ...prev, addons: prev.addons.filter(a => a !== id) }))} className="ml-0.5 hover:text-primary/70">×</button>
                        </span>
                      ) : null
                    })}
                    {form.addonNote && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold rounded-lg bg-amber-50 text-amber-700">
                        Note: {form.addonNote.length > 30 ? form.addonNote.slice(0, 30) + '...' : form.addonNote}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm">
                  {editingId ? 'Update' : 'Create'} Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-t-2xl sm:rounded-xl p-6 w-full sm:max-w-sm sm:mx-4 safe-area-bottom" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={20} className="text-red-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1 text-center">Delete Booking?</h3>
            <p className="text-sm text-gray-500 mb-5 text-center">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all shadow-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
