'use client'

import { useState } from 'react'
import type { AdminSection } from '@/app/admin/page'
import { useAuth } from '@/context/auth'
import Image from 'next/image'
import { LayoutDashboard, CalendarCheck, BedDouble, Users, DollarSign, UserCog, X, Home, UserPlus, ScrollText, MessageSquareQuote, Inbox, ChevronDown, MoreHorizontal } from 'lucide-react'

const mainNavItems: { id: AdminSection; label: string; icon: typeof LayoutDashboard; minRole?: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'bookings', label: 'Bookings', icon: CalendarCheck },
  { id: 'properties', label: 'Properties', icon: Home },
  { id: 'financials', label: 'Financials', icon: DollarSign },
  { id: 'logs', label: 'Activity Logs', icon: ScrollText },
  { id: 'register', label: 'User Management', icon: UserPlus, minRole: 'super_admin' },
]

const moreNavItems: { id: AdminSection; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'testimonials', label: 'Reviews', icon: MessageSquareQuote },
  { id: 'inquiries', label: 'Inquiries', icon: Inbox },
]

interface Props {
  activeSection: AdminSection
  onNavigate: (section: AdminSection) => void
  isOpen: boolean
  onClose: () => void
}

export function AdminSidebar({ activeSection, onNavigate, isOpen, onClose }: Props) {
  const { user, canAccess } = useAuth()
  const [moreOpen, setMoreOpen] = useState(false)
  const navItems = mainNavItems.filter(item => !item.minRole || user?.role === item.minRole)
  const isMoreActive = moreNavItems.some(item => item.id === activeSection)

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] lg:hidden" onClick={onClose} />
      )}

      <aside className={`fixed top-0 left-0 h-full w-64 bg-[#1a1d23] text-white z-[60] flex flex-col transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
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
          <button onClick={onClose} className="lg:hidden text-white/50 hover:text-white p-1.5 -mr-1 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-md hover:bg-white/10 transition-colors">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            const accessible = canAccess(item.id)
            return (
              <button
                key={item.id}
                onClick={() => { if (accessible) { onNavigate(item.id); onClose() } }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all min-h-[40px] ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : accessible
                      ? 'text-white/50 hover:text-white hover:bg-white/5 active:bg-white/10'
                      : 'text-white/20 cursor-not-allowed'
                }`}
                disabled={!accessible}
              >
                <Icon size={18} strokeWidth={1.5} />
                {item.label}
              </button>
            )
          })}

          {/* More Menu */}
          <div>
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all min-h-[40px] ${
                isMoreActive || moreOpen
                  ? 'bg-white/10 text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/5 active:bg-white/10'
              }`}
            >
              <MoreHorizontal size={18} strokeWidth={1.5} />
              More
              <ChevronDown size={14} className={`ml-auto transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
            </button>
            {moreOpen && (
              <div className="ml-4 mt-1 space-y-1">
                {moreNavItems.map((item) => {
                  const Icon = item.icon
                  const isActive = activeSection === item.id
                  const accessible = canAccess(item.id)
                  return (
                    <button
                      key={item.id}
                      onClick={() => { if (accessible) { onNavigate(item.id); onClose() } }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all min-h-[36px] ${
                        isActive
                          ? 'bg-white/10 text-white'
                          : accessible
                            ? 'text-white/50 hover:text-white hover:bg-white/5 active:bg-white/10'
                            : 'text-white/20 cursor-not-allowed'
                      }`}
                      disabled={!accessible}
                    >
                      <Icon size={16} strokeWidth={1.5} />
                      {item.label}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </nav>
      </aside>
    </>
  )
}
