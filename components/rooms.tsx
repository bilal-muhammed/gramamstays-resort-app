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
    specs: { size: '45 m²', guests: '2', beds: '1 King', bath: '1' },
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
    specs: { size: '95 m²', guests: '4', beds: '2 King', bath: '2' },
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
    specs: { size: '150 m²', guests: '6', beds: '3 King', bath: '3' },
    rating: 5.0,
    reviews: 56,
    badge: 'Exclusive',
  },
]

export function Rooms() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 })
  const [hoveredRoom, setHoveredRoom] = useState<number | null>(null)

  return (
    <section id="rooms" className="py-14 sm:py-20 px-5 sm:px-6 lg:px-10 bg-ivory/40 relative" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 sm:mb-12 gap-4">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-3 sm:mb-4"
            >
              <div className="w-8 h-px bg-secondary" />
              <span className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-secondary font-medium">Accommodations</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3 leading-tight"
            >
              Exquisite Rooms &{' '}
              <span className="italic font-light text-gradient-gold">Suites</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-xs sm:text-sm text-muted-foreground"
            >
              Each room is a masterpiece of design, blending local artisanship with international luxury standards.
            </motion.p>
          </div>
          <motion.a
            href="#"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            whileHover={{ x: 3 }}
            className="flex items-center gap-1.5 text-secondary font-medium text-xs sm:text-sm hover:text-accent transition-colors shrink-0"
          >
            View all rooms <ArrowRight size={14} />
          </motion.a>
        </div>

        {/* Room Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {roomTypes.map((room, i) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 35 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
              onMouseEnter={() => setHoveredRoom(room.id)}
              onMouseLeave={() => setHoveredRoom(null)}
              className="group bg-card rounded-lg overflow-hidden border border-border/50 hover:border-secondary/35 transition-all duration-400 premium-shadow hover:premium-shadow-lg relative"
            >
              {/* Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className={`px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase ${
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
              <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  className="object-cover transition-transform duration-600 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

                {/* Quick Specs Overlay */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={hoveredRoom === room.id ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                  transition={{ duration: 0.25 }}
                  className="absolute bottom-2.5 left-2.5 right-2.5 hidden sm:flex gap-1.5"
                >
                  {[
                    { icon: Maximize, label: room.specs.size },
                    { icon: Users, label: room.specs.guests + ' Guests' },
                    { icon: BedDouble, label: room.specs.beds },
                    { icon: Bath, label: room.specs.bath + ' Bath' },
                  ].map((spec) => (
                    <div key={spec.label} className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-md px-2 py-0.5">
                      <spec.icon size={10} className="text-primary" />
                      <span className="text-[10px] font-medium text-foreground">{spec.label}</span>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-foreground">{room.name}</h3>
                    <p className="text-[11px] sm:text-xs text-secondary font-medium italic">{room.tagline}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-primary/5 rounded-md px-2 py-0.5 shrink-0">
                    <Star size={11} className="fill-secondary text-secondary" />
                    <span className="text-xs font-bold text-foreground">{room.rating}</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground my-2.5 leading-relaxed">{room.description}</p>

                {/* Features */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {room.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-2 py-0.5 bg-primary/5 text-primary text-[10px] rounded-md font-medium border border-primary/10"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Price + CTA */}
                <div className="flex items-end justify-between pt-3.5 border-t border-border/40">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl sm:text-2xl font-bold text-foreground">{room.price}</span>
                      <span className="text-xs text-muted-foreground line-through">{room.originalPrice}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">per night</p>
                  </div>
                  <motion.a
                    href={`https://wa.me/919539222031?text=${encodeURIComponent(`Hi, I would like to book the ${room.name} (${room.price}/night) at Gramamstays Resort. Please share the availability.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-4 sm:px-5 py-1.5 sm:py-2 bg-gradient-to-r from-primary to-primary/90 text-white rounded-md text-xs sm:text-sm font-medium hover:shadow-md transition-all text-center"
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
