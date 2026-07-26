'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth'
import { AdminDataProvider } from '@/context/admin-data'
import { ToastProvider } from '@/context/toast'
import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminMobileNav } from '@/components/admin/mobile-nav'
import { AdminHeader } from '@/components/admin/header'

const AdminDashboard = dynamic(() => import('@/components/admin/dashboard').then(m => ({ default: m.AdminDashboard })), { loading: () => <div className="space-y-5"><div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="bg-white rounded-lg border border-gray-200 p-3 h-24 animate-pulse" />)}</div></div> })
const AdminBookings = dynamic(() => import('@/components/admin/bookings').then(m => ({ default: m.AdminBookings })), { loading: () => <div className="bg-white rounded-lg border border-gray-200 p-6 h-64 animate-pulse" /> })
const AdminGuests = dynamic(() => import('@/components/admin/guests').then(m => ({ default: m.AdminGuests })), { loading: () => <div className="bg-white rounded-lg border border-gray-200 p-6 h-64 animate-pulse" /> })
const AdminFinancials = dynamic(() => import('@/components/admin/financials').then(m => ({ default: m.AdminFinancials })), { loading: () => <div className="bg-white rounded-lg border border-gray-200 p-6 h-64 animate-pulse" /> })
const AdminStaff = dynamic(() => import('@/components/admin/staff').then(m => ({ default: m.AdminStaff })), { loading: () => <div className="bg-white rounded-lg border border-gray-200 p-6 h-64 animate-pulse" /> })
const AdminProperties = dynamic(() => import('@/components/admin/properties').then(m => ({ default: m.AdminProperties })), { loading: () => <div className="bg-white rounded-lg border border-gray-200 p-6 h-64 animate-pulse" /> })
const RegisterPage = dynamic(() => import('@/app/admin/register/page'), { loading: () => <div className="bg-white rounded-lg border border-gray-200 p-6 h-64 animate-pulse" /> })
const AdminActivityLogs = dynamic(() => import('@/components/admin/activity-logs').then(m => ({ default: m.AdminActivityLogs })), { loading: () => <div className="bg-white rounded-lg border border-gray-200 p-6 h-64 animate-pulse" /> })

export type AdminSection = 'dashboard' | 'bookings' | 'properties' | 'guests' | 'financials' | 'staff' | 'register' | 'logs'

function AdminContent() {
  const { user, loading, canAccess } = useAuth()
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) router.push('/admin/login')
  }, [loading, user, router])

  useEffect(() => {
    if (user && !canAccess(activeSection)) {
      setActiveSection('dashboard')
    }
  }, [user, activeSection, canAccess])

  const handleSidebarClose = useCallback(() => setSidebarOpen(false), [])
  const handleSidebarToggle = useCallback(() => setSidebarOpen(prev => !prev), [])

  const section = useMemo(() => {
    if (!canAccess(activeSection)) return <AdminDashboard onNavigate={setActiveSection} />
    switch (activeSection) {
      case 'dashboard': return <AdminDashboard onNavigate={setActiveSection} />
      case 'bookings': return <AdminBookings />
      case 'properties': return <AdminProperties />
      case 'guests': return <AdminGuests />
      case 'financials': return <AdminFinancials />
      case 'staff': return <AdminStaff />
      case 'register': return <RegisterPage />
      case 'logs': return <AdminActivityLogs />
      default: return <AdminDashboard onNavigate={setActiveSection} />
    }
  }, [activeSection, canAccess])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
        <div className="text-sm text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!user) return null

  return (
    <AdminDataProvider>
      <ToastProvider>
        <div className="min-h-screen bg-[#f0f2f5] flex overflow-x-hidden">
          <AdminSidebar
            activeSection={activeSection}
            onNavigate={setActiveSection}
            isOpen={sidebarOpen}
            onClose={handleSidebarClose}
          />

          <div className="flex-1 flex flex-col min-h-screen min-w-0 lg:ml-64">
            <AdminHeader onMenuToggle={handleSidebarToggle} activeSection={activeSection} />

            <main className="flex-1 p-4 sm:p-5 lg:p-6 pb-24 lg:pb-6 overflow-y-auto overflow-x-hidden">
              <div className="max-w-7xl mx-auto min-w-0">
                {section}
              </div>
            </main>
          </div>

          <AdminMobileNav activeSection={activeSection} onNavigate={setActiveSection} />
        </div>
      </ToastProvider>
    </AdminDataProvider>
  )
}

export default function AdminPage() {
  return <AdminContent />
}
