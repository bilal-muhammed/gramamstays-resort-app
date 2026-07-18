'use client'

import type { AdminSection } from '@/app/admin/page'
import { LayoutDashboard, CalendarCheck, BedDouble, Users, DollarSign, UserCog } from 'lucide-react'

const navItems: { id: AdminSection; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'bookings', label: 'Bookings', icon: CalendarCheck },
  { id: 'rooms', label: 'Rooms', icon: BedDouble },
  { id: 'guests', label: 'Guests', icon: Users },
  { id: 'financials', label: 'Finance', icon: DollarSign },
  { id: 'staff', label: 'Staff', icon: UserCog },
]

interface Props {
  activeSection: AdminSection
  onNavigate: (section: AdminSection) => void
}

export function AdminMobileNav({ activeSection, onNavigate }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-gray-200 safe-area-bottom">
      <nav className="flex items-center justify-around px-1 py-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-0.5 px-2.5 py-2 rounded-lg transition-all min-w-0 ${
                isActive ? 'text-primary' : 'text-gray-400'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
              <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : ''}`}>{item.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
