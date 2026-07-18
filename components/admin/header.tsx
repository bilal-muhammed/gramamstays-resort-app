'use client'

import type { AdminSection } from '@/app/admin/page'
import { Menu, Bell, Search } from 'lucide-react'

const titles: Record<AdminSection, string> = {
  dashboard: 'Dashboard',
  bookings: 'Bookings Management',
  rooms: 'Rooms & Inventory',
  guests: 'Guest Directory',
  financials: 'Financial Overview',
  staff: 'Staff & Roles',
}

interface Props {
  onMenuToggle: () => void
  activeSection: AdminSection
}

export function AdminHeader({ onMenuToggle, activeSection }: Props) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 sm:px-5 lg:px-6 py-3 flex items-center gap-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2.5 -ml-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
      >
        <Menu size={22} />
      </button>

      <h1 className="text-base sm:text-lg font-bold text-gray-900 flex-1 truncate">{titles[activeSection]}</h1>

      <div className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2.5 flex-1 max-w-xs">
        <Search size={15} className="text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none w-full"
        />
      </div>

      <button className="relative p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
        <Bell size={18} />
        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
      </button>

      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
        A
      </div>
    </header>
  )
}
