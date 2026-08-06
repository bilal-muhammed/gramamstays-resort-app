'use client'

import { useState, useRef } from 'react'
import { useAdminData } from '@/context/admin-data'
import { useToast } from '@/context/toast'
import { Search, Plus, Pencil, Trash2, X, Home, DollarSign, Star, Upload, Loader2, ImageIcon } from 'lucide-react'
import { AppSheet } from './app-sheet'
import { FormSection, FormField, FormRow, FormInput, FormSelect, FormTextarea, FormSubmit } from './form-parts'
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

const emptyProperty = { name: '', tagline: '', description: '', price: 0, originalPrice: 0, status: 'Active', amenities: '', features: '', specs: '', badge: '', rating: 0, reviews: 0, image: '', gallery: '[]' }

export function AdminProperties() {
  const { properties, addProperty, updateProperty, deleteProperty } = useAdminData()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyProperty)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getGallery = (): string[] => {
    try { return JSON.parse(form.gallery) } catch { return [] }
  }

  const filtered = properties.filter(p => {
    return p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.amenities.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const openAdd = () => { setEditingId(null); setForm(emptyProperty); setGalleryPreviews([]); setShowForm(true) }
  const openEdit = (p: Property) => {
    setEditingId(p.id)
    const gallery = (p as any).gallery || '[]'
    setForm({
      name: p.name,
      tagline: (p as any).tagline || '',
      description: p.description,
      price: p.price,
      originalPrice: (p as any).originalPrice || 0,
      status: p.status,
      amenities: p.amenities,
      features: (p as any).features || '',
      specs: (p as any).specs || '',
      badge: (p as any).badge || '',
      rating: (p as any).rating || 0,
      reviews: (p as any).reviews || 0,
      image: p.image || '',
      gallery,
    })
    try { setGalleryPreviews(JSON.parse(gallery)) } catch { setGalleryPreviews([]) }
    setShowForm(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const currentGallery = getGallery()
    const newPreviews = [...galleryPreviews]

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (!file.type.startsWith('image/')) {
        toast('error', `${file.name} is not an image`)
        continue
      }
      if (file.size > 5 * 1024 * 1024) {
        toast('error', `${file.name} must be under 5MB`)
        continue
      }

      const preview = URL.createObjectURL(file)
      newPreviews.push(preview)
      setGalleryPreviews([...newPreviews])

      try {
        const formData = new FormData()
        formData.append('file', file)
        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        const data = await res.json()
        if (res.ok && data.url) {
          currentGallery.push(data.url)
          setForm(prev => ({ ...prev, gallery: JSON.stringify(currentGallery), image: currentGallery[0] || '' }))
        } else {
          toast('error', data.error || `Failed to upload ${file.name}`)
        }
      } catch {
        toast('error', `Failed to upload ${file.name}`)
      }
    }

    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeGalleryImage = (index: number) => {
    const currentGallery = getGallery()
    currentGallery.splice(index, 1)
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index))
    setForm(prev => ({
      ...prev,
      gallery: JSON.stringify(currentGallery),
      image: currentGallery[0] || ''
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    const data = { ...form, image: getGallery()[0] || form.image }
    if (editingId) {
      await updateProperty(editingId, data)
      toast('success', 'Property updated')
    } else {
      await addProperty(data)
      toast('success', 'Property added')
    }
    setShowForm(false); setEditingId(null); setForm(emptyProperty); setGalleryPreviews([])
    setSubmitting(false)
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Properties</h2>
          <p className="text-xs text-gray-500 mt-0.5">{filtered.length} of {properties.length} properties</p>
        </div>
        <button onClick={openAdd} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all min-h-[38px] shadow-sm">
          <Plus size={16} /> Add Property
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-2.5">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search properties..."
            className="w-full pl-9 pr-3 py-2.5 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
      </div>

      {/* Property Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="sm:col-span-2 lg:col-span-3 bg-white rounded-lg border border-gray-200 p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Home size={24} className="text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">No properties found</p>
            <p className="text-xs text-gray-500 mb-4">{searchQuery ? 'Try a different search' : 'Add your first property'}</p>
            {!searchQuery && (
              <button onClick={openAdd} className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all">
                <Plus size={14} /> Add Property
              </button>
            )}
          </div>
        ) : filtered.map(property => (
          <div key={property.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-all group">
            {/* Property Image */}
            {property.image ? (
              <div className="relative h-44 overflow-hidden">
                <img src={property.image} alt={property.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                {(property as any).gallery && (() => {
                  try { const g = JSON.parse((property as any).gallery); return g.length > 1 } catch { return false }
                })() && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/60 rounded-md text-[10px] text-white font-medium">
                    <ImageIcon size={10} />
                    {(() => { try { return JSON.parse((property as any).gallery).length } catch { return 0 } })()} photos
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                    <Home size={20} className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900">{property.name}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="p-5">
              {/* Name + Status */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900">{property.name}</p>
                  {(property as any).tagline && <p className="text-[11px] text-gray-400 italic">{(property as any).tagline}</p>}
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded-lg ${statusColor[property.status]}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusDot[property.status]}`} />
                    {property.status}
                  </span>
                  {(property as any).badge && (
                    <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-secondary/10 text-secondary">{(property as any).badge}</span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-600 mb-3 line-clamp-2">{property.description}</p>

              {/* Price */}
              <div className="flex items-center gap-2 mb-3">
                <DollarSign size={14} className="text-emerald-600" />
                <span className="text-lg font-bold text-gray-900">₹{property.price.toLocaleString()}</span>
                {(property as any).originalPrice ? <span className="text-xs text-gray-400 line-through">₹{(property as any).originalPrice.toLocaleString()}</span> : null}
                <span className="text-xs text-gray-500">/night</span>
              </div>

              {/* Rating & Reviews */}
              {((property as any).rating || (property as any).reviews) && (
                <div className="flex items-center gap-3 mb-3">
                  {(property as any).rating ? <div className="flex items-center gap-1"><Star size={12} className="fill-amber-400 text-amber-400" /><span className="text-xs font-bold text-gray-900">{(property as any).rating}</span></div> : null}
                  {(property as any).reviews ? <span className="text-[11px] text-gray-400">{(property as any).reviews} reviews</span> : null}
                </div>
              )}

              {/* Amenities */}
              {property.amenities && (
                <div className="mb-4">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Amenities</p>
                  <p className="text-xs text-gray-600">{property.amenities}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button onClick={() => openEdit(property)} className="flex-1 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 transition-colors flex items-center justify-center gap-1.5">
                  <Pencil size={12} /> Edit
                </button>
                <button onClick={() => setDeleteConfirm(property.id)} className="py-2 px-3 rounded-lg bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-600 transition-colors flex items-center justify-center">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <AppSheet open={showForm} onClose={() => setShowForm(false)} title={editingId ? 'Edit Property' : 'New Property'} subtitle={editingId ? 'Update property details' : 'Add a new property'}>
            <form onSubmit={handleSubmit} className="p-4 pb-6 space-y-3 safe-area-bottom">
              {/* Images */}
              <FormSection title="Images">
                {galleryPreviews.length > 0 ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-4 gap-1.5">
                      {galleryPreviews.map((preview, i) => (
                        <div key={i} className="relative aspect-square rounded-md overflow-hidden border border-gray-200 group">
                          <img src={preview} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => removeGalleryImage(i)} className="absolute top-0.5 right-0.5 p-0.5 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors opacity-0 group-hover:opacity-100">
                            <X size={8} />
                          </button>
                          {i === 0 && <div className="absolute bottom-0.5 left-0.5 px-1 py-0.5 bg-primary rounded text-[7px] text-white font-semibold">COVER</div>}
                        </div>
                      ))}
                      {uploading && <div className="aspect-square rounded-md border border-gray-200 flex items-center justify-center bg-gray-50"><Loader2 size={16} className="text-primary animate-spin" /></div>}
                    </div>
                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                      className="w-full py-1.5 border border-dashed border-gray-300 rounded-md text-[10px] font-medium text-gray-600 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-1">
                      <Upload size={10} /> Add more
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                    className="w-full h-24 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-1 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer disabled:opacity-50">
                    {uploading ? <Loader2 size={18} className="text-primary animate-spin" /> : (
                      <>
                        <Upload size={16} className="text-gray-400" />
                        <span className="text-[10px] font-medium text-gray-500">Click to upload — Max 5MB each</span>
                      </>
                    )}
                  </button>
                )}
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple onChange={handleImageUpload} className="hidden" />
              </FormSection>

              {/* Basic Info */}
              <FormSection title="Basic Info">
                <FormField label="Name *">
                  <FormInput type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Property name" />
                </FormField>
                <FormField label="Tagline">
                  <FormInput type="text" value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })} placeholder="e.g. Nature's Embrace" />
                </FormField>
                <FormField label="Description">
                  <FormTextarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the property..." rows={3} className="h-16" />
                </FormField>
              </FormSection>

              {/* Pricing & Status */}
              <FormSection title="Pricing & Status">
                <FormRow>
                  <FormField label="Price (₹/night) *">
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                      <FormInput type="number" min={0} required value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} className="pl-6" />
                    </div>
                  </FormField>
                  <FormField label="Original Price (₹)">
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                      <FormInput type="number" min={0} value={form.originalPrice} onChange={e => setForm({ ...form, originalPrice: Number(e.target.value) })} className="pl-6" />
                    </div>
                  </FormField>
                </FormRow>
                <FormRow>
                  <FormField label="Status">
                    <FormSelect value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                      <option>Active</option><option>Inactive</option><option>Maintenance</option>
                    </FormSelect>
                  </FormField>
                  <FormField label="Badge">
                    <FormSelect value={form.badge} onChange={e => setForm({ ...form, badge: e.target.value })}>
                      <option value="">None</option><option>Most Popular</option><option>Best Value</option><option>Exclusive</option>
                    </FormSelect>
                  </FormField>
                </FormRow>
                <FormRow>
                  <FormField label="Rating">
                    <FormInput type="number" min={0} max={5} step={0.1} value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })} placeholder="e.g. 4.9" />
                  </FormField>
                  <FormField label="Reviews Count">
                    <FormInput type="number" min={0} value={form.reviews} onChange={e => setForm({ ...form, reviews: Number(e.target.value) })} placeholder="e.g. 128" />
                  </FormField>
                </FormRow>
              </FormSection>

              {/* Details */}
              <FormSection title="Details" defaultOpen={false}>
                <FormField label="Features (comma-separated)">
                  <FormInput type="text" value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} placeholder="River View, Kayak Access, Private Deck" />
                </FormField>
                <FormField label="Specs (JSON)">
                  <FormInput type="text" value={form.specs} onChange={e => setForm({ ...form, specs: e.target.value })} placeholder='{"size":"45 m²","guests":"2"}' />
                </FormField>
                <FormField label="Amenities">
                  <FormInput type="text" value={form.amenities} onChange={e => setForm({ ...form, amenities: e.target.value })} placeholder="Pool, Garden, River View" />
                </FormField>
              </FormSection>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <FormSubmit type="button" onClick={() => setShowForm(false)} disabled={submitting} color="primary">Cancel</FormSubmit>
                <FormSubmit loading={submitting} disabled={submitting}>{editingId ? 'Update' : 'Add'} Property</FormSubmit>
              </div>
            </form>
      </AppSheet>

      {/* Delete Confirmation */}
      <AppSheet open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Property?" subtitle="This action cannot be undone.">
        <div className="p-4 pb-6 safe-area-bottom">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <Trash2 size={20} className="text-red-600" />
          </div>
          <div className="flex gap-2">
            <FormSubmit type="button" onClick={() => setDeleteConfirm(null)} color="primary">Cancel</FormSubmit>
            <FormSubmit type="button" onClick={() => { deleteProperty(deleteConfirm!); setDeleteConfirm(null) }} color="red">Delete</FormSubmit>
          </div>
        </div>
      </AppSheet>
    </div>
  )
}
