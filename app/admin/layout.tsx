import type { Metadata } from 'next'
import { AdminPWA } from '@/components/admin/pwa'

export const metadata: Metadata = {
  title: 'Gramamstays Admin',
  description: 'Resort management dashboard',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AdminPWA />
      {children}
    </>
  )
}
