'use client'

import { useState } from 'react'
import { useAdminData } from '@/context/admin-data'
import { useToast } from '@/context/toast'
import { TrendingUp, TrendingDown, DollarSign, Plus, Pencil, Trash2, X } from 'lucide-react'
import type { Expense, Income } from '@/types/admin'

const categoryColors: Record<string, string> = {
  'Room Revenue': 'bg-blue-100 text-blue-700', 'Spa': 'bg-purple-100 text-purple-700',
  'F&B': 'bg-amber-100 text-amber-700', 'Experience': 'bg-emerald-100 text-emerald-700',
  'Amenity': 'bg-cyan-100 text-cyan-700', 'Payroll': 'bg-red-100 text-red-700',
  'Supplies': 'bg-orange-100 text-orange-700', 'Utilities': 'bg-gray-100 text-gray-700',
  'Marketing': 'bg-pink-100 text-pink-700', 'Maintenance': 'bg-yellow-100 text-yellow-700',
  'Other': 'bg-slate-100 text-slate-700',
}

const expenseCategories = ['Payroll', 'Supplies', 'Utilities', 'Marketing', 'Maintenance', 'Other']
const incomeTypes = ['Room Revenue', 'Spa', 'F&B', 'Experience', 'Amenity', 'Other']

function getToday() {
  const d = new Date()
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[d.getMonth()]} ${d.getDate()}`
}

const defaultExpense = () => ({ date: getToday(), label: '', description: '', amount: 0, category: 'Supplies' })
const defaultIncome = () => ({ date: getToday(), source: '', amount: 0, type: 'Room Revenue' })

export function AdminFinancials() {
  const { income, expenses, addIncome, deleteIncome, addExpense, updateExpense, deleteExpense } = useAdminData()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<'overview' | 'income' | 'expenses'>('overview')
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [showIncomeForm, setShowIncomeForm] = useState(false)
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null)
  const [expenseForm, setExpenseForm] = useState(defaultExpense)
  const [incomeForm, setIncomeForm] = useState(defaultIncome)
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'income' | 'expense'; id: string } | null>(null)

  const totalIncome = income.reduce((s, i) => s + i.amount, 0)
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0)
  const netProfit = totalIncome - totalExpenses

  const incomeByType = income.reduce((acc, i) => { acc[i.type] = (acc[i.type] || 0) + i.amount; return acc }, {} as Record<string, number>)
  const expenseByCategory = expenses.reduce((acc, e) => { acc[e.category] = (acc[e.category] || 0) + e.amount; return acc }, {} as Record<string, number>)

  const openAddExpense = () => { setEditingExpenseId(null); setExpenseForm(defaultExpense()); setShowExpenseForm(true) }
  const openEditExpense = (e: Expense) => { setEditingExpenseId(e.id); setExpenseForm({ date: e.date, label: e.label, description: e.description, amount: e.amount, category: e.category }); setShowExpenseForm(true) }

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = { ...expenseForm, date: expenseForm.date || getToday() }
    if (editingExpenseId) { updateExpense(editingExpenseId, data); toast('success', 'Expense updated') }
    else { addExpense(data); toast('success', 'Expense added') }
    setShowExpenseForm(false); setEditingExpenseId(null); setExpenseForm(defaultExpense())
  }

  const handleIncomeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addIncome({ ...incomeForm, date: incomeForm.date || getToday() })
    toast('success', 'Income recorded')
    setShowIncomeForm(false); setIncomeForm(defaultIncome())
  }

  const handleDelete = () => {
    if (!deleteConfirm) return
    if (deleteConfirm.type === 'income') deleteIncome(deleteConfirm.id)
    else deleteExpense(deleteConfirm.id)
    toast('success', `${deleteConfirm.type === 'income' ? 'Income' : 'Expense'} deleted`)
    setDeleteConfirm(null)
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-2">
            <TrendingUp size={16} className="text-emerald-600" />
          </div>
          <p className="text-lg sm:text-xl font-bold text-emerald-600 truncate">${totalIncome.toLocaleString()}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">Income</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center mb-2">
            <TrendingDown size={16} className="text-red-600" />
          </div>
          <p className="text-lg sm:text-xl font-bold text-red-600 truncate">${totalExpenses.toLocaleString()}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">Expenses</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center mb-2">
            <DollarSign size={16} className="text-blue-600" />
          </div>
          <p className={`text-lg sm:text-xl font-bold truncate ${netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>${netProfit.toLocaleString()}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">Net Profit</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        {(['overview', 'income', 'expenses'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-xs font-semibold rounded-md transition-colors capitalize min-h-[44px] ${activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700 active:bg-white/50'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Income Breakdown</h3>
            {Object.keys(incomeByType).length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-6">No income recorded yet</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(incomeByType).sort((a, b) => b[1] - a[1]).map(([type, amount]) => (
                  <div key={type}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${categoryColors[type]?.split(' ')[0]}`} />
                        <span className="text-xs text-gray-600 truncate">{type}</span>
                      </div>
                      <span className="text-xs font-bold text-gray-900 shrink-0 ml-2">${amount.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${categoryColors[type]?.split(' ')[0]}`} style={{ width: `${(amount / totalIncome) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Expense Breakdown</h3>
            {Object.keys(expenseByCategory).length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-6">No expenses recorded yet</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1]).map(([cat, amount]) => (
                  <div key={cat}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${categoryColors[cat]?.split(' ')[0]}`} />
                        <span className="text-xs text-gray-600 truncate">{cat}</span>
                      </div>
                      <span className="text-xs font-bold text-gray-900 shrink-0 ml-2">${amount.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${categoryColors[cat]?.split(' ')[0]}`} style={{ width: `${(amount / totalExpenses) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Income Tab */}
      {activeTab === 'income' && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <button onClick={() => { setIncomeForm(defaultIncome()); setShowIncomeForm(true) }}
              className="flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 min-h-[44px]">
              <Plus size={14} /> Add Income
            </button>
          </div>
          {income.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
              <DollarSign size={32} className="mx-auto text-gray-300 mb-3" />
              <p className="text-sm font-medium text-gray-500">No income recorded yet</p>
              <p className="text-xs text-gray-400 mt-1">Click "Add Income" to get started</p>
            </div>
          ) : (
            <div className="space-y-2">
              {income.map(item => (
                <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[11px] text-gray-400">{item.date}</span>
                        <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-full ${categoryColors[item.type]}`}>{item.type}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 truncate">{item.source}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-bold text-emerald-600">+${item.amount.toLocaleString()}</span>
                      <button onClick={() => setDeleteConfirm({ type: 'income', id: item.id })}
                        className="p-2.5 rounded-lg hover:bg-red-50 active:bg-red-100 text-gray-400 hover:text-red-500 min-w-[44px] min-h-[44px] flex items-center justify-center">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Expenses Tab */}
      {activeTab === 'expenses' && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <button onClick={openAddExpense}
              className="flex items-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 min-h-[44px]">
              <Plus size={14} /> Add Expense
            </button>
          </div>
          {expenses.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
              <DollarSign size={32} className="mx-auto text-gray-300 mb-3" />
              <p className="text-sm font-medium text-gray-500">No expenses recorded yet</p>
              <p className="text-xs text-gray-400 mt-1">Click "Add Expense" to get started</p>
            </div>
          ) : (
            <div className="space-y-2">
              {expenses.map(item => (
                <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[11px] text-gray-400">{item.date}</span>
                        <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-full ${categoryColors[item.category]}`}>{item.category}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 truncate">{item.label}</p>
                      {item.description && <p className="text-xs text-gray-400 truncate mt-0.5">{item.description}</p>}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-sm font-bold text-red-600">-${item.amount.toLocaleString()}</span>
                      <button onClick={() => openEditExpense(item)}
                        className="p-2.5 rounded-lg hover:bg-gray-100 active:bg-gray-200 text-gray-400 hover:text-gray-600 min-w-[44px] min-h-[44px] flex items-center justify-center">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => setDeleteConfirm({ type: 'expense', id: item.id })}
                        className="p-2.5 rounded-lg hover:bg-red-50 active:bg-red-100 text-gray-400 hover:text-red-500 min-w-[44px] min-h-[44px] flex items-center justify-center">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Expense Modal */}
      {showExpenseForm && (
        <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={() => setShowExpenseForm(false)}>
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg sm:mx-4 max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white z-10 px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">{editingExpenseId ? 'Edit Expense' : 'Add Expense'}</h3>
              <button onClick={() => setShowExpenseForm(false)} className="p-2.5 rounded-lg hover:bg-gray-100 min-w-[44px] min-h-[44px] flex items-center justify-center"><X size={18} /></button>
            </div>
            <form onSubmit={handleExpenseSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Label *</label>
                <input type="text" required value={expenseForm.label} onChange={e => setExpenseForm({ ...expenseForm, label: e.target.value })}
                  className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="e.g. Kitchen Supplies" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Description</label>
                <textarea value={expenseForm.description} onChange={e => setExpenseForm({ ...expenseForm, description: e.target.value })}
                  className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none h-24" placeholder="What was this expense for?" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Amount ($) *</label>
                <input type="number" min="0" required value={expenseForm.amount || ''} onChange={e => setExpenseForm({ ...expenseForm, amount: Number(e.target.value) })}
                  className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="0" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Category</label>
                  <select value={expenseForm.category} onChange={e => setExpenseForm({ ...expenseForm, category: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white">
                    {expenseCategories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Date</label>
                  <input type="text" value={expenseForm.date} onChange={e => setExpenseForm({ ...expenseForm, date: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder={getToday()} />
                  <p className="text-[10px] text-gray-400 mt-1">Auto-fills today if empty</p>
                </div>
              </div>
              <div className="flex gap-3 pt-2 pb-2">
                <button type="button" onClick={() => setShowExpenseForm(false)} className="flex-1 py-3.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors min-h-[48px]">Cancel</button>
                <button type="submit" className="flex-1 py-3.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors min-h-[48px]">{editingExpenseId ? 'Update' : 'Add'} Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Income Modal */}
      {showIncomeForm && (
        <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={() => setShowIncomeForm(false)}>
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg sm:mx-4 max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white z-10 px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Add Income</h3>
              <button onClick={() => setShowIncomeForm(false)} className="p-2.5 rounded-lg hover:bg-gray-100 min-w-[44px] min-h-[44px] flex items-center justify-center"><X size={18} /></button>
            </div>
            <form onSubmit={handleIncomeSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Source *</label>
                <input type="text" required value={incomeForm.source} onChange={e => setIncomeForm({ ...incomeForm, source: e.target.value })}
                  className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="e.g. Room - Presidential Suite #301" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Amount ($) *</label>
                <input type="number" min="0" required value={incomeForm.amount || ''} onChange={e => setIncomeForm({ ...incomeForm, amount: Number(e.target.value) })}
                  className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="0" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Type</label>
                  <select value={incomeForm.type} onChange={e => setIncomeForm({ ...incomeForm, type: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white">
                    {incomeTypes.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Date</label>
                  <input type="text" value={incomeForm.date} onChange={e => setIncomeForm({ ...incomeForm, date: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder={getToday()} />
                  <p className="text-[10px] text-gray-400 mt-1">Auto-fills today if empty</p>
                </div>
              </div>
              <div className="flex gap-3 pt-2 pb-2">
                <button type="button" onClick={() => setShowIncomeForm(false)} className="flex-1 py-3.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors min-h-[48px]">Cancel</button>
                <button type="submit" className="flex-1 py-3.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors min-h-[48px]">Add Income</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-sm sm:mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-gray-900 mb-2">Delete Entry?</h3>
            <p className="text-sm text-gray-500 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors min-h-[48px]">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-3.5 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors min-h-[48px]">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
