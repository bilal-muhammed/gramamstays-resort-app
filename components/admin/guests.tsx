'use client'

import { useState } from 'react'
import { useAdminData } from '@/context/admin-data'
import { useToast } from '@/context/toast'
import { Search, Plus, Pencil, Trash2, X, Star, Users, Mail, Phone, MapPin } from 'lucide-react'
import type { Guest } from '@/types/admin'

const emptyGuest = { name: '', email: '', phone: '', location: '', stays: 1, totalSpent: 0, rating: 5, lastStay: '', vip: false }

export function AdminGuests() {
  const { guests, addGuest, updateGuest, deleteGuest } = useAdminData()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [showVipOnly, setShowVipOnly] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyGuest)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const filtered = guests.filter(g => {
    const matchVip = !showVipOnly || g.vip
    const matchSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) || g.email.toLowerCase().includes(searchQuery.toLowerCase()) || g.location.toLowerCase().includes(searchQuery.toLowerCase())
    return matchVip && matchSearch
  })

  const openAdd = () => { setEditingId(null); setForm(emptyGuest); setShowForm(true) }
  const openEdit = (g: Guest) => { setEditingId(g.id); setForm({ name: g.name, email: g.email, phone: g.phone, location: g.location, stays: g.stays, totalSpent: g.totalSpent, rating: g.rating, lastStay: g.lastStay, vip: g.vip }); setShowForm(true) }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      updateGuest(editingId, form)
      toast('success', 'Guest updated')
    } else {
      addGuest(form)
      toast('success', 'Guest added')
    }
    setShowForm(false); setEditingId(null); setForm(emptyGuest)
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Guests</h2>
          <p className="text-xs text-gray-500 mt-0.5">{filtered.length} of {guests.length} guests</p>
        </div>
        <button onClick={openAdd} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all min-h-[38px] shadow-sm">
          <Plus size={16} /> Add Guest
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-2.5">
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={() => setShowVipOnly(!showVipOnly)}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs font-semibold border transition-all min-h-[36px] ${
              showVipOnly 
                ? 'bg-amber-50 border-amber-200 text-amber-700' 
                : 'bg-gray-100 border-transparent text-gray-500 hover:bg-gray-200'
            }`}>
            <Star size={12} className={showVipOnly ? 'fill-amber-400' : ''} />
            VIP Only
          </button>
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search guests..."
              className="w-full pl-9 pr-3 py-2.5 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
        </div>
      </div>

      {/* Guest Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="sm:col-span-2 lg:col-span-3 bg-white rounded-lg border border-gray-200 p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Users size={24} className="text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">No guests found</p>
            <p className="text-xs text-gray-500 mb-4">{searchQuery ? 'Try a different search' : 'Add your first guest'}</p>
            {!searchQuery && (
              <button onClick={openAdd} className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all">
                <Plus size={14} /> Add Guest
              </button>
            )}
          </div>
        ) : filtered.map(guest => (
          <div key={guest.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-all group">
            {/* Guest Header */}
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-sm font-bold text-primary">
                  {guest.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-gray-900 truncate">{guest.name}</p>
                    {guest.vip && (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold rounded-lg bg-amber-100 text-amber-700">
                        <Star size={8} className="fill-amber-400" /> VIP
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500">{guest.id}</p>
                </div>
              </div>
            </div>

            <div className="p-5">
              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Mail size={12} className="text-gray-400" />
                  <span className="truncate">{guest.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Phone size={12} className="text-gray-400" />
                  <span>{guest.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <MapPin size={12} className="text-gray-400" />
                  <span>{guest.location}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
                <div className="text-center">
                  <p className="text-base font-bold text-gray-900">{guest.stays}</p>
                  <p className="text-[10px] text-gray-500">Stays</p>
                </div>
                <div className="text-center border-x border-gray-200">
                  <p className="text-base font-bold text-primary">₹{guest.totalSpent.toLocaleString()}</p>
                  <p className="text-[10px] text-gray-500">Spent</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-0.5">
                    {Array.from({ length: guest.rating }).map((_, i) => (
                      <Star key={i} size={10} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-500 mt-0.5">{guest.rating}/5</p>
                </div>
              </div>

              <p className="text-[11px] text-gray-400 mb-3">Last stay: {guest.lastStay}</p>

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button onClick={() => openEdit(guest)} className="flex-1 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 transition-colors flex items-center justify-center gap-1.5">
                  <Pencil size={12} /> Edit
                </button>
                <button onClick={() => setDeleteConfirm(guest.id)} className="py-2 px-3 rounded-lg bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-600 transition-colors flex items-center justify-center">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-lg sm:mx-4 max-h-[92vh] overflow-y-auto safe-area-bottom" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{editingId ? 'Edit Guest' : 'New Guest'}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{editingId ? 'Update guest details' : 'Add a new guest to directory'}</p>
              </div>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Name *</label>
                  <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Email *</label>
                  <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Phone</label>
                  <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Location</label>
                  <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                    className="w-full px-4 py-3 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="City, Country" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Stays</label>
                  <input type="number" min="0" value={form.stays} onChange={e => setForm({ ...form, stays: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Total Spent (₹)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                    <input type="number" min="0" value={form.totalSpent} onChange={e => setForm({ ...form, totalSpent: Number(e.target.value) })}
                      className="w-full pl-8 pr-4 py-3 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Rating</label>
                  <select value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-all appearance-none">
                    <option value={5}>5</option><option value={4}>4</option><option value={3}>3</option><option value={2}>2</option><option value={1}>1</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.vip} onChange={e => setForm({ ...form, vip: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20" />
                  <div>
                    <span className="text-sm font-medium text-gray-900">VIP Guest</span>
                    <p className="text-[11px] text-gray-500">Mark as a VIP for priority handling</p>
                  </div>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm">
                  {editingId ? 'Update' : 'Add'} Guest
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
            <h3 className="font-bold text-gray-900 mb-1 text-center">Delete Guest?</h3>
            <p className="text-sm text-gray-500 mb-5 text-center">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button onClick={() => { deleteGuest(deleteConfirm); setDeleteConfirm(null) }} className="flex-1 py-2.5 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all shadow-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
