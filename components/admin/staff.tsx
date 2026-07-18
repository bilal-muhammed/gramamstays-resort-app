'use client'

import { useState } from 'react'
import { useAdminData } from '@/context/admin-data'
import { useToast } from '@/context/toast'
import { Search, Plus, Pencil, Trash2, X, Shield, UserCog } from 'lucide-react'
import type { Staff } from '@/types/admin'

const statusColor: Record<string, string> = {
  'Active': 'bg-emerald-50 text-emerald-600 border-emerald-200',
  'Off Duty': 'bg-gray-50 text-gray-500 border-gray-200',
}

const roles = ['General Manager', 'Front Desk Lead', 'Spa Manager', 'Head Chef', 'Housekeeping Lead', 'Night Manager', 'Reservations Agent', 'Maintenance Lead']
const departments = ['Management', 'Front Desk', 'Spa & Wellness', 'F&B', 'Housekeeping', 'Engineering']
const allPermissions = ['bookings', 'guests', 'rooms', 'spa', 'dining', 'financials', 'staff']

const emptyStaff = { name: '', email: '', phone: '', role: 'Front Desk Lead', department: 'Front Desk', status: 'Active' as const, lastActive: 'Just now', permissions: [] as string[] }

export function AdminStaff() {
  const { staff, addStaff, updateStaff, deleteStaff } = useAdminData()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'staff' | 'roles'>('staff')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyStaff)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const filtered = staff.filter(s => {
    return s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.role.toLowerCase().includes(searchQuery.toLowerCase()) || s.department.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const roleSummary = roles.map(r => ({
    name: r,
    count: staff.filter(s => s.role === r).length,
  })).filter(r => r.count > 0)

  const openAdd = () => { setEditingId(null); setForm(emptyStaff); setShowForm(true) }
  const openEdit = (s: Staff) => { setEditingId(s.id); setForm({ name: s.name, email: s.email, phone: s.phone, role: s.role, department: s.department, status: s.status, lastActive: s.lastActive, permissions: [...s.permissions] }); setShowForm(true) }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      updateStaff(editingId, form)
      toast('success', 'Staff updated')
    } else {
      addStaff(form)
      toast('success', 'Staff added')
    }
    setShowForm(false); setEditingId(null); setForm(emptyStaff)
  }

  const togglePermission = (perm: string) => {
    setForm(f => ({
      ...f,
      permissions: f.permissions.includes(perm) ? f.permissions.filter(p => p !== perm) : [...f.permissions, perm],
    }))
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-gray-900">Staff & Roles</h2>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
          <Plus size={15} /> Add Staff
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        {(['staff', 'roles'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-xs font-semibold rounded-md transition-colors capitalize ${activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Staff Tab */}
      {activeTab === 'staff' && (
        <div className="space-y-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search staff..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.length === 0 ? (
              <div className="sm:col-span-2 lg:col-span-3 bg-white rounded-xl border border-gray-200 p-10 text-center">
                <UserCog size={32} className="mx-auto text-gray-300 mb-3" />
                <p className="text-sm font-medium text-gray-500">No staff found</p>
                <p className="text-xs text-gray-400 mt-1">{searchQuery ? 'Try a different search' : 'Click "Add Staff" to get started'}</p>
              </div>
            ) : filtered.map(member => (
              <div key={member.id} className="bg-white rounded-xl border border-gray-200 p-5 relative group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{member.name}</p>
                      <p className="text-[10px] text-gray-400">{member.id}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${statusColor[member.status]}`}>{member.status}</span>
                </div>
                <div className="space-y-1.5 text-xs text-gray-500 mb-3">
                  <p className="font-medium text-gray-700">{member.role}</p>
                  <p>{member.department}</p>
                  <p>{member.email}</p>
                  <p>{member.phone}</p>
                  <p className="text-gray-400">Active: {member.lastActive}</p>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {member.permissions.map(p => (
                    <span key={p} className="px-1.5 py-0.5 text-[9px] font-semibold rounded bg-gray-100 text-gray-500">{p}</span>
                  ))}
                </div>
                <div className="flex gap-2 mt-1">
                  <button onClick={() => openEdit(member)} className="flex-1 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-xs font-semibold text-gray-600 transition-colors"><Pencil size={12} className="inline mr-1" />Edit</button>
                  <button onClick={() => setDeleteConfirm(member.id)} className="py-2 px-3 rounded-lg bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-600 transition-colors"><Trash2 size={12} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Roles Tab */}
      {activeTab === 'roles' && (
        <div className="grid sm:grid-cols-2 gap-4">
          {roleSummary.map(r => (
            <div key={r.name} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{r.name}</p>
                  <p className="text-xs text-gray-500">{r.count} member{r.count !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg sm:mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white z-10 px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">{editingId ? 'Edit Staff' : 'Add Staff'}</h3>
              <button onClick={() => setShowForm(false)} className="p-2.5 rounded-lg hover:bg-gray-100"><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Name *</label>
                  <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Email *</label>
                  <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Phone</label>
                  <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Staff['status'] })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white">
                    <option>Active</option><option>Off Duty</option>
                  </select>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Role</label>
                  <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white">
                    {roles.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Department</label>
                  <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white">
                    {departments.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Permissions</label>
                <div className="flex flex-wrap gap-2">
                  {allPermissions.map(p => (
                    <button key={p} type="button" onClick={() => togglePermission(p)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${form.permissions.includes(p) ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2 pb-1">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90">{editingId ? 'Update' : 'Add'} Staff</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-sm sm:mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-gray-900 mb-2">Delete Staff Member?</h3>
            <p className="text-sm text-gray-500 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={() => { deleteStaff(deleteConfirm); setDeleteConfirm(null) }} className="flex-1 py-3 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
