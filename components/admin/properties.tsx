'use client'

import { useState } from 'react'
import { useAdminData } from '@/context/admin-data'
import { useToast } from '@/context/toast'
import { Search, Plus, Pencil, Trash2, X, Home, MapPin, DollarSign, Star } from 'lucide-react'
import type { Property } from '@/types/admin'

const statusColor: Record<string, string> = {
  'Active': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'Inactive': 'bg-gray-100 text-gray-500 border border-gray-200',
  'Maintenance': 'bg-amber-50 text-amber-700 border border-amber-200',
}

const statusDot: Record<string, string> = {
  'Active': 'bg-emerald-500',
  'Inactive': 'bg-gray-400',
  'Maintenance': 'bg-amber-500',
}

const emptyProperty = { name: '', description: '', price: 0, status: 'Active', amenities: '', image: '' }

export function AdminProperties() {
  const { properties, addProperty, updateProperty, deleteProperty } = useAdminData()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyProperty)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const filtered = properties.filter(p => {
    return p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.amenities.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const openAdd = () => { setEditingId(null); setForm(emptyProperty); setShowForm(true) }
  const openEdit = (p: Property) => { setEditingId(p.id); setForm({ name: p.name, description: p.description, price: p.price, status: p.status, amenities: p.amenities, image: p.image || '' }); setShowForm(true) }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      updateProperty(editingId, form)
      toast('success', 'Property updated')
    } else {
      addProperty(form)
      toast('success', 'Property added')
    }
    setShowForm(false); setEditingId(null); setForm(emptyProperty)
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Properties</h2>
          <p className="text-xs text-gray-500 mt-0.5">{filtered.length} of {properties.length} properties</p>
        </div>
        <button onClick={openAdd} className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all min-h-[44px] shadow-sm">
          <Plus size={16} /> Add Property
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search properties..."
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
      </div>

      {/* Property Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="sm:col-span-2 lg:col-span-3 bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Home size={24} className="text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">No properties found</p>
            <p className="text-xs text-gray-500 mb-4">{searchQuery ? 'Try a different search' : 'Add your first property'}</p>
            {!searchQuery && (
              <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all">
                <Plus size={14} /> Add Property
              </button>
            )}
          </div>
        ) : filtered.map(property => (
          <div key={property.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-all group">
            {/* Property Header */}
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                    <Home size={20} className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900">{property.name}</p>
                    <p className="text-[11px] text-gray-400">{property.id}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded-lg ${statusColor[property.status]}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusDot[property.status]}`} />
                  {property.status}
                </span>
              </div>
            </div>

            <div className="p-5">
              {/* Description */}
              <p className="text-xs text-gray-600 mb-3 line-clamp-2">{property.description}</p>

              {/* Price */}
              <div className="flex items-center gap-2 mb-3">
                <DollarSign size={14} className="text-emerald-600" />
                <span className="text-lg font-bold text-gray-900">₹{property.price.toLocaleString()}</span>
                <span className="text-xs text-gray-500">/night</span>
              </div>

              {/* Amenities */}
              {property.amenities && (
                <div className="mb-4">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Amenities</p>
                  <p className="text-xs text-gray-600">{property.amenities}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button onClick={() => openEdit(property)} className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 transition-colors flex items-center justify-center gap-1.5">
                  <Pencil size={12} /> Edit
                </button>
                <button onClick={() => setDeleteConfirm(property.id)} className="py-2.5 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-600 transition-colors flex items-center justify-center">
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
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg sm:mx-4 max-h-[92vh] overflow-y-auto safe-area-bottom" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{editingId ? 'Edit Property' : 'New Property'}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{editingId ? 'Update property details' : 'Add a new property'}</p>
              </div>
              <button onClick={() => setShowForm(false)} className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Property Name *</label>
                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="e.g. Chedi, British Bungalow" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none h-24 transition-all" placeholder="Describe the property..." />
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
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-all appearance-none">
                    <option>Active</option><option>Inactive</option><option>Maintenance</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Amenities</label>
                <input type="text" value={form.amenities} onChange={e => setForm({ ...form, amenities: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="e.g. Pool, Garden, River View" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Image URL</label>
                <input type="text" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="https://..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-3.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm">
                  {editingId ? 'Update' : 'Add'} Property
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
            <h3 className="font-bold text-gray-900 mb-1 text-center">Delete Property?</h3>
            <p className="text-sm text-gray-500 mb-5 text-center">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button onClick={() => { deleteProperty(deleteConfirm); setDeleteConfirm(null) }} className="flex-1 py-3.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all shadow-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
