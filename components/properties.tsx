'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Star, ChevronLeft, ChevronRight, Maximize, Users, BedDouble, Bath } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

interface PropertyDisplay {
  id: string
  name: string
  tagline: string
  description: string
  image: string
  features: string[]
  specs: { size: string; guests: string; beds: string; bath: string }
  rating: number
  reviews: number
  badge: string
  price: number
}

export function Properties() {
  const [properties, setProperties] = useState<PropertyDisplay[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (loading) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [loading])

  useEffect(() => {
    fetch('/api/properties')
      .then(res => res.json())
      .then((data: any[]) => {
        const active = data.filter(p => p.status === 'Active')
        setProperties(active.map(p => {
          let gallery: string[] = []
          try { gallery = JSON.parse(p.gallery || '[]') } catch {}
          const coverImage = gallery[0] || p.image || '/luxury-room.png'
          return {
            id: p.id,
            name: p.name,
            tagline: p.tagline || '',
            description: p.description,
            image: coverImage,
            features: p.features ? p.features.split(',').map((f: string) => f.trim()) : [],
            specs: p.specs ? JSON.parse(p.specs) : { size: '', guests: '', beds: '', bath: '' },
            rating: p.rating || 0,
            reviews: p.reviews || 0,
            badge: p.badge || '',
            price: p.price,
          }
        }))
      })
      .catch(() => setProperties([]))
      .finally(() => setLoading(false))
  }, [])

  const scrollTo = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const card = scrollRef.current.children[0] as HTMLElement
    if (!card) return
    const scrollAmount = card.offsetWidth + 24
    scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' })
  }

  const handleScroll = () => {
    if (!scrollRef.current) return
    const scrollLeft = scrollRef.current.scrollLeft
    const cardWidth = (scrollRef.current.children[0] as HTMLElement)?.offsetWidth || 1
    setActiveIndex(Math.round(scrollLeft / (cardWidth + 24)))
  }

  if (loading || properties.length === 0) return null

  return (
    <section
      id="properties"
      ref={sectionRef}
      className={`py-14 sm:py-20 bg-ivory/40 relative overflow-hidden transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 sm:mb-12 gap-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-px bg-secondary" />
              <span className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-secondary font-medium font-hand">Properties</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-foreground mb-2 sm:mb-3 leading-tight">
              Our{' '}
              <span className="italic font-light text-gradient-gold">Properties</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Each property is a masterpiece of design, offering unique experiences amidst nature&apos;s finest landscapes.
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollTo('left')}
              className="w-10 h-10 rounded-full border border-border/60 flex items-center justify-center hover:bg-secondary/10 hover:border-secondary/40 transition-all"
            >
              <ChevronLeft size={18} className="text-foreground" />
            </button>
            <button
              onClick={() => scrollTo('right')}
              className="w-10 h-10 rounded-full border border-border/60 flex items-center justify-center hover:bg-secondary/10 hover:border-secondary/40 transition-all"
            >
              <ChevronRight size={18} className="text-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 px-5 sm:px-6 lg:px-[max(1.25rem,calc((100vw-80rem)/2+1.25rem))] scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {properties.map((property) => (
          <div
            key={property.id}
            className="snap-start shrink-0 w-[85vw] sm:w-[70vw] md:w-[45vw] lg:w-[32vw] group bg-card rounded-xl overflow-hidden border border-border/50 hover:border-secondary/35 transition-all duration-400 premium-shadow hover:premium-shadow-lg relative"
          >
            {/* Badge */}
            {property.badge && (
              <div className="absolute top-3 left-3 z-10">
                <span className={`px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase ${
                  property.badge === 'Exclusive'
                    ? 'bg-gradient-to-r from-secondary to-accent text-white'
                    : property.badge === 'Best Value'
                    ? 'bg-primary/90 text-white'
                    : 'bg-white/90 text-foreground backdrop-blur-sm border border-border/30'
                }`}>
                  {property.badge}
                </span>
              </div>
            )}

            {/* Image */}
            <Link href={`/properties/${property.id}`} className="block relative h-56 sm:h-64 lg:h-72 overflow-hidden">
              <Image
                src={property.image}
                alt={property.name}
                fill
                className="object-cover transition-transform duration-600 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              {/* Specs Overlay */}
              <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5">
                {[
                  { icon: Maximize, label: property.specs.size, key: 'size' },
                  { icon: Users, label: property.specs.guests + ' Guests', key: 'guests' },
                  { icon: BedDouble, label: property.specs.beds, key: 'beds' },
                  { icon: Bath, label: property.specs.bath + ' Bath', key: 'bath' },
                ].filter(s => s.label).map((spec) => (
                  <div key={spec.key} className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-md px-2 py-1">
                    <spec.icon size={10} className="text-primary" />
                    <span className="text-[10px] font-medium text-foreground">{spec.label}</span>
                  </div>
                ))}
              </div>
            </Link>

            {/* Content */}
            <div className="p-5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <Link href={`/properties/${property.id}`}>
                    <h3 className="text-lg font-bold font-display text-foreground hover:text-primary transition-colors">{property.name}</h3>
                  </Link>
                  {property.tagline && <p className="text-[11px] text-secondary font-medium italic mt-0.5">{property.tagline}</p>}
                </div>
                {property.rating > 0 && (
                  <div className="flex items-center gap-1 bg-primary/5 rounded-md px-2 py-0.5 shrink-0">
                    <Star size={11} className="fill-secondary text-secondary" />
                    <span className="text-xs font-bold text-foreground">{property.rating}</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-muted-foreground mb-3 leading-relaxed line-clamp-2">{property.description}</p>

              {/* Features */}
              {property.features.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {property.features.slice(0, 3).map((feature) => (
                    <span
                      key={feature}
                      className="px-2 py-0.5 bg-primary/5 text-primary text-[10px] rounded-md font-medium border border-primary/10"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              )}

              {/* Price + CTA */}
              <div className="flex items-end justify-between pt-3.5 border-t border-border/40">
                <div>
                  <span className="text-xl font-bold text-foreground">₹{property.price.toLocaleString()}</span>
                  <span className="text-[10px] text-muted-foreground ml-1">/night</span>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/properties/${property.id}`}
                    className="px-3 py-1.5 border border-primary/30 text-primary rounded-md text-xs font-medium hover:bg-primary/5 transition-all text-center"
                  >
                    Explore
                  </Link>
                  <a
                    href={`https://wa.me/919526522031?text=${encodeURIComponent(`Hi, I would like to know more about ${property.name} at Gramamstays Resort.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-1.5 bg-gradient-to-r from-primary to-primary/90 text-white rounded-md text-xs font-medium hover:shadow-md transition-all text-center"
                  >
                    Book Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dot Indicators */}
      {properties.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {properties.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (!scrollRef.current) return
                const card = scrollRef.current.children[0] as HTMLElement
                if (!card) return
                scrollRef.current.scrollTo({ left: i * (card.offsetWidth + 24), behavior: 'smooth' })
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeIndex === i ? 'bg-secondary w-6' : 'bg-border hover:bg-secondary/40'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
