'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export function FormSection({ title, defaultOpen = true, children, index = 0 }: { title: string; defaultOpen?: boolean; children: React.ReactNode; index?: number }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className={`border border-gray-100 rounded-xl overflow-hidden field-enter field-enter-${Math.min(index + 1, 6)}`}>
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-gray-50/80 hover:bg-gray-100/80 active:bg-gray-100 transition-colors">
        <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">{title}</span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${open ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-3.5 py-3 space-y-2.5">
          {children}
        </div>
      </div>
    </div>
  )
}

export function FormField({ label, children, index = 0 }: { label: string; children: React.ReactNode; index?: number }) {
  return (
    <div className={`field-enter field-enter-${Math.min(index + 1, 6)}`}>
      {label && <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>}
      {children}
    </div>
  )
}

export function FormRow({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-2.5">{children}</div>
}

export function FormInput({ value, onChange, placeholder, type = 'text', required, readOnly, min, className = '' }: {
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  type?: string
  required?: boolean
  readOnly?: boolean
  min?: number
  className?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      readOnly={readOnly}
      min={min}
      className={`w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 app-input focus:outline-none ${readOnly ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''} ${className}`}
    />
  )
}

export function FormSelect({ value, onChange, children, className = '' }: {
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <select value={value} onChange={onChange}
      className={`w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 app-select focus:outline-none ${className}`}>
      {children}
    </select>
  )
}

export function FormTextarea({ value, onChange, placeholder, rows = 3, className = '' }: {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  rows?: number
  className?: string
}) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 resize-none app-input focus:outline-none ${className}`}
    />
  )
}

export function FormSubmit({ children, loading, disabled, color = 'primary', onClick, type = 'submit' }: {
  children: React.ReactNode
  loading?: boolean
  disabled?: boolean
  color?: 'primary' | 'emerald' | 'red'
  onClick?: () => void
  type?: 'submit' | 'button'
}) {
  const colors = {
    primary: 'bg-primary hover:bg-primary/90',
    emerald: 'bg-emerald-600 hover:bg-emerald-700',
    red: 'bg-red-500 hover:bg-red-600',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`app-submit flex-1 py-2.5 rounded-xl text-white text-[13px] font-bold shadow-sm flex items-center justify-center gap-2 ${colors[color]} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {loading && <span className="app-spinner" />}
      {children}
    </button>
  )
}
