'use client'

import { useState } from 'react'
import { useAdminData } from '@/context/admin-data'
import { useToast } from '@/context/toast'
import { Search, Plus, Pencil, Trash2, X, Wrench, CheckCircle, Eye, Lock, BedDouble, MapPin, Users } from 'lucide-react'
import type { Room } from '@/types/admin'
import { AppSheet } from './app-sheet'
import { FormSection, FormField, FormRow, FormInput, FormSelect, FormTextarea, FormSubmit } from './form-parts'

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
  const { rooms, addRoom, updateRoom, deleteRoom, properties } = useAdminData()
  const { toast } = useToast()
  const [activeType, setActiveType] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyRoom)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const types = ['All', ...properties.map(p => p.name)]

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    if (editingId) {
      await updateRoom(editingId, form)
      toast('success', 'Room updated')
    } else {
      await addRoom(form)
      toast('success', 'Room added')
    }
    setShowForm(false); setEditingId(null); setForm(emptyRoom)
    setSubmitting(false)
  }

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {summary.map(s => (
          <div key={s.label} className="bg-white rounded-lg border border-gray-200 p-3">
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
        <button onClick={openAdd} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all min-h-[38px] shadow-sm">
          <Plus size={16} /> Add Room
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-2.5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1 overflow-x-auto no-scrollbar flex-1">
            {types.map(t => (
              <button key={t} onClick={() => setActiveType(t)}
                className={`px-3 py-2 text-xs font-semibold rounded-md transition-all whitespace-nowrap min-h-[36px] ${
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
              className="w-full pl-9 pr-3 py-2.5 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
        </div>
      </div>

      {/* Room Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="sm:col-span-2 lg:col-span-3 bg-white rounded-lg border border-gray-200 p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <BedDouble size={24} className="text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">No rooms found</p>
            <p className="text-xs text-gray-500 mb-4">{searchQuery ? 'Try a different search' : 'Add your first room'}</p>
            {!searchQuery && (
              <button onClick={openAdd} className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all">
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
                  <button onClick={() => openEdit(room)} className="flex-1 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 transition-colors flex items-center justify-center gap-1.5">
                    <Pencil size={12} /> Edit
                  </button>
                  <button onClick={() => setDeleteConfirm(room.id)} className="py-2 px-3 rounded-lg bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-600 transition-colors flex items-center justify-center">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add/Edit Modal */}
      <AppSheet open={showForm} onClose={() => setShowForm(false)} title={editingId ? 'Edit Room' : 'New Room'} subtitle={editingId ? 'Update room details' : 'Add a new room to inventory'}>
            <form onSubmit={handleSubmit} className="p-4 pb-6 space-y-3 safe-area-bottom">
              <FormSection title="Room Info">
                <FormRow>
                  <FormField label="Room Number *">
                    <FormInput type="text" required value={form.id} onChange={e => setForm({ ...form, id: e.target.value } as any)} placeholder="e.g. 301" />
                  </FormField>
                  <FormField label="Type *">
                    <FormSelect value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                      {properties.map(p => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                      ))}
                    </FormSelect>
                  </FormField>
                </FormRow>
                <FormRow>
                  <FormField label="Floor">
                    <FormSelect value={form.floor} onChange={e => setForm({ ...form, floor: e.target.value })}>
                      <option>1st</option><option>2nd</option><option>3rd</option>
                    </FormSelect>
                  </FormField>
                  <FormField label="Status">
                    <FormSelect value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Room['status'] })}>
                      <option>Available</option><option>Occupied</option><option>Maintenance</option><option>Reserved</option>
                    </FormSelect>
                  </FormField>
                </FormRow>
              </FormSection>

              <FormSection title="Pricing & Guest">
                <FormRow>
                  <FormField label="Price (₹/night) *">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">₹</span>
                      <FormInput type="number" min={0} required value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} className="pl-7" />
                    </div>
                  </FormField>
                  <FormField label="Guest">
                    <FormInput type="text" value={form.guest} onChange={e => setForm({ ...form, guest: e.target.value })} placeholder="-" />
                  </FormField>
                </FormRow>
                <FormField label="Amenities">
                  <FormInput type="text" value={form.amenities} onChange={e => setForm({ ...form, amenities: e.target.value })} placeholder="King Bed, Ocean View, etc." />
                </FormField>
                {form.status === 'Maintenance' && (
                  <FormField label="Maintenance Note">
                    <FormInput type="text" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
                  </FormField>
                )}
              </FormSection>

              <div className="flex gap-2 pt-2">
                <FormSubmit type="button" onClick={() => setShowForm(false)} disabled={submitting} color="primary">Cancel</FormSubmit>
                <FormSubmit loading={submitting} disabled={submitting}>{editingId ? 'Update' : 'Add'} Room</FormSubmit>
              </div>
            </form>
      </AppSheet>

      {/* Delete Confirmation */}
      <AppSheet open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Room?" subtitle="This action cannot be undone.">
        <div className="p-4 pb-6 safe-area-bottom">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <Trash2 size={20} className="text-red-600" />
          </div>
          <div className="flex gap-2">
            <FormSubmit type="button" onClick={() => setDeleteConfirm(null)} color="primary">Cancel</FormSubmit>
            <FormSubmit type="button" onClick={() => { deleteRoom(deleteConfirm!); setDeleteConfirm(null) }} color="red">Delete</FormSubmit>
          </div>
        </div>
      </AppSheet>
    </div>
  )
}
