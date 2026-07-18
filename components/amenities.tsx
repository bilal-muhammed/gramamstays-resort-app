import { Waves, Utensils, Dumbbell, Leaf, Wifi, Zap } from 'lucide-react'
import Image from 'next/image'

const amenities = [
  {
    icon: Waves,
    name: 'Infinity Pool',
    description: 'Olympic-sized pool with breathtaking views and premium poolside service.',
  },
  {
    icon: Utensils,
    name: 'Gourmet Dining',
    description: 'World-class chefs crafting culinary masterpieces with farm-to-table ingredients.',
  },
  {
    icon: Leaf,
    name: 'Spa & Wellness',
    description: 'Full-service spa offering rejuvenating treatments and wellness programs.',
  },
  {
    icon: Dumbbell,
    name: 'Fitness Center',
    description: 'State-of-the-art facilities with personal trainers and yoga classes.',
  },
  {
    icon: Wifi,
    name: 'High-Speed WiFi',
    description: 'Seamless connectivity throughout the resort for your convenience.',
  },
  {
    icon: Zap,
    name: 'Concierge Service',
    description: '24/7 dedicated concierge team to arrange any experience you desire.',
  },
]

export function Amenities() {
  return (
    <section id="amenities" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            World-Class Amenities
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Indulge in a curated selection of premium facilities designed for your ultimate relaxation and enjoyment.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {amenities.map((amenity) => {
            const Icon = amenity.icon
            return (
              <div
                key={amenity.name}
                className="p-8 bg-background rounded-xl border border-border hover:border-secondary transition-all hover:shadow-lg group"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                  <Icon className="text-primary group-hover:text-secondary transition-colors" size={28} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{amenity.name}</h3>
                <p className="text-muted-foreground text-sm">{amenity.description}</p>
              </div>
            )
          })}
        </div>

        {/* Spa Image Section */}
        <div className="relative h-96 rounded-xl overflow-hidden border border-border shadow-xl">
          <Image
            src="/spa-wellness.png"
            alt="Spa and Wellness Center"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-all duration-300" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <h3 className="text-4xl font-bold mb-3 text-balance">Premium Spa Experiences</h3>
              <p className="text-lg mb-6">Rejuvenate with our signature wellness treatments</p>
              <button className="px-8 py-3 bg-secondary text-white rounded-lg hover:bg-accent transition-all font-semibold">
                Book a Treatment
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
