'use client'

import { useState } from 'react'
import { useAdminData } from '@/context/admin-data'
import { useToast } from '@/context/toast'
import { Search, Trash2, X, Mail, Phone, MessageSquare, Calendar, HelpCircle, StickyNote, Eye } from 'lucide-react'
import type { Inquiry } from '@/types/admin'

const statusColor: Record<string, string> = {
  'new': 'bg-blue-50 text-blue-700 border border-blue-200',
  'read': 'bg-amber-50 text-amber-700 border border-amber-200',
  'replied': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'archived': 'bg-gray-100 text-gray-500 border border-gray-200',
}

const statusDot: Record<string, string> = {
  'new': 'bg-blue-500',
  'read': 'bg-amber-500',
  'replied': 'bg-emerald-500',
  'archived': 'bg-gray-400',
}

const typeIcons: Record<string, typeof HelpCircle> = {
  general: HelpCircle,
  booking: Calendar,
  feedback: MessageSquare,
}

const typeLabels: Record<string, string> = {
  general: 'General',
  booking: 'Booking',
  feedback: 'Feedback',
}

export function AdminInquiries() {
  const { inquiries, updateInquiry, deleteInquiry } = useAdminData()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [noteText, setNoteText] = useState('')

  const filtered = inquiries.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.message.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || i.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const openDetail = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry)
    setNoteText(inquiry.notes || '')
    if (inquiry.status === 'new') {
      updateInquiry(inquiry.id, { status: 'read' })
    }
  }

  const handleStatusChange = (id: string, status: string) => {
    updateInquiry(id, { status })
    if (selectedInquiry?.id === id) {
      setSelectedInquiry(prev => prev ? { ...prev, status } : null)
    }
    toast('success', `Marked as ${status}`)
  }

  const handleSaveNote = () => {
    if (selectedInquiry) {
      updateInquiry(selectedInquiry.id, { notes: noteText })
      setSelectedInquiry(prev => prev ? { ...prev, notes: noteText } : null)
      toast('success', 'Note saved')
    }
  }

  const newCount = inquiries.filter(i => i.status === 'new').length

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Website Inquiries</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {filtered.length} of {inquiries.length} inquiries
            {newCount > 0 && <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-semibold">{newCount} new</span>}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-2.5 flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by name, email, or message..."
            className="w-full pl-9 pr-3 py-2.5 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white appearance-none">
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Inquiries List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={24} className="text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">No inquiries found</p>
            <p className="text-xs text-gray-500">{searchQuery || statusFilter !== 'all' ? 'Try different filters' : 'Inquiries from the website will appear here'}</p>
          </div>
        ) : filtered.map(inquiry => {
          const TypeIcon = typeIcons[inquiry.type] || HelpCircle
          return (
            <div key={inquiry.id} onClick={() => openDetail(inquiry)}
              className={`bg-white rounded-xl border p-4 hover:border-gray-300 transition-all cursor-pointer ${
                inquiry.status === 'new' ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200'
              }`}>
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  inquiry.status === 'new' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <TypeIcon size={16} className={inquiry.status === 'new' ? 'text-blue-600' : 'text-gray-500'} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className={`text-sm font-bold truncate ${inquiry.status === 'new' ? 'text-gray-900' : 'text-gray-700'}`}>{inquiry.name}</p>
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-semibold rounded ${statusColor[inquiry.status]}`}>
                      <span className={`w-1 h-1 rounded-full ${statusDot[inquiry.status]}`} />
                      {inquiry.status}
                    </span>
                    <span className="px-1.5 py-0.5 text-[9px] font-semibold rounded bg-gray-100 text-gray-600">{typeLabels[inquiry.type] || inquiry.type}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mb-1">{inquiry.email}{inquiry.phone ? ` · ${inquiry.phone}` : ''}</p>
                  <p className="text-xs text-gray-600 line-clamp-2">{inquiry.message}</p>
                  <p className="text-[10px] text-gray-400 mt-1.5">{new Date(inquiry.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm(inquiry.id) }}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors shrink-0">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={() => setSelectedInquiry(null)}>
          <div className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-lg sm:mx-4 max-h-[92vh] overflow-y-auto safe-area-bottom" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{selectedInquiry.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{selectedInquiry.email}</p>
              </div>
              <button onClick={() => setSelectedInquiry(null)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Contact Details */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-sm">
                  <Mail size={14} className="text-gray-400" />
                  <a href={`mailto:${selectedInquiry.email}`} className="text-primary hover:underline">{selectedInquiry.email}</a>
                </div>
                {selectedInquiry.phone && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <Phone size={14} className="text-gray-400" />
                    <a href={`tel:${selectedInquiry.phone}`} className="text-primary hover:underline">{selectedInquiry.phone}</a>
                  </div>
                )}
                <div className="flex items-center gap-2.5 text-sm text-gray-600">
                  <Calendar size={14} className="text-gray-400" />
                  {new Date(selectedInquiry.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {/* Message */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Message</p>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedInquiry.message}</p>
              </div>

              {/* Status */}
              <div>
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Status</p>
                <div className="flex flex-wrap gap-2">
                  {['new', 'read', 'replied', 'archived'].map(s => (
                    <button key={s} onClick={() => handleStatusChange(selectedInquiry.id, s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                        selectedInquiry.status === s
                          ? 'bg-primary text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Internal Notes</p>
                <textarea value={noteText} onChange={e => setNoteText(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none h-24 transition-all"
                  placeholder="Add notes about this inquiry..." />
                <button onClick={handleSaveNote}
                  className="mt-2 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 transition-colors flex items-center gap-1.5">
                  <StickyNote size={12} /> Save Note
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <a href={`mailto:${selectedInquiry.email}?subject=Re: Your inquiry at Gramamstays Resort`}
                  className="flex-1 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm flex items-center justify-center gap-2">
                  <Mail size={14} /> Reply via Email
                </a>
                {selectedInquiry.phone && (
                  <a href={`https://wa.me/91${selectedInquiry.phone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(selectedInquiry.name)},%20thank%20you%20for%20your%20inquiry%20about%20Gramamstays%20Resort.`}
                    target="_blank" rel="noopener noreferrer"
                    className="py-2.5 px-4 rounded-lg bg-[#25D366] text-white text-sm font-semibold hover:bg-[#20BD5A] transition-all shadow-sm flex items-center justify-center gap-2">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
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
            <h3 className="font-bold text-gray-900 mb-1 text-center">Delete Inquiry?</h3>
            <p className="text-sm text-gray-500 mb-5 text-center">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button onClick={() => { deleteInquiry(deleteConfirm); setDeleteConfirm(null) }} className="flex-1 py-2.5 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all shadow-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
