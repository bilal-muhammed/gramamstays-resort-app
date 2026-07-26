'use client'

import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Eleanor Whitfield',
    role: 'Travel Connoisseur',
    location: 'London, UK',
    rating: 5,
    text: 'Gramamstays redefined luxury for me. From the handwritten welcome note to the sunset yoga, every moment was extraordinary.',
    avatar: 'E',
  },
  {
    name: 'James & Sofia Chen',
    role: 'Anniversary',
    location: 'Singapore',
    rating: 5,
    text: 'The private villa with infinity pool at sunrise is a memory we will treasure forever. Truly exceeded every expectation.',
    avatar: 'J',
  },
  {
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

  return (
    <section id="testimonials" className="py-14 sm:py-20 px-5 sm:px-6 lg:px-10 relative overflow-hidden" ref={ref}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{ backgroundImage: 'url(/luxury-room.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/93 to-background/95" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-11">
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

        {/* Testimonial Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              whileHover={{ y: -3 }}
              className="group relative p-5 sm:p-6 rounded-lg bg-card/80 backdrop-blur-sm border border-border/50 hover:border-secondary/35 transition-all duration-400 premium-shadow hover:premium-shadow-lg"
            >
              <div className="absolute top-4 right-4 text-secondary/10 group-hover:text-secondary/15 transition-colors">
                <Quote size={26} />
              </div>

              <div className="flex gap-0.5 mb-3 sm:mb-4">
                {Array.from({ length: testimonial.rating }).map((_, j) => (
                  <Star key={j} size={12} className="fill-secondary text-secondary" />
                ))}
              </div>

              <p className="text-muted-foreground leading-relaxed mb-5 text-xs sm:text-sm italic">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-border/40">
                <div className="w-9 h-9 rounded-md bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-[11px] shrink-0">
                  {testimonial.avatar}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-foreground text-xs">{testimonial.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{testimonial.role} &middot; {testimonial.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
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
