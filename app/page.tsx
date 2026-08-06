import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { Properties } from '@/components/properties'
import { Amenities } from '@/components/amenities'
import { Contact } from '@/components/contact'
import { Footer } from '@/components/footer'
import { Experience } from '@/components/experience'
import { Testimonials } from '@/components/testimonials'
import { SectionDivider } from '@/components/section-divider'
import { ForestOverlay } from '@/components/forest-overlay'

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <ForestOverlay />
      <Header />
      <Hero />
      <SectionDivider variant="ornament" />
      <Experience />
      <SectionDivider />
      <Properties />
      <SectionDivider variant="ornament" />
      <Amenities />
      <SectionDivider />
      <Testimonials />
      <SectionDivider variant="ornament" />
      <Contact />
      <Footer />
    </main>
  )
}
