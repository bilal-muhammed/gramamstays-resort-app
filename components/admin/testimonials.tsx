'use client'

import { useState } from 'react'
import { useAdminData } from '@/context/admin-data'
import { useToast } from '@/context/toast'
import { Search, Plus, Pencil, Trash2, X, Star, MessageSquareQuote } from 'lucide-react'
import type { Testimonial } from '@/types/admin'

const emptyTestimonial: Omit<Testimonial, 'id'> = { name: '', role: '', location: '', rating: 5, text: '', avatar: '', status: 'Active', order: 0 }

const statusColor: Record<string, string> = {
  'Active': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'Inactive': 'bg-gray-100 text-gray-500 border border-gray-200',
}

const statusDot: Record<string, string> = {
  'Active': 'bg-emerald-500',
  'Inactive': 'bg-gray-400',
}

export function AdminTestimonials() {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useAdminData()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyTestimonial)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const filtered = testimonials.filter(t => {
    return t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.location.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const openAdd = () => { setEditingId(null); setForm(emptyTestimonial); setShowForm(true) }
  const openEdit = (t: Testimonial) => {
    setEditingId(t.id)
    setForm({ name: t.name, role: t.role, location: t.location, rating: t.rating, text: t.text, avatar: t.avatar, status: t.status, order: t.order })
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      updateTestimonial(editingId, form)
      toast('success', 'Testimonial updated')
    } else {
      addTestimonial(form)
      toast('success', 'Testimonial added')
    }
    setShowForm(false); setEditingId(null); setForm(emptyTestimonial)
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Testimonials</h2>
          <p className="text-xs text-gray-500 mt-0.5">{filtered.length} of {testimonials.length} testimonials</p>
        </div>
        <button onClick={openAdd} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all min-h-[38px] shadow-sm">
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-2.5">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search testimonials..."
            className="w-full pl-9 pr-3 py-2.5 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
      </div>

      {/* Testimonials List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <MessageSquareQuote size={24} className="text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">No testimonials found</p>
            <p className="text-xs text-gray-500 mb-4">{searchQuery ? 'Try a different search' : 'Add your first testimonial'}</p>
            {!searchQuery && (
              <button onClick={openAdd} className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all">
                <Plus size={14} /> Add Testimonial
              </button>
            )}
          </div>
        ) : filtered.map(testimonial => (
          <div key={testimonial.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-all">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              {testimonial.avatar ? (
                <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-lg font-bold text-primary">{testimonial.name[0]}</span>
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-[11px] text-gray-500">{testimonial.role}{testimonial.location ? ` · ${testimonial.location}` : ''}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded-lg ${statusColor[testimonial.status]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot[testimonial.status]}`} />
                      {testimonial.status}
                    </span>
                  </div>
                </div>

                {/* Rating */}
                {testimonial.rating > 0 && (
                  <div className="flex items-center gap-0.5 mb-2">
                    {[1,2,3,4,5].map(star => (
                      <Star key={star} size={12} className={star <= testimonial.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
                    ))}
                  </div>
                )}

                {/* Text */}
                <p className="text-xs text-gray-600 line-clamp-3 mb-3">{testimonial.text}</p>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <button onClick={() => openEdit(testimonial)} className="flex-1 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 transition-colors flex items-center justify-center gap-1.5">
                    <Pencil size={12} /> Edit
                  </button>
                  <button onClick={() => setDeleteConfirm(testimonial.id)} className="py-2 px-3 rounded-lg bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-600 transition-colors flex items-center justify-center">
                    <Trash2 size={12} />
                  </button>
                </div>
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
                <h3 className="font-bold text-gray-900 text-lg">{editingId ? 'Edit Testimonial' : 'New Testimonial'}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{editingId ? 'Update testimonial details' : 'Add a new testimonial'}</p>
              </div>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Name *</label>
                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="e.g. Rajesh Kumar" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Role</label>
                  <input type="text" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                    className="w-full px-4 py-3 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="e.g. Business Traveler" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Location</label>
                  <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                    className="w-full px-4 py-3 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="e.g. Bangalore" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Rating</label>
                  <select value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-all appearance-none">
                    <option value={5}>5 Stars</option><option value={4}>4 Stars</option><option value={3}>3 Stars</option><option value={2}>2 Stars</option><option value={1}>1 Star</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                    className="w-full px-4 py-3 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-all appearance-none">
                    <option>Active</option><option>Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Testimonial *</label>
                <textarea required value={form.text} onChange={e => setForm({ ...form, text: e.target.value })}
                  className="w-full px-4 py-3 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none h-28 transition-all" placeholder="Write the testimonial..." />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Avatar URL</label>
                <input type="url" value={form.avatar} onChange={e => setForm({ ...form, avatar: e.target.value })}
                  className="w-full px-4 py-3 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="https://example.com/avatar.jpg" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Sort Order</label>
                <input type="number" min="0" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="0" />
                <p className="text-[11px] text-gray-400 mt-1">Lower numbers appear first</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm">
                  {editingId ? 'Update' : 'Add'} Testimonial
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
            <h3 className="font-bold text-gray-900 mb-1 text-center">Delete Testimonial?</h3>
            <p className="text-sm text-gray-500 mb-5 text-center">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button onClick={() => { deleteTestimonial(deleteConfirm); setDeleteConfirm(null) }} className="flex-1 py-2.5 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all shadow-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
