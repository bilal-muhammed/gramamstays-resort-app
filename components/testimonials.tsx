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
    <section id="testimonials" className="py-20 sm:py-28 px-5 sm:px-6 lg:px-10 relative overflow-hidden" ref={ref}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{ backgroundImage: 'url(/luxury-room.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/92 to-background/95" />
      </div>

      <div className="max-w-8xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-4 sm:mb-5"
          >
            <div className="w-8 sm:w-10 h-px bg-secondary" />
            <span className="text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase text-secondary font-medium">Guest Stories</span>
            <div className="w-8 sm:w-10 h-px bg-secondary" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-5 leading-tight"
          >
            What Our Guests{' '}
            <span className="italic font-light" style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text', backgroundImage: 'linear-gradient(135deg, #d4a574, #c8956b)', backgroundClip: 'text' }}>Say</span>
          </motion.h2>
        </div>

        {/* Testimonial Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.12 }}
              whileHover={{ y: -4 }}
              className="group relative p-6 sm:p-8 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/60 hover:border-secondary/40 transition-all duration-500 premium-shadow hover:premium-shadow-lg"
            >
              <div className="absolute top-5 right-5 sm:top-6 sm:right-6 text-secondary/10 group-hover:text-secondary/20 transition-colors">
                <Quote size={32} />
              </div>

              <div className="flex gap-0.5 sm:gap-1 mb-4 sm:mb-5">
                {Array.from({ length: testimonial.rating }).map((_, j) => (
                  <Star key={j} size={13} className="fill-secondary text-secondary" />
                ))}
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6 sm:mb-8 text-xs sm:text-sm italic">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              <div className="flex items-center gap-3 sm:gap-4 pt-5 sm:pt-6 border-t border-border/50">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xs sm:text-sm shrink-0">
                  {testimonial.avatar}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-foreground text-xs sm:text-sm">{testimonial.name}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{testimonial.role} &middot; {testimonial.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 sm:mt-14 grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-14"
        >
          {[
            { name: 'TripAdvisor', badge: "Travelers' Choice 2024" },
            { name: 'Forbes', badge: '5-Star Rating' },
            { name: 'Cond\u00E9 Nast', badge: 'Gold List' },
            { name: 'Luxury Travel', badge: 'Award Winner' },
          ].map((award) => (
            <div key={award.name} className="text-center">
              <p className="text-sm sm:text-base md:text-lg font-bold text-foreground/80">{award.name}</p>
              <p className="text-[9px] sm:text-[10px] text-secondary tracking-widest uppercase mt-0.5 sm:mt-1">{award.badge}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
