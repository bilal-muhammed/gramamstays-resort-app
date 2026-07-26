'use client'

import { useState, useRef, useCallback } from 'react'
import { useAdminData } from '@/context/admin-data'
import { useToast } from '@/context/toast'
import { TrendingUp, TrendingDown, DollarSign, Plus, Pencil, Trash2, X, Calendar, BarChart3, Wallet, PiggyBank, Search, Filter } from 'lucide-react'
import type { Expense, Income } from '@/types/admin'

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
const defaultIncome = () => ({ date: getTodayISO(), source: '', amount: 0, type: 'Room Revenue' })

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
  const [incomeFilter, setIncomeFilter] = useState('')
  const [expenseFilter, setExpenseFilter] = useState('')
  const expenseDateRef = useRef<HTMLInputElement>(null)
  const incomeDateRef = useRef<HTMLInputElement>(null)
  const incomeFilterRef = useRef<HTMLInputElement>(null)
  const expenseFilterRef = useRef<HTMLInputElement>(null)

  const openPicker = useCallback((ref: React.RefObject<HTMLInputElement | null>) => {
    ref.current?.showPicker?.()
  }, [])

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

  const openAddExpense = () => { setEditingExpenseId(null); setExpenseForm(defaultExpense()); setShowExpenseForm(true) }
  const openEditExpense = (e: Expense) => { setEditingExpenseId(e.id); setExpenseForm({ date: e.date, label: e.label, description: e.description, amount: e.amount, category: e.category }); setShowExpenseForm(true) }

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = { ...expenseForm, date: expenseForm.date || getTodayISO() }
    if (editingExpenseId) { updateExpense(editingExpenseId, data); toast('success', 'Expense updated') }
    else { addExpense(data); toast('success', 'Expense added') }
    setShowExpenseForm(false); setEditingExpenseId(null); setExpenseForm(defaultExpense())
  }

  const handleIncomeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addIncome({ ...incomeForm, date: incomeForm.date || getTodayISO() })
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
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg border border-gray-200 p-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-3">
              <TrendingUp size={18} className="text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-emerald-600">₹{totalIncome.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Total Income</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-red-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center mb-3">
              <TrendingDown size={18} className="text-red-600" />
            </div>
            <p className="text-2xl font-bold text-red-600">₹{totalExpenses.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Total Expenses</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-3">
              <PiggyBank size={18} className="text-blue-600" />
            </div>
            <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>₹{netProfit.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Net Profit</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-4 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-1/2 translate-x-1/2 opacity-10" />
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
              <Wallet size={18} />
            </div>
            <p className="text-2xl font-bold">{income.length + expenses.length}</p>
            <p className="text-xs text-white/80 mt-1">Total Transactions</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 p-1 flex gap-1">
        {([
          { key: 'overview', label: 'Overview', icon: BarChart3 },
          { key: 'income', label: 'Income', icon: TrendingUp },
          { key: 'expenses', label: 'Expenses', icon: TrendingDown },
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

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Income Breakdown */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
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

            {/* Expense Breakdown */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
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
          {/* Header & Filter */}
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <button onClick={() => { setIncomeForm(defaultIncome()); setShowIncomeForm(true) }}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors min-h-[38px] shadow-sm">
                <Plus size={16} /> Add Income
              </button>
              <div className="flex items-center gap-3">
                <div className="relative flex-1 sm:flex-none">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input ref={incomeFilterRef} type="date" value={incomeFilter} 
                    onFocus={() => openPicker(incomeFilterRef)} 
                    onChange={e => setIncomeFilter(e.target.value)}
                    className="w-full sm:w-[160px] pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer" />
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
            <div className="bg-white rounded-lg border border-gray-200 p-10 text-center">
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
                <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-3 hover:border-gray-300 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl ${categoryBg[item.type] || 'bg-gray-100'} flex items-center justify-center shrink-0`}>
                      <TrendingUp size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-gray-900 truncate">{item.source}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{fmtDate(item.date)}</span>
                        <span className="text-gray-300">·</span>
                        <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{item.type}</span>
                      </div>
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
          {/* Header & Filter */}
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <button onClick={openAddExpense}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors min-h-[38px] shadow-sm">
                <Plus size={16} /> Add Expense
              </button>
              <div className="flex items-center gap-3">
                <div className="relative flex-1 sm:flex-none">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input ref={expenseFilterRef} type="date" value={expenseFilter} 
                    onFocus={() => openPicker(expenseFilterRef)} 
                    onChange={e => setExpenseFilter(e.target.value)}
                    className="w-full sm:w-[160px] pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer" />
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
            <div className="bg-white rounded-lg border border-gray-200 p-10 text-center">
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
                <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-3 hover:border-gray-300 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl ${categoryBg[item.category] || 'bg-gray-100'} flex items-center justify-center shrink-0`}>
                      <TrendingDown size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-gray-900 truncate">{item.label}</p>
                      </div>
                      <div className="flex items-center gap-2">
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

      {/* Add/Edit Expense Modal */}
      {showExpenseForm && (
        <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={() => setShowExpenseForm(false)}>
          <div className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-lg sm:mx-4 max-h-[92vh] overflow-y-auto safe-area-bottom" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{editingExpenseId ? 'Edit Expense' : 'New Expense'}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{editingExpenseId ? 'Update expense details' : 'Track a new expense'}</p>
              </div>
              <button onClick={() => setShowExpenseForm(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleExpenseSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Label *</label>
                <input type="text" required value={expenseForm.label} onChange={e => setExpenseForm({ ...expenseForm, label: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="e.g. Kitchen Supplies" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Description</label>
                <textarea value={expenseForm.description} onChange={e => setExpenseForm({ ...expenseForm, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none h-24 transition-all" placeholder="What was this expense for?" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Amount (₹) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                  <input type="number" min="0" required value={expenseForm.amount || ''} onChange={e => setExpenseForm({ ...expenseForm, amount: Number(e.target.value) })}
                    className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Category</label>
                  <select value={expenseForm.category} onChange={e => setExpenseForm({ ...expenseForm, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-all appearance-none">
                    {expenseCategories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Date</label>
                  <input ref={expenseDateRef} type="date" value={expenseForm.date} onFocus={() => openPicker(expenseDateRef)} onChange={e => setExpenseForm({ ...expenseForm, date: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all" />
                </div>
              </div>
              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setShowExpenseForm(false)} 
                  className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                  Cancel
                </button>
                <button type="submit" 
                  className="flex-1 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm">
                  {editingExpenseId ? 'Update' : 'Add'} Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Income Modal */}
      {showIncomeForm && (
        <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={() => setShowIncomeForm(false)}>
          <div className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-lg sm:mx-4 max-h-[92vh] overflow-y-auto safe-area-bottom" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">New Income</h3>
                <p className="text-xs text-gray-500 mt-0.5">Record incoming revenue</p>
              </div>
              <button onClick={() => setShowIncomeForm(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleIncomeSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Source *</label>
                <input type="text" required value={incomeForm.source} onChange={e => setIncomeForm({ ...incomeForm, source: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" placeholder="e.g. Room - Presidential Suite #301" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Amount (₹) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                  <input type="number" min="0" required value={incomeForm.amount || ''} onChange={e => setIncomeForm({ ...incomeForm, amount: Number(e.target.value) })}
                    className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" placeholder="0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Type</label>
                  <select value={incomeForm.type} onChange={e => setIncomeForm({ ...incomeForm, type: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white transition-all appearance-none">
                    {incomeTypes.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Date</label>
                  <input ref={incomeDateRef} type="date" value={incomeForm.date} onFocus={() => openPicker(incomeDateRef)} onChange={e => setIncomeForm({ ...incomeForm, date: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer transition-all" />
                </div>
              </div>
              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setShowIncomeForm(false)} 
                  className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                  Cancel
                </button>
                <button type="submit" 
                  className="flex-1 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-all shadow-sm">
                  Add Income
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
            <h3 className="font-bold text-gray-900 mb-1 text-center">Delete Entry?</h3>
            <p className="text-sm text-gray-500 mb-5 text-center">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} 
                className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button onClick={handleDelete} 
                className="flex-1 py-2.5 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all shadow-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
