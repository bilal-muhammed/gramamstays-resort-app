'use client'

import { useState } from 'react'
import { useAdminData } from '@/context/admin-data'
import { useToast } from '@/context/toast'
import { Search, Plus, Pencil, Trash2, X, Star, MessageSquareQuote } from 'lucide-react'
import { FormSection, FormField, FormRow, FormInput, FormSelect, FormTextarea, FormSubmit } from './form-parts'
import { AppSheet } from './app-sheet'
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
  const [submitting, setSubmitting] = useState(false)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    if (editingId) {
      await updateTestimonial(editingId, form)
      toast('success', 'Testimonial updated')
    } else {
      await addTestimonial(form)
      toast('success', 'Testimonial added')
    }
    setShowForm(false); setEditingId(null); setForm(emptyTestimonial)
    setSubmitting(false)
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

      <AppSheet open={showForm} onClose={() => setShowForm(false)} title={editingId ? 'Edit Testimonial' : 'New Testimonial'} subtitle={editingId ? 'Update testimonial details' : 'Add a new testimonial'}>
        <form onSubmit={handleSubmit} className="p-4 pb-6 space-y-3 safe-area-bottom">
          <FormSection title="Guest Info" index={0}>
            <FormField label="Name *" index={0}>
              <FormInput value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Rajesh Kumar" />
            </FormField>
            <FormRow>
              <FormField label="Role" index={1}>
                <FormInput value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="e.g. Business Traveler" />
              </FormField>
              <FormField label="Location" index={2}>
                <FormInput value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. Bangalore" />
              </FormField>
            </FormRow>
            <FormRow>
              <FormField label="Rating" index={3}>
                <FormSelect value={String(form.rating)} onChange={e => setForm({ ...form, rating: Number(e.target.value) })}>
                  <option value="5">5 Stars</option><option value="4">4 Stars</option><option value="3">3 Stars</option><option value="2">2 Stars</option><option value="1">1 Star</option>
                </FormSelect>
              </FormField>
              <FormField label="Status" index={4}>
                <FormSelect value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option>Active</option><option>Inactive</option>
                </FormSelect>
              </FormField>
            </FormRow>
          </FormSection>

          <FormSection title="Review" index={1}>
            <FormField label="Testimonial *" index={0}>
              <FormTextarea value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} required placeholder="Write the testimonial..." rows={3} />
            </FormField>
            <FormField label="Avatar URL" index={1}>
              <FormInput type="url" value={form.avatar} onChange={e => setForm({ ...form, avatar: e.target.value })} placeholder="https://example.com/avatar.jpg" />
            </FormField>
            <FormField label="Sort Order" index={2}>
              <FormInput type="number" min={0} value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} placeholder="0" />
            </FormField>
          </FormSection>

          <div className="flex gap-2 pt-2">
            <FormSubmit type="button" onClick={() => setShowForm(false)} disabled={submitting} color="primary">
              Cancel
            </FormSubmit>
            <FormSubmit loading={submitting} disabled={submitting}>
              {editingId ? 'Update' : 'Add'} Testimonial
            </FormSubmit>
          </div>
        </form>
      </AppSheet>

      <AppSheet open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Testimonial?" subtitle="This action cannot be undone.">
        <div className="p-4 pb-6 safe-area-bottom">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <Trash2 size={20} className="text-red-600" />
          </div>
          <div className="flex gap-2">
            <FormSubmit type="button" onClick={() => setDeleteConfirm(null)} disabled={false} color="primary">
              Cancel
            </FormSubmit>
            <FormSubmit type="button" onClick={() => { deleteTestimonial(deleteConfirm); setDeleteConfirm(null) }} disabled={false} color="red">
              Delete
            </FormSubmit>
          </div>
        </div>
      </AppSheet>
    </div>
  )
}
