import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gramamstays Admin',
  description: 'Resort management dashboard',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
