'use client'

import { useState } from 'react'
import { useAdminData } from '@/context/admin-data'
import { useToast } from '@/context/toast'
import { Search, Plus, Pencil, Trash2, X, Wrench, CheckCircle, Eye, Lock, BedDouble, MapPin, Users } from 'lucide-react'
import type { Room } from '@/types/admin'

const statusIcon: Record<string, typeof CheckCircle> = {
  'Occupied': Eye, 'Available': CheckCircle, 'Maintenance': Wrench, 'Reserved': Lock,
}

const statusColor: Record<string, string> = {
  'Occupied': 'bg-blue-50 text-blue-700 border border-blue-200',
  'Available': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'Maintenance': 'bg-amber-50 text-amber-700 border border-amber-200',
  'Reserved': 'bg-purple-50 text-purple-700 border border-purple-200',
}

const statusBg: Record<string, string> = {
  'Occupied': 'bg-blue-500', 'Available': 'bg-emerald-500', 'Maintenance': 'bg-amber-500', 'Reserved': 'bg-purple-500',
}

const emptyRoom = { type: 'Garden Suite', floor: '1st', status: 'Available' as const, guest: '-', price: 250, amenities: '', until: '', from: '', note: '' }

export function AdminRooms() {
  const { rooms, addRoom, updateRoom, deleteRoom } = useAdminData()
  const { toast } = useToast()
  const [activeType, setActiveType] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyRoom)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const types = ['All', 'Presidential Suite', 'Villa Deluxe', 'Garden Suite']

  const filtered = rooms.filter(r => {
    const matchType = activeType === 'All' || r.type === activeType
    const matchSearch = r.id.includes(searchQuery) || r.type.toLowerCase().includes(searchQuery.toLowerCase()) || r.guest.toLowerCase().includes(searchQuery.toLowerCase())
    return matchType && matchSearch
  })

  const summary = [
    { label: 'Total', value: rooms.length, color: 'text-gray-900', bg: 'bg-gray-100' },
    { label: 'Occupied', value: rooms.filter(r => r.status === 'Occupied').length, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Available', value: rooms.filter(r => r.status === 'Available').length, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Maintenance', value: rooms.filter(r => r.status === 'Maintenance').length, color: 'text-amber-600', bg: 'bg-amber-100' },
  ]

  const openAdd = () => { setEditingId(null); setForm(emptyRoom); setShowForm(true) }
  const openEdit = (r: Room) => { setEditingId(r.id); setForm({ type: r.type, floor: r.floor, status: r.status, guest: r.guest, price: r.price, amenities: r.amenities, until: r.until || '', from: r.from || '', note: r.note || '' }); setShowForm(true) }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      updateRoom(editingId, form)
      toast('success', 'Room updated')
    } else {
      addRoom(form)
      toast('success', 'Room added')
    }
    setShowForm(false); setEditingId(null); setForm(emptyRoom)
  }

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {summary.map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                <BedDouble size={18} className={s.color} />
              </div>
              <div>
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-[11px] text-gray-500">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Rooms</h2>
          <p className="text-xs text-gray-500 mt-0.5">{filtered.length} of {rooms.length} rooms</p>
        </div>
        <button onClick={openAdd} className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all min-h-[44px] shadow-sm">
          <Plus size={16} /> Add Room
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1 overflow-x-auto no-scrollbar flex-1">
            {types.map(t => (
              <button key={t} onClick={() => setActiveType(t)}
                className={`px-3.5 py-2.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap min-h-[40px] ${
                  activeType === t 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                }`}>
                {t}
              </button>
            ))}
          </div>
          <div className="relative sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search rooms..."
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
        </div>
      </div>

      {/* Room Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="sm:col-span-2 lg:col-span-3 bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <BedDouble size={24} className="text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">No rooms found</p>
            <p className="text-xs text-gray-500 mb-4">{searchQuery ? 'Try a different search' : 'Add your first room'}</p>
            {!searchQuery && (
              <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all">
                <Plus size={14} /> Add Room
              </button>
            )}
          </div>
        ) : filtered.map(room => {
          const Icon = statusIcon[room.status]
          return (
            <div key={room.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-all group">
              {/* Room Header */}
              <div className={`h-2 ${statusBg[room.status]}`} />
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-base font-bold text-gray-900">Room #{room.id}</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-lg ${statusColor[room.status]}`}>
                        <Icon size={10} />
                        {room.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{room.type}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={13} className="text-gray-400" />
                    <span>Floor {room.floor}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users size={13} className="text-gray-400" />
                    <span>{room.guest}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-gray-900">₹{room.price.toLocaleString()}</span>
                    <span className="text-xs text-gray-500">/night</span>
                  </div>
                </div>

                {room.amenities && (
                  <div className="mb-4">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1.5">Amenities</p>
                    <p className="text-xs text-gray-600">{room.amenities}</p>
                  </div>
                )}

                {(room.until || room.from || room.note) && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-1">
                    {room.from && <p className="text-[11px] text-gray-500">From: {room.from}</p>}
                    {room.until && <p className="text-[11px] text-gray-500">Until: {room.until}</p>}
                    {room.note && <p className="text-[11px] text-amber-600 font-medium">{room.note}</p>}
                  </div>
                )}

                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <button onClick={() => openEdit(room)} className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 transition-colors flex items-center justify-center gap-1.5">
                    <Pencil size={12} /> Edit
                  </button>
                  <button onClick={() => setDeleteConfirm(room.id)} className="py-2.5 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-600 transition-colors flex items-center justify-center">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg sm:mx-4 max-h-[92vh] overflow-y-auto safe-area-bottom" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{editingId ? 'Edit Room' : 'New Room'}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{editingId ? 'Update room details' : 'Add a new room to inventory'}</p>
              </div>
              <button onClick={() => setShowForm(false)} className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Room Number *</label>
                  <input type="text" required value={form.id} onChange={e => setForm({ ...form, id: e.target.value } as any)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="e.g. 301" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Type *</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-all appearance-none">
                    <option>Presidential Suite</option>
                    <option>Villa Deluxe</option>
                    <option>Garden Suite</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Floor</label>
                  <select value={form.floor} onChange={e => setForm({ ...form, floor: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-all appearance-none">
                    <option>1st</option><option>2nd</option><option>3rd</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Room['status'] })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-all appearance-none">
                    <option>Available</option><option>Occupied</option><option>Maintenance</option><option>Reserved</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Price (₹/night) *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                    <input type="number" min="0" required value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                      className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Guest</label>
                  <input type="text" value={form.guest} onChange={e => setForm({ ...form, guest: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="-" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Amenities</label>
                <input type="text" value={form.amenities} onChange={e => setForm({ ...form, amenities: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="King Bed, Ocean View, etc." />
              </div>
              {form.status === 'Maintenance' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Maintenance Note</label>
                  <input type="text" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-3.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm">
                  {editingId ? 'Update' : 'Add'} Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-t-3xl sm:rounded-2xl p-6 w-full sm:max-w-sm sm:mx-4 safe-area-bottom" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={20} className="text-red-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1 text-center">Delete Room?</h3>
            <p className="text-sm text-gray-500 mb-5 text-center">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button onClick={() => { deleteRoom(deleteConfirm); setDeleteConfirm(null) }} className="flex-1 py-3.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all shadow-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
