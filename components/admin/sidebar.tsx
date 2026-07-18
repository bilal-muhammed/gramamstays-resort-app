'use client'

import type { AdminSection } from '@/app/admin/page'
import Image from 'next/image'
import { LayoutDashboard, CalendarCheck, BedDouble, Users, DollarSign, UserCog, Settings, X } from 'lucide-react'

const navItems: { id: AdminSection; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'bookings', label: 'Bookings', icon: CalendarCheck },
  { id: 'rooms', label: 'Rooms', icon: BedDouble },
  { id: 'guests', label: 'Guests', icon: Users },
  { id: 'financials', label: 'Financials', icon: DollarSign },
  { id: 'staff', label: 'Staff & Roles', icon: UserCog },
]

interface Props {
  activeSection: AdminSection
  onNavigate: (section: AdminSection) => void
  isOpen: boolean
  onClose: () => void
}

export function AdminSidebar({ activeSection, onNavigate, isOpen, onClose }: Props) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-[#1a1d23] text-white z-[60] flex flex-col transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo */}
        <div className="px-5 py-5 flex items-center justify-between border-b border-white/10 pt-[max(1.25rem,env(safe-area-inset-top))]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg overflow-hidden relative bg-black">
              <Image src="/logo.png" alt="Gramamstays Logo" fill className="object-contain" sizes="40px" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Gramamstays</p>
              <p className="text-[10px] text-white/40 uppercase tracking-wider">Admin Panel</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-white/50 hover:text-white p-2.5 -mr-1 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            return (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); onClose() }}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-medium transition-all min-h-[44px] ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/50 hover:text-white hover:bg-white/5 active:bg-white/10'
                }`}
              >
                <Icon size={18} strokeWidth={1.5} />
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-white/10 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/30 flex items-center justify-center text-xs font-bold text-white">
              A
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">Admin User</p>
              <p className="text-[10px] text-white/40">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
