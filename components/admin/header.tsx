'use client'

import type { AdminSection } from '@/app/admin/page'
import { useAuth } from '@/context/auth'
import { Menu, Bell, LogOut, LayoutDashboard, CalendarCheck, BedDouble, Users, DollarSign, UserCog, Home, UserPlus, ScrollText, MessageSquareQuote, Inbox } from 'lucide-react'

const sectionConfig: Record<AdminSection, { title: string; subtitle: string; icon: typeof LayoutDashboard }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Overview & insights', icon: LayoutDashboard },
  bookings: { title: 'Bookings', subtitle: 'Manage reservations', icon: CalendarCheck },
  properties: { title: 'Properties', subtitle: 'Manage properties', icon: Home },
  testimonials: { title: 'Testimonials', subtitle: 'Guest reviews', icon: MessageSquareQuote },
  inquiries: { title: 'Inquiries', subtitle: 'Website inquiries', icon: Inbox },
  guests: { title: 'Guests', subtitle: 'Guest directory', icon: Users },
  financials: { title: 'Financials', subtitle: 'Income & expenses', icon: DollarSign },
  staff: { title: 'Staff', subtitle: 'Team management', icon: UserCog },
  register: { title: 'User Management', subtitle: 'Manage admin users', icon: UserPlus },
  logs: { title: 'Activity Logs', subtitle: 'Track all actions', icon: ScrollText },
}

interface Props {
  onMenuToggle: () => void
  activeSection: AdminSection
}

export function AdminHeader({ onMenuToggle, activeSection }: Props) {
  const { user, logout } = useAuth()
  const section = sectionConfig[activeSection]
  const Icon = section.icon

  const roleLabels: Record<string, string> = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    staff: 'Staff',
  }

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-lg -ml-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
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

      <div className="flex items-center gap-2 sm:gap-3">
        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>

        <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-gray-200">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-xs font-bold text-white shadow-sm">
            {user?.username?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="min-w-0 hidden md:block">
            <p className="text-xs font-semibold text-gray-900 truncate leading-tight">{user?.username || 'Admin'}</p>
            <p className="text-[10px] text-gray-500 truncate leading-tight">{roleLabels[user?.role || 'staff']}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
          title="Sign Out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  )
}
