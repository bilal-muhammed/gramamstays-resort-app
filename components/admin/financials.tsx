'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useAdminData } from '@/context/admin-data'
import { useToast } from '@/context/toast'
import { TrendingUp, TrendingDown, DollarSign, Plus, Pencil, Trash2, X, Calendar, BarChart3, Wallet, PiggyBank, Search, Filter, Clock, CreditCard, MessageSquare } from 'lucide-react'
import type { Expense, Income } from '@/types/admin'
import { AppSheet } from './app-sheet'
import { FormSection, FormField, FormRow, FormInput, FormSelect, FormTextarea, FormSubmit } from './form-parts'

const categoryColors: Record<string, string> = {
  'Room Revenue': 'bg-blue-500', 'Spa': 'bg-purple-500', 'Spa & Wellness': 'bg-purple-500',
  'F&B': 'bg-amber-500', 'Experience': 'bg-emerald-500',
  'Amenity': 'bg-cyan-500', 'Trekking & Adventure': 'bg-orange-500',
  'Yoga & Fitness': 'bg-pink-500', 'Tours & Excursions': 'bg-teal-500',
  'Airport Transfer': 'bg-indigo-500', 'Laundry Service': 'bg-sky-500',
  'Photography': 'bg-rose-500', 'Minibar': 'bg-lime-500',
  'Events & Celebrations': 'bg-violet-500', 'Commissions': 'bg-fuchsia-500',
  'Payroll': 'bg-red-500', 'Food & Ingredients': 'bg-orange-500',
  'Supplies': 'bg-amber-500', 'Utilities': 'bg-gray-500',
  'Marketing': 'bg-pink-500', 'Maintenance': 'bg-yellow-500',
  'Cleaning': 'bg-cyan-500', 'Laundry': 'bg-sky-500',
  'Guest Amenities': 'bg-emerald-500', 'Equipment': 'bg-indigo-500',
  'Insurance': 'bg-violet-500', 'IT & Software': 'bg-blue-500',
  'Travel & Transport': 'bg-teal-500', 'Furniture & Fixtures': 'bg-amber-600',
  'Landscaping': 'bg-green-500', 'Security': 'bg-slate-500',
  'Licenses & Permits': 'bg-purple-600', 'Other': 'bg-slate-500',
}

const categoryBg: Record<string, string> = {
  'Room Revenue': 'bg-blue-50 text-blue-700', 'Spa': 'bg-purple-50 text-purple-700', 'Spa & Wellness': 'bg-purple-50 text-purple-700',
  'F&B': 'bg-amber-50 text-amber-700', 'Experience': 'bg-emerald-50 text-emerald-700',
  'Amenity': 'bg-cyan-50 text-cyan-700', 'Trekking & Adventure': 'bg-orange-50 text-orange-700',
  'Yoga & Fitness': 'bg-pink-50 text-pink-700', 'Tours & Excursions': 'bg-teal-50 text-teal-700',
  'Airport Transfer': 'bg-indigo-50 text-indigo-700', 'Laundry Service': 'bg-sky-50 text-sky-700',
  'Photography': 'bg-rose-50 text-rose-700', 'Minibar': 'bg-lime-50 text-lime-700',
  'Events & Celebrations': 'bg-violet-50 text-violet-700', 'Commissions': 'bg-fuchsia-50 text-fuchsia-700',
  'Payroll': 'bg-red-50 text-red-700', 'Food & Ingredients': 'bg-orange-50 text-orange-700',
  'Supplies': 'bg-amber-50 text-amber-700', 'Utilities': 'bg-gray-50 text-gray-700',
  'Marketing': 'bg-pink-50 text-pink-700', 'Maintenance': 'bg-yellow-50 text-yellow-700',
  'Cleaning': 'bg-cyan-50 text-cyan-700', 'Laundry': 'bg-sky-50 text-sky-700',
  'Guest Amenities': 'bg-emerald-50 text-emerald-700', 'Equipment': 'bg-indigo-50 text-indigo-700',
  'Insurance': 'bg-violet-50 text-violet-700', 'IT & Software': 'bg-blue-50 text-blue-700',
  'Travel & Transport': 'bg-teal-50 text-teal-700', 'Furniture & Fixtures': 'bg-amber-50 text-amber-700',
  'Landscaping': 'bg-green-50 text-green-700', 'Security': 'bg-slate-50 text-slate-700',
  'Licenses & Permits': 'bg-purple-50 text-purple-700', 'Other': 'bg-slate-50 text-slate-700',
}

const expenseCategories = ['Payroll', 'Food & Ingredients', 'Supplies', 'Cleaning', 'Laundry', 'Guest Amenities', 'Utilities', 'Marketing', 'Maintenance', 'Equipment', 'Insurance', 'IT & Software', 'Travel & Transport', 'Furniture & Fixtures', 'Landscaping', 'Security', 'Licenses & Permits', 'Other']
const incomeTypes = ['Room Revenue', 'Spa & Wellness', 'F&B', 'Experience', 'Amenity', 'Trekking & Adventure', 'Yoga & Fitness', 'Tours & Excursions', 'Airport Transfer', 'Laundry Service', 'Photography', 'Minibar', 'Events & Celebrations', 'Commissions', 'Other']

function getTodayISO() {
  return new Date().toISOString().split('T')[0]
}

function fmtDate(d: string) {
  if (!d) return ''
  const date = d.includes('T') ? new Date(d) : new Date(d + 'T00:00:00')
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

const defaultExpense = () => ({ date: getTodayISO(), label: '', description: '', amount: 0, category: 'Supplies' })
const defaultIncome = () => ({ date: getTodayISO(), source: '', amount: 0, type: 'Room Revenue', description: '' })

export function AdminFinancials({ openForm, onFormOpened }: { openForm?: 'booking' | 'income' | 'expense' | null; onFormOpened?: () => void }) {
  const { income, expenses, bookings, addIncome, deleteIncome, addExpense, updateExpense, deleteExpense, updateBooking } = useAdminData()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<'overview' | 'income' | 'expenses' | 'pending'>('overview')
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [showIncomeForm, setShowIncomeForm] = useState(false)
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null)
  const [expenseForm, setExpenseForm] = useState(defaultExpense)
  const [incomeForm, setIncomeForm] = useState(defaultIncome)
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'income' | 'expense'; id: string } | null>(null)
  const [incomeFilter, setIncomeFilter] = useState('')
  const [expenseFilter, setExpenseFilter] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const incomeFilterRef = useRef<HTMLInputElement>(null)
  const expenseFilterRef = useRef<HTMLInputElement>(null)

  const openPicker = useCallback((ref: React.RefObject<HTMLInputElement | null>) => {
    ref.current?.showPicker?.()
  }, [])

  useEffect(() => {
    if (openForm === 'income') {
      setIncomeForm(defaultIncome())
      setShowIncomeForm(true)
      onFormOpened?.()
    } else if (openForm === 'expense') {
      openAddExpense()
      onFormOpened?.()
    }
  }, [openForm])

  const totalIncome = income.reduce((s, i) => s + i.amount, 0)
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0)
  const netProfit = totalIncome - totalExpenses

  const filteredIncome = income.filter(i => {
    if (incomeFilter && i.date !== incomeFilter) return false
    return true
  })

  const filteredExpenses = expenses.filter(e => {
    if (expenseFilter && e.date !== expenseFilter) return false
    return true
  })

  const filteredIncomeTotal = filteredIncome.reduce((s, i) => s + i.amount, 0)
  const filteredExpensesTotal = filteredExpenses.reduce((s, e) => s + e.amount, 0)

  const incomeByType = income.reduce((acc, i) => { acc[i.type] = (acc[i.type] || 0) + i.amount; return acc }, {} as Record<string, number>)
  const expenseByCategory = expenses.reduce((acc, e) => { acc[e.category] = (acc[e.category] || 0) + e.amount; return acc }, {} as Record<string, number>)

  const pendingPayments = bookings
    .filter(b => b.payment !== 'Fully Paid' && b.status !== 'Checked Out')
    .map(b => ({ ...b, outstanding: b.amount - b.paidAmount }))
    .sort((a, b) => b.outstanding - a.outstanding)
  const totalPending = pendingPayments.reduce((s, b) => s + b.outstanding, 0)

  const openAddExpense = () => { setEditingExpenseId(null); setExpenseForm(defaultExpense()); setShowExpenseForm(true) }
  const openEditExpense = (e: Expense) => { setEditingExpenseId(e.id); setExpenseForm({ date: e.date, label: e.label, description: e.description, amount: e.amount, category: e.category }); setShowExpenseForm(true) }

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    const data = { ...expenseForm, date: expenseForm.date || getTodayISO() }
    if (editingExpenseId) { await updateExpense(editingExpenseId, data); toast('success', 'Expense updated') }
    else { await addExpense(data); toast('success', 'Expense added') }
    setShowExpenseForm(false); setEditingExpenseId(null); setExpenseForm(defaultExpense())
    setSubmitting(false)
  }

  const handleIncomeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    await addIncome({ ...incomeForm, date: incomeForm.date || getTodayISO() })
    toast('success', 'Income recorded')
    setShowIncomeForm(false); setIncomeForm(defaultIncome())
    setSubmitting(false)
  }

  const handleDelete = () => {
    if (!deleteConfirm) return
    if (deleteConfirm.type === 'income') deleteIncome(deleteConfirm.id)
    else deleteExpense(deleteConfirm.id)
    toast('success', `${deleteConfirm.type === 'income' ? 'Income' : 'Expense'} deleted`)
    setDeleteConfirm(null)
  }

  return (
    <div className="space-y-5">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <TrendingUp size={15} className="text-emerald-600" />
            </div>
            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Income</p>
          </div>
          <p className="text-xl font-bold text-emerald-600">₹{totalIncome.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
              <TrendingDown size={15} className="text-red-600" />
            </div>
            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Expenses</p>
          </div>
          <p className="text-xl font-bold text-red-600">₹{totalExpenses.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <PiggyBank size={15} className="text-blue-600" />
            </div>
            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Net Profit</p>
          </div>
          <p className={`text-xl font-bold ${netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>₹{netProfit.toLocaleString()}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-[var(--header-h)] z-20 bg-[#f0f2f5] pb-3">
        <div className="bg-white rounded-lg border border-gray-200 p-1 flex gap-1">
        {([
          { key: 'overview', label: 'Overview', icon: BarChart3 },
          { key: 'income', label: 'Income', icon: TrendingUp },
          { key: 'expenses', label: 'Expenses', icon: TrendingDown },
          { key: 'pending', label: 'Pending', icon: Clock },
        ] as const).map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setActiveTab(key)}
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
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Income by Type */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <TrendingUp size={14} className="text-emerald-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm">Income by Type</h3>
              </div>
              {Object.keys(incomeByType).length === 0 ? (
                <div className="py-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <TrendingUp size={20} className="text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-500">No income yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(incomeByType).sort((a, b) => b[1] - a[1]).map(([type, amount]) => {
                    const percentage = totalIncome > 0 ? Math.round((amount / totalIncome) * 100) : 0
                    return (
                      <div key={type}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${categoryColors[type]}`} />
                            <span className="text-xs text-gray-700 font-medium">{type}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">{percentage}%</span>
                            <span className="text-xs font-bold text-gray-900">₹{amount.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${categoryColors[type]} transition-all`} style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Expenses by Category */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                  <TrendingDown size={14} className="text-red-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm">Expenses by Category</h3>
              </div>
              {Object.keys(expenseByCategory).length === 0 ? (
                <div className="py-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <TrendingDown size={20} className="text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-500">No expenses yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1]).map(([cat, amount]) => {
                    const percentage = totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0
                    return (
                      <div key={cat}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${categoryColors[cat]}`} />
                            <span className="text-xs text-gray-700 font-medium">{cat}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">{percentage}%</span>
                            <span className="text-xs font-bold text-gray-900">₹{amount.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${categoryColors[cat]} transition-all`} style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Income Tab */}
      {activeTab === 'income' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-3">
            <div className="flex items-center justify-between gap-3">
              <button onClick={() => { setIncomeForm(defaultIncome()); setShowIncomeForm(true) }}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors min-h-[38px] shadow-sm">
                <Plus size={16} /> Add Income
              </button>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input ref={incomeFilterRef} type="date" value={incomeFilter} 
                    onFocus={() => openPicker(incomeFilterRef)} 
                    onChange={e => setIncomeFilter(e.target.value)}
                    className="w-[160px] pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer" />
                </div>
                {incomeFilter && (
                  <button onClick={() => setIncomeFilter('')} 
                    className="px-2.5 py-1.5 rounded-md bg-gray-100 text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors">
                    Clear
                  </button>
                )}
              </div>
            </div>
            {incomeFilter && (
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  Showing <span className="font-semibold text-gray-900">{filteredIncome.length}</span> {filteredIncome.length === 1 ? 'entry' : 'entries'}
                </p>
                <p className="text-xs font-semibold text-emerald-600">
                  Total: ₹{filteredIncomeTotal.toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* Income List */}
          {filteredIncome.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                <TrendingUp size={24} className="text-emerald-300" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                {income.length === 0 ? 'No income recorded' : 'No matching entries'}
              </p>
              <p className="text-xs text-gray-500 mb-4">
                {income.length === 0 ? 'Start tracking your revenue' : 'Try a different date'}
              </p>
              {income.length === 0 && (
                <button onClick={() => { setIncomeForm(defaultIncome()); setShowIncomeForm(true) }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors">
                  <Plus size={14} /> Add First Income
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredIncome.map(item => (
                <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-3 hover:border-gray-300 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl ${categoryBg[item.type] || 'bg-gray-100'} flex items-center justify-center shrink-0`}>
                      <TrendingUp size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{item.source}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-500">{fmtDate(item.date)}</span>
                        <span className="text-gray-300">·</span>
                        <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{item.type}</span>
                      </div>
                      {item.description && (
                        <p className="text-[11px] text-gray-400 mt-1 truncate">{item.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-base font-bold text-emerald-600">+₹{item.amount.toLocaleString()}</span>
                      <button onClick={() => setDeleteConfirm({ type: 'income', id: item.id })}
                        className="p-2 rounded-lg hover:bg-red-50 active:bg-red-100 text-gray-400 hover:text-red-500 transition-colors">
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
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-3">
            <div className="flex items-center justify-between gap-3">
              <button onClick={openAddExpense}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors min-h-[38px] shadow-sm">
                <Plus size={16} /> Add Expense
              </button>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input ref={expenseFilterRef} type="date" value={expenseFilter} 
                    onFocus={() => openPicker(expenseFilterRef)} 
                    onChange={e => setExpenseFilter(e.target.value)}
                    className="w-[160px] pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer" />
                </div>
                {expenseFilter && (
                  <button onClick={() => setExpenseFilter('')} 
                    className="px-2.5 py-1.5 rounded-md bg-gray-100 text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors">
                    Clear
                  </button>
                )}
              </div>
            </div>
            {expenseFilter && (
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  Showing <span className="font-semibold text-gray-900">{filteredExpenses.length}</span> {filteredExpenses.length === 1 ? 'entry' : 'entries'}
                </p>
                <p className="text-xs font-semibold text-red-600">
                  Total: ₹{filteredExpensesTotal.toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* Expenses List */}
          {filteredExpenses.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <TrendingDown size={24} className="text-red-300" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                {expenses.length === 0 ? 'No expenses recorded' : 'No matching entries'}
              </p>
              <p className="text-xs text-gray-500 mb-4">
                {expenses.length === 0 ? 'Start tracking your spending' : 'Try a different date'}
              </p>
              {expenses.length === 0 && (
                <button onClick={openAddExpense}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">
                  <Plus size={14} /> Add First Expense
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredExpenses.map(item => (
                <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-3 hover:border-gray-300 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl ${categoryBg[item.category] || 'bg-gray-100'} flex items-center justify-center shrink-0`}>
                      <TrendingDown size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{item.label}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-500">{fmtDate(item.date)}</span>
                        <span className="text-gray-300">·</span>
                        <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{item.category}</span>
                        {item.description && (
                          <>
                            <span className="text-gray-300">·</span>
                            <span className="text-xs text-gray-400 truncate max-w-[150px]">{item.description}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-base font-bold text-red-600">-₹{item.amount.toLocaleString()}</span>
                      <button onClick={() => openEditExpense(item)}
                        className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => setDeleteConfirm({ type: 'expense', id: item.id })}
                        className="p-2 rounded-lg hover:bg-red-50 active:bg-red-100 text-gray-400 hover:text-red-500 transition-colors">
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

      {/* Pending Payments Tab */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {/* Summary Card */}
          {pendingPayments.length > 0 && (
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-4 text-white">
              <div className="flex items-center gap-2 mb-1">
                <CreditCard size={16} />
                <p className="text-xs font-medium text-white/80">Total Outstanding</p>
              </div>
              <p className="text-2xl font-bold">₹{totalPending.toLocaleString()}</p>
              <p className="text-xs text-white/70 mt-1">{pendingPayments.length} {pendingPayments.length === 1 ? 'booking' : 'bookings'} pending</p>
            </div>
          )}

          {/* Empty State */}
          {pendingPayments.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                <CreditCard size={24} className="text-emerald-300" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">All clear!</p>
              <p className="text-xs text-gray-500">No pending payments</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingPayments.map(b => (
                <div key={b.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors">
                  {/* Guest Info */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-gray-900">{b.guest}</p>
                        <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${
                          b.payment === 'Pending' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {b.payment}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">{b.id} · {b.room} #{b.roomNo}</p>
                    </div>
                  </div>

                  {/* Payment Grid */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-[10px] text-gray-500 mb-0.5">Total</p>
                      <p className="text-sm font-bold text-gray-900">₹{b.amount.toLocaleString()}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-2">
                      <p className="text-[10px] text-emerald-600 mb-0.5">Paid</p>
                      <p className="text-sm font-bold text-emerald-600">₹{b.paidAmount.toLocaleString()}</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-2">
                      <p className="text-[10px] text-red-500 mb-0.5">Due</p>
                      <p className="text-sm font-bold text-red-600">₹{b.outstanding.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={async () => {
                        await updateBooking(b.id, { paidAmount: b.amount, payment: 'Fully Paid' })
                        toast('success', `Payment cleared for ${b.guest}`)
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-500 text-white rounded-lg text-xs font-semibold hover:bg-emerald-600 transition-colors"
                    >
                      <CreditCard size={13} /> Mark Paid
                    </button>
                    <a
                      href={`https://wa.me/91${b.phone.replace(/\D/g, '').slice(-10)}?text=Hi ${b.guest}, this is a reminder for pending payment of ₹${b.outstanding.toLocaleString()} for your booking ${b.id}. Please complete the payment at your earliest.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors"
                    >
                      <MessageSquare size={13} /> WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Expense Modal */}
      <AppSheet open={showExpenseForm} onClose={() => setShowExpenseForm(false)} title={editingExpenseId ? 'Edit Expense' : 'New Expense'} subtitle={editingExpenseId ? 'Update expense details' : 'Track a new expense'}>
            <form onSubmit={handleExpenseSubmit} className="p-4 pb-6 space-y-3 safe-area-bottom">
              <FormSection title="Expense Details">
                <FormField label="Label *">
                  <FormInput type="text" required value={expenseForm.label} onChange={e => setExpenseForm({ ...expenseForm, label: e.target.value })} placeholder="e.g. Kitchen Supplies" />
                </FormField>
                <FormField label="Description">
                  <FormTextarea value={expenseForm.description} onChange={e => setExpenseForm({ ...expenseForm, description: e.target.value })} placeholder="What was this expense for?" rows={3} className="h-16" />
                </FormField>
                <FormField label="Amount (₹) *">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">₹</span>
                    <FormInput type="number" min={0} required value={expenseForm.amount || ''} onChange={e => setExpenseForm({ ...expenseForm, amount: Number(e.target.value) })} placeholder="0" className="pl-7" />
                  </div>
                </FormField>
                <FormRow>
                  <FormField label="Category">
                    <FormSelect value={expenseForm.category} onChange={e => setExpenseForm({ ...expenseForm, category: e.target.value })}>
                      {expenseCategories.map(c => <option key={c}>{c}</option>)}
                    </FormSelect>
                  </FormField>
                  <FormField label="Date">
                    <FormInput type="date" value={expenseForm.date} onChange={e => setExpenseForm({ ...expenseForm, date: e.target.value })} />
                  </FormField>
                </FormRow>
              </FormSection>
              <div className="flex gap-2 pt-2">
                <FormSubmit type="button" onClick={() => setShowExpenseForm(false)} disabled={submitting} color="primary">Cancel</FormSubmit>
                <FormSubmit loading={submitting} disabled={submitting}>{editingExpenseId ? 'Update' : 'Add'} Expense</FormSubmit>
              </div>
            </form>
      </AppSheet>

      {/* Add Income Modal */}
      <AppSheet open={showIncomeForm} onClose={() => setShowIncomeForm(false)} title="New Income" subtitle="Record incoming revenue">
            <form onSubmit={handleIncomeSubmit} className="p-4 pb-6 space-y-3 safe-area-bottom">
              <FormSection title="Income Details">
                <FormField label="Source *">
                  <FormInput type="text" required value={incomeForm.source} onChange={e => setIncomeForm({ ...incomeForm, source: e.target.value })} placeholder="e.g. BK-1042 - John Smith" />
                </FormField>
                <FormField label="Description">
                  <FormInput type="text" value={incomeForm.description || ''} onChange={e => setIncomeForm({ ...incomeForm, description: e.target.value })} placeholder="e.g. Presidential Suite #301 | 4 nights" />
                </FormField>
                <FormField label="Amount (₹) *">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">₹</span>
                    <FormInput type="number" min={0} required value={incomeForm.amount || ''} onChange={e => setIncomeForm({ ...incomeForm, amount: Number(e.target.value) })} placeholder="0" className="pl-7" />
                  </div>
                </FormField>
                <FormRow>
                  <FormField label="Type">
                    <FormSelect value={incomeForm.type} onChange={e => setIncomeForm({ ...incomeForm, type: e.target.value })}>
                      {incomeTypes.map(t => <option key={t}>{t}</option>)}
                    </FormSelect>
                  </FormField>
                  <FormField label="Date">
                    <FormInput type="date" value={incomeForm.date} onChange={e => setIncomeForm({ ...incomeForm, date: e.target.value })} />
                  </FormField>
                </FormRow>
              </FormSection>
              <div className="flex gap-2 pt-2">
                <FormSubmit type="button" onClick={() => setShowIncomeForm(false)} disabled={submitting} color="primary">Cancel</FormSubmit>
                <FormSubmit loading={submitting} disabled={submitting} color="emerald">Add Income</FormSubmit>
              </div>
            </form>
      </AppSheet>

      {/* Delete Confirmation */}
      <AppSheet open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Entry?" subtitle="This action cannot be undone.">
        <div className="p-4 pb-6 safe-area-bottom">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <Trash2 size={20} className="text-red-600" />
          </div>
          <div className="flex gap-2">
            <FormSubmit type="button" onClick={() => setDeleteConfirm(null)} color="primary">Cancel</FormSubmit>
            <FormSubmit type="button" onClick={handleDelete} color="red">Delete</FormSubmit>
          </div>
        </div>
      </AppSheet>
    </div>
  )
}
