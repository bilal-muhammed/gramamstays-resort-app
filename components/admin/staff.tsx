'use client'

import { useState } from 'react'
import { useAdminData } from '@/context/admin-data'
import { useToast } from '@/context/toast'
import { Search, Plus, Pencil, Trash2, X, Shield, UserCog, Mail, Phone, Clock, Users } from 'lucide-react'
import type { Staff } from '@/types/admin'

const statusColor: Record<string, string> = {
  'Active': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'Off Duty': 'bg-gray-100 text-gray-500 border border-gray-200',
}

const statusDot: Record<string, string> = {
  'Active': 'bg-emerald-500',
  'Off Duty': 'bg-gray-400',
}

const roles = ['General Manager', 'Front Desk Lead', 'Spa Manager', 'Head Chef', 'Housekeeping Lead', 'Night Manager', 'Reservations Agent', 'Maintenance Lead']
const departments = ['Management', 'Front Desk', 'Spa & Wellness', 'F&B', 'Housekeeping', 'Engineering']
const allPermissions = ['bookings', 'guests', 'rooms', 'spa', 'dining', 'financials', 'staff']

const departmentColors: Record<string, string> = {
  'Management': 'bg-purple-100 text-purple-700',
  'Front Desk': 'bg-blue-100 text-blue-700',
  'Spa & Wellness': 'bg-pink-100 text-pink-700',
  'F&B': 'bg-amber-100 text-amber-700',
  'Housekeeping': 'bg-emerald-100 text-emerald-700',
  'Engineering': 'bg-gray-100 text-gray-700',
}

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
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Staff & Roles</h2>
          <p className="text-xs text-gray-500 mt-0.5">{filtered.length} team members</p>
        </div>
        <button onClick={openAdd} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all min-h-[38px] shadow-sm">
          <Plus size={16} /> Add Staff
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 p-1 flex gap-1">
        {([
          { key: 'staff', label: 'Team Members', icon: Users },
          { key: 'roles', label: 'Roles & Permissions', icon: Shield },
        ] as const).map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setActiveTab(key as 'staff' | 'roles')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-md transition-all min-h-[40px] ${
              activeTab === key 
                ? 'bg-primary text-white shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}>
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Staff Tab */}
      {activeTab === 'staff' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-2.5">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by name, role, or department..."
                className="w-full pl-9 pr-3 py-2.5 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.length === 0 ? (
              <div className="sm:col-span-2 lg:col-span-3 bg-white rounded-lg border border-gray-200 p-10 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <UserCog size={24} className="text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">No staff found</p>
                <p className="text-xs text-gray-500 mb-4">{searchQuery ? 'Try a different search' : 'Add your first team member'}</p>
                {!searchQuery && (
                  <button onClick={openAdd} className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all">
                    <Plus size={14} /> Add Staff
                  </button>
                )}
              </div>
            ) : filtered.map(member => (
              <div key={member.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-all">
                {/* Staff Header */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{member.name}</p>
                        <p className="text-[11px] text-gray-400">{member.id}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded-lg ${statusColor[member.status]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot[member.status]}`} />
                      {member.status}
                    </span>
                  </div>

                  <div className="mb-3">
                    <span className={`inline-flex px-2.5 py-1 text-[11px] font-semibold rounded-lg ${departmentColors[member.department] || 'bg-gray-100 text-gray-700'}`}>
                      {member.department}
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Shield size={12} className="text-gray-400" />
                      <span className="font-medium">{member.role}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Mail size={12} className="text-gray-400" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Phone size={12} className="text-gray-400" />
                      <span>{member.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Clock size={12} className="text-gray-400" />
                      <span className="text-gray-500">Active: {member.lastActive}</span>
                    </div>
                  </div>

                  {/* Permissions */}
                  {member.permissions.length > 0 && (
                    <div className="mb-4">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1.5">Permissions</p>
                      <div className="flex flex-wrap gap-1.5">
                        {member.permissions.map(p => (
                          <span key={p} className="px-2 py-0.5 text-[10px] font-semibold rounded-lg bg-primary/10 text-primary">{p}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button onClick={() => openEdit(member)} className="flex-1 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 transition-colors flex items-center justify-center gap-1.5">
                      <Pencil size={12} /> Edit
                    </button>
                    <button onClick={() => setDeleteConfirm(member.id)} className="py-2 px-3 rounded-lg bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-600 transition-colors flex items-center justify-center">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Roles Tab */}
      {activeTab === 'roles' && (
        <div className="grid sm:grid-cols-2 gap-4">
          {roleSummary.length === 0 ? (
            <div className="sm:col-span-2 bg-white rounded-lg border border-gray-200 p-10 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Shield size={24} className="text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">No roles assigned</p>
              <p className="text-xs text-gray-500">Roles will appear here once staff members are added</p>
            </div>
          ) : roleSummary.map(r => (
            <div key={r.name} className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
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
          <div className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-lg sm:mx-4 max-h-[92vh] overflow-y-auto safe-area-bottom" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{editingId ? 'Edit Staff' : 'New Staff Member'}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{editingId ? 'Update staff details' : 'Add a new team member'}</p>
              </div>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Name *</label>
                  <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Email *</label>
                  <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Phone</label>
                  <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Staff['status'] })}
                    className="w-full px-4 py-3 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-all appearance-none">
                    <option>Active</option><option>Off Duty</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Role</label>
                  <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                    className="w-full px-4 py-3 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-all appearance-none">
                    {roles.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Department</label>
                  <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}
                    className="w-full px-4 py-3 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-all appearance-none">
                    {departments.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Permissions</label>
                <div className="flex flex-wrap gap-2">
                  {allPermissions.map(p => (
                    <button key={p} type="button" onClick={() => togglePermission(p)}
                      className={`px-3 py-2 rounded-md text-xs font-semibold border transition-all ${
                        form.permissions.includes(p) 
                          ? 'bg-primary/10 border-primary/30 text-primary' 
                          : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                      }`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm">
                  {editingId ? 'Update' : 'Add'} Staff
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
            <h3 className="font-bold text-gray-900 mb-1 text-center">Delete Staff Member?</h3>
            <p className="text-sm text-gray-500 mb-5 text-center">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button onClick={() => { deleteStaff(deleteConfirm); setDeleteConfirm(null) }} className="flex-1 py-2.5 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all shadow-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
