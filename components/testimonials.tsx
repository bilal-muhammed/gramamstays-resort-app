'use client'

import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

interface TestimonialData {
  id: string
  name: string
  role: string
  location: string
  rating: number
  text: string
  avatar: string
}

const fallbackTestimonials: TestimonialData[] = [
  {
    id: '1',
    name: 'Eleanor Whitfield',
    role: 'Travel Connoisseur',
    location: 'London, UK',
    rating: 5,
    text: 'Gramamstays redefined luxury for me. From the handwritten welcome note to the sunset yoga, every moment was extraordinary.',
    avatar: 'E',
  },
  {
    id: '2',
    name: 'James & Sofia Chen',
    role: 'Anniversary',
    location: 'Singapore',
    rating: 5,
    text: 'The private villa with infinity pool at sunrise is a memory we will treasure forever. Truly exceeded every expectation.',
    avatar: 'J',
  },
  {
    id: '3',
    name: 'Amara Okafor',
    role: 'Wellness Advocate',
    location: 'Lagos, Nigeria',
    rating: 5,
    text: 'The spa retreat was transformative. After five days, I felt like an entirely new person. The therapists are true healers.',
    avatar: 'A',
  },
]

export function Testimonials() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 })
  const [testimonials, setTestimonials] = useState<TestimonialData[]>(fallbackTestimonials)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    fetch('/api/testimonials')
      .then(res => res.json())
      .then((data: any[]) => {
        const active = data.filter((t: any) => t.status === 'Active')
        if (active.length > 0) {
          setTestimonials(active.map((t: any) => ({
            id: t.id,
            name: t.name,
            role: t.role || '',
            location: t.location || '',
            rating: t.rating || 5,
            text: t.text,
            avatar: t.avatar || t.name.charAt(0),
          })))
        }
      })
      .catch(() => {})
  }, [])

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 5)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5)
    const cardWidth = el.querySelector<HTMLElement>(':scope > div')?.offsetWidth || 300
    const gap = 16
    setActiveIndex(Math.round(el.scrollLeft / (cardWidth + gap)))
  }

  useEffect(() => {
    const el = scrollRef.current
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true })
      checkScroll()
      return () => el.removeEventListener('scroll', checkScroll)
    }
  }, [testimonials])

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = el.querySelector<HTMLElement>(':scope > div')?.offsetWidth || 300
    el.scrollBy({ left: dir === 'left' ? -(cardWidth + 16) : cardWidth + 16, behavior: 'smooth' })
  }

  return (
    <section id="testimonials" className="py-14 sm:py-20 px-5 sm:px-6 lg:px-10 relative overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{ backgroundImage: 'url(/room_1.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/88 to-background/90" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3 mb-3 sm:mb-4"
          >
            <div className="w-8 h-px bg-secondary" />
            <span className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-secondary font-medium">Guest Stories</span>
            <div className="w-8 h-px bg-secondary" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4 leading-tight"
          >
            What Our Guests{' '}
            <span className="italic font-light text-gradient-gold">Say</span>
          </motion.h2>
        </div>

        {/* Horizontal Scroll Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="relative"
        >
          {/* Nav Arrows */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-20 w-9 h-9 rounded-full bg-card/90 backdrop-blur border border-border/50 shadow-lg flex items-center justify-center text-foreground/60 hover:text-foreground hover:border-secondary/40 transition-all duration-200 hidden sm:flex"
            >
              <ChevronLeft size={16} />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-20 w-9 h-9 rounded-full bg-card/90 backdrop-blur border border-border/50 shadow-lg flex items-center justify-center text-foreground/60 hover:text-foreground hover:border-secondary/40 transition-all duration-200 hidden sm:flex"
            >
              <ChevronRight size={16} />
            </button>
          )}

          {/* Cards Container */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 -mx-1 px-1"
          >
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
                whileHover={{ y: -4, scale: 1.015 }}
                className="group snap-start shrink-0 w-[280px] sm:w-[320px] p-4 rounded-xl bg-card/70 backdrop-blur-sm border border-border/40 hover:border-secondary/30 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(191,155,81,0.08)] cursor-default"
              >
                {/* Quote Icon */}
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex gap-0.5">
                    {Array.from({ length: testimonial.rating }).map((_, j) => (
                      <Star key={j} size={11} className="fill-secondary text-secondary" />
                    ))}
                  </div>
                  <Quote size={18} className="text-secondary/10 group-hover:text-secondary/20 transition-colors" />
                </div>

                {/* Text */}
                <p className="text-muted-foreground leading-relaxed mb-4 text-xs sm:text-[13px] italic line-clamp-4">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-2.5 pt-3 border-t border-border/30">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-[10px] shrink-0 ring-2 ring-border/20 group-hover:ring-secondary/20 transition-all">
                    {testimonial.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-foreground text-xs truncate">{testimonial.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{testimonial.role}{testimonial.location ? ` · ${testimonial.location}` : ''}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-5">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  const el = scrollRef.current
                  if (!el) return
                  const cardWidth = el.querySelector<HTMLElement>(':scope > div')?.offsetWidth || 300
                  el.scrollTo({ left: i * (cardWidth + 16), behavior: 'smooth' })
                }}
                className={`rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? 'w-5 h-1.5 bg-secondary'
                    : 'w-1.5 h-1.5 bg-foreground/20 hover:bg-foreground/35'
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-8 sm:mt-11 grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-5 sm:gap-8 md:gap-12"
        >
          {[
            { name: 'TripAdvisor', badge: "Travelers' Choice 2024" },
            { name: 'Forbes', badge: '5-Star Rating' },
            { name: 'Condé Nast', badge: 'Gold List' },
            { name: 'Luxury Travel', badge: 'Award Winner' },
          ].map((award) => (
            <div key={award.name} className="text-center">
              <p className="text-xs sm:text-sm md:text-base font-bold text-foreground/80">{award.name}</p>
              <p className="text-[9px] sm:text-[10px] text-secondary tracking-widest uppercase mt-0.5">{award.badge}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
