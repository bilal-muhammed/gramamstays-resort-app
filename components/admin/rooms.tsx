'use client'

import { useState } from 'react'
import { useAdminData } from '@/context/admin-data'
import { useToast } from '@/context/toast'
import { Search, Plus, Pencil, Trash2, X, Wrench, CheckCircle, Eye, Lock, BedDouble } from 'lucide-react'
import type { Room } from '@/types/admin'

const statusIcon: Record<string, typeof CheckCircle> = {
  'Occupied': Eye, 'Available': CheckCircle, 'Maintenance': Wrench, 'Reserved': Lock,
}

const statusColor: Record<string, string> = {
  'Occupied': 'bg-blue-50 text-blue-600 border-blue-200',
  'Available': 'bg-emerald-50 text-emerald-600 border-emerald-200',
  'Maintenance': 'bg-amber-50 text-amber-600 border-amber-200',
  'Reserved': 'bg-purple-50 text-purple-600 border-purple-200',
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
    { label: 'Total', value: rooms.length, color: 'text-gray-900' },
    { label: 'Occupied', value: rooms.filter(r => r.status === 'Occupied').length, color: 'text-blue-600' },
    { label: 'Available', value: rooms.filter(r => r.status === 'Available').length, color: 'text-emerald-600' },
    { label: 'Maintenance', value: rooms.filter(r => r.status === 'Maintenance').length, color: 'text-amber-600' },
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
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {summary.map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-3 text-center">
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-gray-900">Rooms</h2>
        <button onClick={openAdd} className="flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors min-h-[44px]">
          <Plus size={15} /> Add Room
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 overflow-x-auto no-scrollbar">
          {types.map(t => (
            <button key={t} onClick={() => setActiveType(t)}
              className={`px-3.5 py-2.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap min-h-[40px] ${activeType === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700 active:bg-white/50'}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search rooms..."
            className="w-full pl-9 pr-3 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
      </div>

      {/* Room Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="sm:col-span-2 lg:col-span-3 bg-white rounded-xl border border-gray-200 p-10 text-center">
            <BedDouble size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-500">No rooms found</p>
            <p className="text-xs text-gray-400 mt-1">{searchQuery ? 'Try a different search' : 'Click "Add Room" to get started'}</p>
          </div>
        ) : filtered.map(room => {
          const Icon = statusIcon[room.status]
          return (
            <div key={room.id} className="bg-white rounded-xl border border-gray-200 p-5 relative group">
              <div className="flex items-start justify-between mb-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-gray-900">Room #{room.id}</p>
                  <p className="text-xs text-gray-500">{room.type}</p>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${statusColor[room.status]} shrink-0 ml-2`}>
                  <Icon size={10} className="inline mr-1" />{room.status}
                </span>
              </div>
              <div className="space-y-1.5 text-xs text-gray-500 mb-4">
                <p>Floor: {room.floor}</p>
                <p>Guest: {room.guest}</p>
                <p className="font-semibold text-gray-900">${room.price}/night</p>
                {room.until && <p className="text-gray-400">Until: {room.until}</p>}
                {room.from && <p className="text-gray-400">From: {room.from}</p>}
                {room.note && <p className="text-amber-600">{room.note}</p>}
              </div>
              <p className="text-[11px] text-gray-400 mb-3">{room.amenities}</p>
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button onClick={() => openEdit(room)} className="flex-1 py-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-xs font-semibold text-gray-600 transition-colors min-h-[44px] flex items-center justify-center"><Pencil size={12} className="inline mr-1" />Edit</button>
                <button onClick={() => setDeleteConfirm(room.id)} className="py-2.5 px-3 rounded-lg bg-red-50 hover:bg-red-100 active:bg-red-200 text-xs font-semibold text-red-600 transition-colors min-h-[44px] flex items-center justify-center"><Trash2 size={12} /></button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg sm:mx-4 max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white z-10 px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">{editingId ? 'Edit Room' : 'Add Room'}</h3>
              <button onClick={() => setShowForm(false)} className="p-2.5 rounded-lg hover:bg-gray-100 min-w-[44px] min-h-[44px] flex items-center justify-center"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Room Number *</label>
                  <input type="text" required value={form.id} onChange={e => setForm({ ...form, id: e.target.value } as any)}
                    className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="e.g. 301" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Type *</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white">
                    <option>Presidential Suite</option>
                    <option>Villa Deluxe</option>
                    <option>Garden Suite</option>
                  </select>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Floor</label>
                  <select value={form.floor} onChange={e => setForm({ ...form, floor: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white">
                    <option>1st</option><option>2nd</option><option>3rd</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Room['status'] })}
                    className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white">
                    <option>Available</option><option>Occupied</option><option>Maintenance</option><option>Reserved</option>
                  </select>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Price ($/night) *</label>
                  <input type="number" min="0" required value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Guest</label>
                  <input type="text" value={form.guest} onChange={e => setForm({ ...form, guest: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="-" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Amenities</label>
                <input type="text" value={form.amenities} onChange={e => setForm({ ...form, amenities: e.target.value })}
                  className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="King Bed, Ocean View, etc." />
              </div>
              {form.status === 'Maintenance' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Maintenance Note</label>
                  <input type="text" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
              )}
              <div className="flex gap-3 pt-2 pb-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 min-h-[48px]">Cancel</button>
                <button type="submit" className="flex-1 py-3.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 min-h-[48px]">{editingId ? 'Update' : 'Add'} Room</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-sm sm:mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-gray-900 mb-2">Delete Room?</h3>
            <p className="text-sm text-gray-500 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 min-h-[48px]">Cancel</button>
              <button onClick={() => { deleteRoom(deleteConfirm); setDeleteConfirm(null) }} className="flex-1 py-3.5 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 min-h-[48px]">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
