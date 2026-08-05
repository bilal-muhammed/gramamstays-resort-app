'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useRef, useState, useEffect } from 'react'
import {
  Star, ArrowLeft, Maximize, Users, BedDouble, Bath,
  Check, Clock, Shield, ChevronRight, ChevronDown, Phone, ArrowRight,
  MapPin, Heart, Share2, ChevronLeft, Bookmark, ImageIcon,
} from 'lucide-react'
import { Footer } from '@/components/footer'

interface Room {
  id: string
  name: string
  description: string
  price: number
  originalPrice: number
  image: string
  features: string[]
  specs: { size: string; guests: string; beds: string; bath: string }
}

interface PropertyData {
  id: string
  name: string
  tagline: string
  description: string
  image: string
  gallery: string[]
  features: string[]
  specs: { size: string; guests: string; beds: string; bath: string }
  rating: number
  reviews: number
  badge: string
  price: number
  amenities: string
  rooms: Room[]
}

export default function PropertyDetailPage() {
  const params = useParams()
  const [property, setProperty] = useState<PropertyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const galleryScrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [heroVisible, setHeroVisible] = useState(false)
  const [aboutVisible, setAboutVisible] = useState(false)
  const [featuresVisible, setFeaturesVisible] = useState(false)
  const [roomsVisible, setRoomsVisible] = useState(false)
  const aboutRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const roomsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/properties')
      .then(res => res.json())
      .then((data: any[]) => {
        const found = data.find(p => p.id === params.id)
        if (found) {
          let gallery: string[] = []
          try { gallery = JSON.parse(found.gallery || '[]') } catch {}
          if (gallery.length === 0 && found.image) gallery = [found.image]

          let specs = { size: '', guests: '', beds: '', bath: '' }
          try { specs = JSON.parse(found.specs || '{}') } catch {}

          setProperty({
            id: found.id,
            name: found.name,
            tagline: found.tagline || '',
            description: found.description,
            image: found.image || '/luxury-room.png',
            gallery,
            features: found.features ? found.features.split(',').map((f: string) => f.trim()) : [],
            specs,
            rating: found.rating || 0,
            reviews: found.reviews || 0,
            badge: found.badge || '',
            price: found.price,
            amenities: found.amenities || '',
            rooms: [],
          })
        }
        setTimeout(() => setHeroVisible(true), 100)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [params.id])

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    const addObserver = (ref: React.RefObject<HTMLDivElement | null>, setVisible: (v: boolean) => void) => {
      if (!ref.current) return
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
        { threshold: 0.15, rootMargin: '-50px' }
      )
      observer.observe(ref.current)
      observers.push(observer)
    }
    addObserver(aboutRef, setAboutVisible)
    addObserver(featuresRef, setFeaturesVisible)
    addObserver(roomsRef, setRoomsVisible)
    return () => observers.forEach(o => o.disconnect())
  }, [property])

  const checkGalleryScroll = () => {
    if (!galleryScrollRef.current) return
    const el = galleryScrollRef.current
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  useEffect(() => {
    const el = galleryScrollRef.current
    if (!el) return
    checkGalleryScroll()
    el.addEventListener('scroll', checkGalleryScroll, { passive: true })
    return () => el.removeEventListener('scroll', checkGalleryScroll)
  }, [property])

  const scrollGallery = (dir: 'left' | 'right') => {
    if (!galleryScrollRef.current) return
    const amount = galleryScrollRef.current.clientWidth * 0.7
    galleryScrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center px-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Property Not Found</h1>
          <p className="text-muted-foreground mb-4 text-sm">The property you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/#properties" className="px-5 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
            View Properties
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <main className="min-h-screen bg-background">
        {/* HERO */}
        <section className="relative h-[85vh] min-h-[550px] max-h-[800px] overflow-hidden">
          <div className={`absolute inset-0 transition-all duration-1000 ${heroVisible ? 'scale-100 opacity-100' : 'scale-110 opacity-0'}`}>
            <Image
              src={property.gallery[0] || property.image}
              alt={property.name}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-black/15" />
          <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-background to-transparent" />

          {/* Top Nav */}
          <div className="absolute top-0 left-0 right-0 z-20 px-5 sm:px-6 lg:px-10 py-4 sm:py-5">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <Link
                href="/#properties"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white/10 backdrop-blur-sm rounded-md text-white text-[11px] sm:text-xs font-medium hover:bg-white/20 transition-colors border border-white/15"
              >
                <ArrowLeft size={13} />
                Properties
              </Link>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLiked(!liked)}
                  className={`w-9 h-9 rounded-md flex items-center justify-center transition-all duration-300 ${
                    liked ? 'bg-secondary/90 text-white' : 'bg-white/10 backdrop-blur-sm text-white/70 hover:text-white hover:bg-white/20 border border-white/15'
                  }`}
                >
                  <Heart size={14} className={liked ? 'fill-white' : ''} />
                </button>
                <button className="w-9 h-9 rounded-md bg-white/10 backdrop-blur-sm text-white/70 flex items-center justify-center hover:text-white hover:bg-white/20 transition-all border border-white/15">
                  <Share2 size={14} />
                </button>
                <button className="w-9 h-9 rounded-md bg-white/10 backdrop-blur-sm text-white/70 flex items-center justify-center hover:text-white hover:bg-white/20 transition-all border border-white/15">
                  <Bookmark size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 z-10 px-5 sm:px-6 lg:px-10 pb-10 sm:pb-14">
            <div className="max-w-7xl mx-auto">
              <div className={`transition-all duration-700 delay-300 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                {property.badge && (
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <div className="w-6 h-px bg-secondary" />
                    <span className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-secondary font-medium">{property.badge}</span>
                    <div className="w-6 h-px bg-secondary" />
                  </div>
                )}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-3 leading-[0.95] tracking-tight">
                  {property.name}
                </h1>
                {property.tagline && (
                  <p className="text-sm sm:text-base md:text-lg text-white/55 italic font-light max-w-lg mb-5">{property.tagline}</p>
                )}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  {property.rating > 0 && (
                    <>
                      <div className="flex items-center gap-1.5">
                        <Star size={13} className="fill-secondary text-secondary" />
                        <span className="text-sm font-bold text-white">{property.rating}</span>
                        {property.reviews > 0 && <span className="text-xs text-white/40">({property.reviews} reviews)</span>}
                      </div>
                      <div className="w-px h-3 bg-white/25" />
                    </>
                  )}
                  <div className="flex items-center gap-1.5 text-white/55 text-xs">
                    <MapPin size={12} />
                    <span>Nature Valley, India</span>
                  </div>
                  <div className="w-px h-3 bg-white/25" />
                  <div className="text-white/55 text-xs">
                    From <strong className="text-white font-bold">₹{property.price.toLocaleString()}</strong>/night
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GALLERY */}
        {property.gallery.length > 1 && (
          <section className="py-10 sm:py-14 bg-background">
            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-px bg-secondary" />
                    <span className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-secondary font-medium">Gallery</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                    Photo <span className="italic font-light text-gradient-gold">Collection</span>
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => scrollGallery('left')} disabled={!canScrollLeft}
                    className={`w-8 h-8 rounded-md border flex items-center justify-center transition-all ${canScrollLeft ? 'border-border text-foreground hover:bg-primary/5 hover:border-primary/30' : 'border-border/30 text-muted-foreground/30 cursor-not-allowed'}`}>
                    <ChevronLeft size={14} />
                  </button>
                  <button onClick={() => scrollGallery('right')} disabled={!canScrollRight}
                    className={`w-8 h-8 rounded-md border flex items-center justify-center transition-all ${canScrollRight ? 'border-border text-foreground hover:bg-primary/5 hover:border-primary/30' : 'border-border/30 text-muted-foreground/30 cursor-not-allowed'}`}>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
            <div ref={galleryScrollRef}
              className="flex gap-3 overflow-x-auto scrollbar-hide px-5 sm:px-6 lg:px-[calc((100vw-80rem)/2+2.5rem)] pb-2"
              style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {property.gallery.map((img, i) => (
                <div key={i}
                  className="relative shrink-0 w-[280px] sm:w-[340px] lg:w-[400px] h-[200px] sm:h-[240px] lg:h-[280px] rounded-lg overflow-hidden group cursor-pointer border border-border/30"
                  style={{ scrollSnapAlign: 'start' }}>
                  <Image src={img} alt={`${property.name} photo ${i + 1}`} fill className="object-cover transition-transform duration-600 group-hover:scale-105" sizes="400px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/40 backdrop-blur-sm rounded-md text-[9px] text-white/80 font-medium">
                    {i + 1}/{property.gallery.length}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ABOUT + FEATURES */}
        <section className="py-14 sm:py-20 bg-ivory/40">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
            <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
              <div ref={aboutRef} className={`lg:col-span-3 transition-all duration-700 ${aboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-px bg-secondary" />
                  <span className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-secondary font-medium">About</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  {property.name.split(' ')[0]}{' '}
                  <span className="italic font-light text-gradient-gold">{property.name.split(' ').slice(1).join(' ')}</span>
                </h2>
                <p className="text-sm sm:text-[15px] text-muted-foreground leading-[1.85] mt-6">{property.description}</p>
                {property.amenities && (
                  <div className="mt-4">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">Amenities</p>
                    <p className="text-sm text-muted-foreground">{property.amenities}</p>
                  </div>
                )}
              </div>

              <div ref={featuresRef} className={`lg:col-span-2 transition-all duration-700 delay-150 ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-px bg-secondary" />
                  <span className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-secondary font-medium">Features</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  What&apos;s <span className="italic font-light text-gradient-gold">Included</span>
                </h2>
                <div className="space-y-0 mt-6">
                  {property.features.map((feature, i) => (
                    <div key={feature}
                      className={`flex items-center gap-3 py-3 border-b border-border/40 last:border-0 transition-all duration-500 ${featuresVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                      style={{ transitionDelay: `${150 + i * 50}ms` }}>
                      <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                        <Check size={11} className="text-primary" />
                      </div>
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STICKY BOOKING BAR (mobile) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border/40 px-5 py-3 safe-area-pb">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] text-muted-foreground uppercase tracking-widest">From</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-foreground">₹{property.price.toLocaleString()}</span>
                <span className="text-[10px] text-muted-foreground">/night</span>
              </div>
            </div>
            <a
              href={`https://wa.me/919526522031?text=${encodeURIComponent(`Hi, I would like to know more about ${property.name} at Gramamstays Resort.`)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary to-primary/90 text-white rounded-md text-sm font-medium"
            >
              <Phone size={13} /> Book
            </a>
          </div>
        </div>

        <div className="lg:hidden h-20" />
      </main>
      <Footer />
    </>
  )
}
