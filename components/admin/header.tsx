'use client'

import type { AdminSection } from '@/app/admin/page'
import { Menu, Bell, Search, LayoutDashboard, CalendarCheck, BedDouble, Users, DollarSign, UserCog } from 'lucide-react'

const sectionConfig: Record<AdminSection, { title: string; subtitle: string; icon: typeof LayoutDashboard }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Overview & insights', icon: LayoutDashboard },
  bookings: { title: 'Bookings', subtitle: 'Manage reservations', icon: CalendarCheck },
  guests: { title: 'Guests', subtitle: 'Guest directory', icon: Users },
  financials: { title: 'Financials', subtitle: 'Income & expenses', icon: DollarSign },
  staff: { title: 'Staff', subtitle: 'Team management', icon: UserCog },
}

interface Props {
  onMenuToggle: () => void
  activeSection: AdminSection
}

export function AdminHeader({ onMenuToggle, activeSection }: Props) {
  const section = sectionConfig[activeSection]
  const Icon = section.icon

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2.5 -ml-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
      >
        <Menu size={22} />
      </button>

      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Icon size={18} className="text-primary" />
        </div>
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-gray-900 truncate">{section.title}</h1>
          <p className="text-[10px] sm:text-xs text-gray-500 truncate hidden sm:block">{section.subtitle}</p>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2.5 flex-1 max-w-xs">
        <Search size={15} className="text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none w-full"
        />
      </div>

      <button className="relative p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
        <Bell size={18} />
        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
      </button>

      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-xs font-bold text-white shadow-sm">
        A
      </div>
    </header>
  )
}
