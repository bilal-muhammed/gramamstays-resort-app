import Image from 'next/image'
import { Star } from 'lucide-react'

const roomTypes = [
  {
    id: 1,
    name: 'Garden Suite',
    description: 'Spacious suites with private garden views and direct access to landscaped grounds.',
    price: '$250',
    image: '/luxury-room.png',
    features: ['King Bed', 'Garden View', 'Jacuzzi', 'Premium Amenities'],
    rating: 4.9,
  },
  {
    id: 2,
    name: 'Villa Deluxe',
    description: 'Private villas with infinity pools and panoramic views of surrounding nature.',
    price: '$450',
    image: '/luxury-room.png',
    features: ['2 Bedrooms', 'Infinity Pool', 'Kitchen', 'Private Terrace'],
    rating: 5.0,
  },
  {
    id: 3,
    name: 'Presidential Suite',
    description: 'Our most exclusive accommodations with bespoke service and luxury finishes.',
    price: '$650',
    image: '/luxury-room.png',
    features: ['Master Suite', 'Executive Lounge', 'Personal Concierge', 'Spa Access'],
    rating: 5.0,
  },
]

export function Rooms() {
  return (
    <section id="rooms" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Exquisite Accommodations
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from our curated collection of luxurious rooms and suites, each designed for ultimate comfort and elegance.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {roomTypes.map((room) => (
            <div
              key={room.id}
              className="group bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-border"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold text-foreground">{room.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star size={18} className="fill-secondary text-secondary" />
                    <span className="text-sm font-semibold text-foreground">{room.rating}</span>
                  </div>
                </div>

                <p className="text-muted-foreground mb-4 text-sm">{room.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {room.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-1 bg-secondary/20 text-primary text-xs rounded-full font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-muted-foreground">per night</p>
                    <p className="text-2xl font-bold text-primary">{room.price}</p>
                  </div>
                  <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all font-medium">
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
