import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { Rooms } from '@/components/rooms'
import { Amenities } from '@/components/amenities'
import { Dining } from '@/components/dining'
import { Contact } from '@/components/contact'
import { Footer } from '@/components/footer'

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Rooms />
      <Amenities />
      <Dining />
      <Contact />
      <Footer />
    </main>
  )
}
