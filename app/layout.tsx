import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Zilla_Slab, Caveat } from 'next/font/google'
import { LoadingBar } from '@/components/loading-bar'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const zillaSlab = Zilla_Slab({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
})

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-handwritten',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Gramamstays | Luxury Resort & Wellness Retreat',
  description: 'An exclusive sanctuary where luxury meets nature. Experience world-class dining, rejuvenating spa treatments, and breathtaking mountain views at Gramamstays.',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#4a6741' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${zillaSlab.variable} ${caveat.variable} bg-background scroll-smooth`}>
      <body className="antialiased font-sans text-foreground">
        <LoadingBar />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
