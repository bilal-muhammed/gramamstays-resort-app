'use client'

import { useState } from 'react'
import { AdminDataProvider } from '@/context/admin-data'
import { ToastProvider } from '@/context/toast'
import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminMobileNav } from '@/components/admin/mobile-nav'
import { AdminHeader } from '@/components/admin/header'
import { AdminDashboard } from '@/components/admin/dashboard'
import { AdminBookings } from '@/components/admin/bookings'
import { AdminRooms } from '@/components/admin/rooms'
import { AdminGuests } from '@/components/admin/guests'
import { AdminFinancials } from '@/components/admin/financials'
import { AdminStaff } from '@/components/admin/staff'

export type AdminSection = 'dashboard' | 'bookings' | 'rooms' | 'guests' | 'financials' | 'staff'

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard': return <AdminDashboard onNavigate={setActiveSection} />
      case 'bookings': return <AdminBookings />
      case 'rooms': return <AdminRooms />
      case 'guests': return <AdminGuests />
      case 'financials': return <AdminFinancials />
      case 'staff': return <AdminStaff />
      default: return <AdminDashboard onNavigate={setActiveSection} />
    }
  }

  return (
    <AdminDataProvider>
      <ToastProvider>
        <div className="min-h-screen bg-[#f0f2f5] flex">
          <AdminSidebar
            activeSection={activeSection}
            onNavigate={setActiveSection}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
            <AdminHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} activeSection={activeSection} />

            <main className="flex-1 p-4 sm:p-5 lg:p-6 pb-24 lg:pb-6 overflow-y-auto">
              {renderSection()}
            </main>
          </div>

          <AdminMobileNav activeSection={activeSection} onNavigate={setActiveSection} />
        </div>
      </ToastProvider>
    </AdminDataProvider>
  )
}
