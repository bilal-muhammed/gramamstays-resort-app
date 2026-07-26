'use client'

import type { AdminSection } from '@/app/admin/page'
import { useAuth } from '@/context/auth'
import { LayoutDashboard, CalendarCheck, BedDouble, Users, DollarSign, UserCog, Home } from 'lucide-react'

const allNavItems: { id: AdminSection; label: string; icon: typeof LayoutDashboard; minRole?: string }[] = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'bookings', label: 'Bookings', icon: CalendarCheck },
  { id: 'properties', label: 'Properties', icon: Home },
  { id: 'financials', label: 'Finance', icon: DollarSign },
  { id: 'guests', label: 'Guests', icon: Users },
  { id: 'staff', label: 'Staff', icon: UserCog },
]

interface Props {
  activeSection: AdminSection
  onNavigate: (section: AdminSection) => void
}

export function AdminMobileNav({ activeSection, onNavigate }: Props) {
  const { user, canAccess } = useAuth()
  const navItems = allNavItems.filter(item => canAccess(item.id))

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-gray-200 safe-area-bottom shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <nav className="flex items-center justify-around px-1 py-1.5">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 px-2 py-2 rounded-md transition-all min-w-0 min-h-[44px] justify-center ${
                isActive ? 'text-primary bg-primary/5' : 'text-gray-400 active:bg-gray-100'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.2 : 1.5} />
              <span className={`text-[11px] font-medium leading-none ${isActive ? 'text-primary font-semibold' : ''}`}>{item.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
