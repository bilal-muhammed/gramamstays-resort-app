'use client'

import Image from 'next/image'
import { Star, ArrowRight, Maximize, Users, BedDouble, Bath } from 'lucide-react'
import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useState } from 'react'

const roomTypes = [
  {
    id: 1,
    name: 'River Resort',
    tagline: 'Nature\'s Embrace',
    description: 'Nestled along the riverbank with stunning water views. Perfect for nature lovers seeking tranquility and adventure.',
    price: '₹550',
    originalPrice: '₹650',
    image: '/luxury-room.png',
    features: ['Double Bed', 'River View', 'Kayak Access', 'Hammock Deck'],
    specs: { size: '45 m\u00B2', guests: '2', beds: '1 King', bath: '1' },
    rating: 4.9,
    reviews: 128,
    badge: 'Most Popular',
  },
  {
    id: 2,
    name: 'British Bungalow',
    tagline: 'Heritage Elegance',
    description: 'Heritage bungalow with colonial architecture, wrap-around verandah, and lush manicured lawns. A serene escape.',
    price: '₹650',
    originalPrice: '₹800',
    image: '/luxury-room.png',
    features: ['Queen Bed', 'Garden View', 'Fireplace', 'Tea Lounge'],
    specs: { size: '95 m\u00B2', guests: '4', beds: '2 King', bath: '2' },
    rating: 5.0,
    reviews: 89,
    badge: 'Best Value',
  },
  {
    id: 3,
    name: 'The Chedi',
    tagline: 'The Pinnacle of Luxury',
    description: 'A luxurious retreat blending traditional elegance with modern comfort. Features panoramic views, private gardens, and world-class amenities.',
    price: '₹850',
    originalPrice: '₹1000',
    image: '/luxury-room.png',
    features: ['King Bed', 'River View', 'Private Pool', 'Butler Service'],
    specs: { size: '150 m\u00B2', guests: '6', beds: '3 King', bath: '3' },
    rating: 5.0,
    reviews: 56,
    badge: 'Exclusive',
  },
]

export function Rooms() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 })
  const [hoveredRoom, setHoveredRoom] = useState<number | null>(null)

  return (
    <section id="rooms" className="py-20 sm:py-28 px-5 sm:px-6 lg:px-10 bg-ivory/50 relative" ref={ref}>
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 sm:mb-16 gap-4 sm:gap-6">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-4 sm:mb-5"
            >
              <div className="w-8 sm:w-10 h-px bg-secondary" />
              <span className="text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase text-secondary font-medium">Accommodations</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4 leading-tight"
            >
              Exquisite Rooms &{' '}
              <span className="italic font-light" style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text', backgroundImage: 'linear-gradient(135deg, #d4a574, #c8956b)', backgroundClip: 'text' }}>Suites</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-base text-muted-foreground"
            >
              Each room is a masterpiece of design, blending local artisanship with international luxury standards.
            </motion.p>
          </div>
          <motion.a
            href="#"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            whileHover={{ x: 4 }}
            className="flex items-center gap-2 text-secondary font-medium text-sm hover:text-accent transition-colors shrink-0"
          >
            View all rooms <ArrowRight size={16} />
          </motion.a>
        </div>

        {/* Room Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {roomTypes.map((room, i) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.12 }}
              onMouseEnter={() => setHoveredRoom(room.id)}
              onMouseLeave={() => setHoveredRoom(null)}
              className="group bg-card rounded-2xl overflow-hidden border border-border/60 hover:border-secondary/40 transition-all duration-500 premium-shadow hover:premium-shadow-lg relative"
            >
              {/* Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold tracking-wider uppercase ${
                  room.badge === 'Exclusive'
                    ? 'bg-gradient-to-r from-secondary to-accent text-white'
                    : room.badge === 'Best Value'
                    ? 'bg-primary/90 text-white'
                    : 'bg-white/90 text-foreground backdrop-blur-sm border border-border/30'
                }`}>
                  {room.badge}
                </span>
              </div>

              {/* Image */}
              <div className="relative h-56 sm:h-64 lg:h-72 overflow-hidden">
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Quick Specs Overlay - hidden on mobile */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={hoveredRoom === room.id ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-3 left-3 right-3 hidden sm:flex gap-2"
                >
                  {[
                    { icon: Maximize, label: room.specs.size },
                    { icon: Users, label: room.specs.guests + ' Guests' },
                    { icon: BedDouble, label: room.specs.beds },
                    { icon: Bath, label: room.specs.bath + ' Bath' },
                  ].map((spec) => (
                    <div key={spec.label} className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1">
                      <spec.icon size={11} className="text-primary" />
                      <span className="text-[10px] font-medium text-foreground">{spec.label}</span>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Content */}
              <div className="p-5 sm:p-7">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground">{room.name}</h3>
                    <p className="text-xs sm:text-sm text-secondary font-medium italic">{room.tagline}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-primary/5 rounded-full px-2.5 py-1 shrink-0">
                    <Star size={12} className="fill-secondary text-secondary" />
                    <span className="text-xs sm:text-sm font-bold text-foreground">{room.rating}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground my-3 sm:my-4 leading-relaxed">{room.description}</p>

                {/* Features */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-5 sm:mb-6">
                  {room.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-2.5 py-1 bg-primary/5 text-primary text-[10px] sm:text-xs rounded-full font-medium border border-primary/10"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Price + CTA */}
                <div className="flex items-end justify-between pt-4 sm:pt-5 border-t border-border/50">
                  <div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="text-2xl sm:text-3xl font-bold text-foreground">{room.price}</span>
                      <span className="text-xs sm:text-sm text-muted-foreground line-through">{room.originalPrice}</span>
                    </div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">per night</p>
                  </div>
                  <motion.a
                    href={`https://wa.me/919539222031?text=${encodeURIComponent(`Hi, I would like to book the ${room.name} (${room.price}/night) at Gramamstays Resort. Please share the availability.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-primary to-primary/90 text-white rounded-full text-xs sm:text-sm font-medium hover:shadow-lg transition-all text-center"
                  >
                    Book Now
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
