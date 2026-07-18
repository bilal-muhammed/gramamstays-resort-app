'use client'

import { useState } from 'react'
import { useAdminData } from '@/context/admin-data'
import { useToast } from '@/context/toast'
import { Search, Plus, Pencil, Trash2, X, Star, Users } from 'lucide-react'
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Guests</h2>
          <p className="text-xs text-gray-500">{filtered.length} guest{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openAdd} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors min-h-[44px]">
          <Plus size={15} /> Add Guest
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={() => setShowVipOnly(!showVipOnly)}
          className={`px-4 py-3 rounded-lg text-xs font-semibold border transition-colors min-h-[44px] ${showVipOnly ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 active:bg-gray-100'}`}>
          <Star size={12} className="inline mr-1" />VIP Only
        </button>
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search guests..."
            className="w-full pl-9 pr-3 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
      </div>

      {/* Guest Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="sm:col-span-2 lg:col-span-3 bg-white rounded-xl border border-gray-200 p-10 text-center">
            <Users size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-500">No guests found</p>
            <p className="text-xs text-gray-400 mt-1">{searchQuery ? 'Try a different search' : 'Click "Add Guest" to get started'}</p>
          </div>
        ) : filtered.map(guest => (
          <div key={guest.id} className="bg-white rounded-xl border border-gray-200 p-5 relative group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                  {guest.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{guest.name}</p>
                  <p className="text-[11px] text-gray-400">{guest.id}</p>
                </div>
              </div>
              {guest.vip && <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-600 border border-amber-200 shrink-0 ml-2">VIP</span>}
            </div>
            <div className="space-y-1.5 text-xs text-gray-500 mb-3">
              <p className="truncate">{guest.email}</p>
              <p>{guest.phone}</p>
              <p>{guest.location}</p>
            </div>
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="text-gray-400">{guest.stays} stay{guest.stays !== 1 ? 's' : ''}</span>
              <span className="font-semibold text-gray-900">${guest.totalSpent.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: guest.rating }).map((_, i) => <Star key={i} size={12} className="text-amber-400 fill-amber-400" />)}
              </div>
              <span className="text-[11px] text-gray-400">Last: {guest.lastStay}</span>
            </div>
            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
              <button onClick={() => openEdit(guest)} className="flex-1 py-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-xs font-semibold text-gray-600 transition-colors min-h-[44px] flex items-center justify-center"><Pencil size={12} className="inline mr-1" />Edit</button>
              <button onClick={() => setDeleteConfirm(guest.id)} className="py-2.5 px-3 rounded-lg bg-red-50 hover:bg-red-100 active:bg-red-200 text-xs font-semibold text-red-600 transition-colors min-h-[44px] flex items-center justify-center"><Trash2 size={12} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg sm:mx-4 max-h-[92vh] overflow-y-auto safe-area-bottom" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white z-10 px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">{editingId ? 'Edit Guest' : 'Add Guest'}</h3>
              <button onClick={() => setShowForm(false)} className="p-2.5 rounded-lg hover:bg-gray-100 min-w-[44px] min-h-[44px] flex items-center justify-center"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1.5">Name *</label>
                  <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1.5">Email *</label>
                  <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1.5">Phone</label>
                  <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1.5">Location</label>
                  <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="City, Country" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Stays</label>
                  <input type="number" min="0" value={form.stays} onChange={e => setForm({ ...form, stays: Number(e.target.value) })}
                    className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Total Spent ($)</label>
                  <input type="number" min="0" value={form.totalSpent} onChange={e => setForm({ ...form, totalSpent: Number(e.target.value) })}
                    className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Rating</label>
                  <select value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })}
                    className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-gray-900">
                    <option value={5}>5</option><option value={4}>4</option><option value={3}>3</option><option value={2}>2</option><option value={1}>1</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2.5 cursor-pointer py-2">
                  <input type="checkbox" checked={form.vip} onChange={e => setForm({ ...form, vip: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20" />
                  <span className="text-sm text-gray-700">VIP Guest</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2 pb-1">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 min-h-[44px]">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 min-h-[44px]">{editingId ? 'Update' : 'Add'} Guest</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-sm sm:mx-4 max-h-[90vh] overflow-y-auto safe-area-bottom" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-gray-900 mb-2">Delete Guest?</h3>
            <p className="text-sm text-gray-500 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 min-h-[44px]">Cancel</button>
              <button onClick={() => { deleteGuest(deleteConfirm); setDeleteConfirm(null) }} className="flex-1 py-3 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 min-h-[44px]">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
