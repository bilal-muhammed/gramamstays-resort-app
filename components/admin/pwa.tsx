'use client'

import { useEffect } from 'react'

export function AdminPWA() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
  }, [])

  return (
    <>
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#4a6741" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Gramamstays Admin" />
      <link rel="apple-touch-icon" href="/logo.png" />
    </>
  )
}
