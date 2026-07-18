'use client'

import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { Rooms } from '@/components/rooms'
import { Amenities } from '@/components/amenities'
import { Dining } from '@/components/dining'
import { Contact } from '@/components/contact'
import { Footer } from '@/components/footer'
import { Experience } from '@/components/experience'
import { Testimonials } from '@/components/testimonials'

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Experience />
      <Rooms />
      <Amenities />
      <Dining />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  )
}
