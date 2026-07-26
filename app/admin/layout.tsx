'use client'

import { AuthProvider } from '@/context/auth'
import { AdminPWA } from '@/components/admin/pwa'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <AdminPWA />
      {children}
    </AuthProvider>
  )
}
