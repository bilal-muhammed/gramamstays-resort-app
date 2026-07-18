'use client'

import { Waves, Utensils, Dumbbell, Leaf, Wifi, Zap, Sparkles, Car, Baby, Wine } from 'lucide-react'
import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const amenities = [
  { icon: Waves, name: 'Infinity Pool', description: 'Olympic-sized heated pool with panoramic mountain views.', accent: 'from-blue-500/10 to-cyan-500/10' },
  { icon: Utensils, name: 'Gourmet Dining', description: 'Three restaurants with farm-to-table cuisine by Michelin chefs.', accent: 'from-orange-500/10 to-amber-500/10' },
  { icon: Leaf, name: 'Spa & Wellness', description: 'Full-service sanctuary with Ayurvedic treatments and steam rooms.', accent: 'from-emerald-500/10 to-green-500/10' },
  { icon: Dumbbell, name: 'Fitness Center', description: 'State-of-the-art equipment, personal trainers, and yoga classes.', accent: 'from-red-500/10 to-rose-500/10' },
  { icon: Sparkles, name: 'Beauty Salon', description: 'Hair styling, facials, manicures, and holistic beauty rituals.', accent: 'from-purple-500/10 to-pink-500/10' },
  { icon: Wine, name: 'Wine Cellar', description: '500+ labels from premier vineyards with private tastings.', accent: 'from-rose-500/10 to-red-500/10' },
  { icon: Car, name: 'Valet & Transfer', description: 'Complimentary valet and luxury airport transfers.', accent: 'from-slate-500/10 to-gray-500/10' },
  { icon: Wifi, name: 'High-Speed WiFi', description: 'Enterprise-grade fiber connectivity throughout the resort.', accent: 'from-sky-500/10 to-blue-500/10' },
  { icon: Zap, name: 'Concierge', description: '24/7 team for helicopter tours and bespoke experiences.', accent: 'from-yellow-500/10 to-amber-500/10' },
  { icon: Baby, name: 'Kids Club', description: 'Supervised adventure zone with educational activities.', accent: 'from-teal-500/10 to-cyan-500/10' },
]

export function Amenities() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 })

  return (
    <section id="amenities" className="py-20 sm:py-28 px-5 sm:px-6 lg:px-10 relative" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{ backgroundImage: 'url(/spa-wellness.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/96 via-background/93 to-background/96" />
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
            <span className="text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase text-secondary font-medium">Facilities & Services</span>
            <div className="w-8 sm:w-10 h-px bg-secondary" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-5 leading-tight"
          >
            World-Class{' '}
            <span className="italic font-light" style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text', backgroundImage: 'linear-gradient(135deg, #d4a574, #c8956b)', backgroundClip: 'text' }}>Amenities</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-base text-muted-foreground"
          >
            Premium facilities designed to elevate every moment of your stay.
          </motion.p>
        </div>

        {/* Amenities Grid - 2 cols on mobile, 3 on md, 5 on lg */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
          {amenities.map((amenity, i) => {
            const Icon = amenity.icon
            return (
              <motion.div
                key={amenity.name}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.06 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group p-4 sm:p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/60 hover:border-secondary/40 transition-all duration-500 premium-shadow hover:premium-shadow-lg cursor-default text-center"
              >
                <div className={`inline-flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${amenity.accent} mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-500`}>
                  <Icon size={20} className="text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-foreground mb-1.5 sm:mb-2">{amenity.name}</h3>
                <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed hidden sm:block">{amenity.description}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Highlight Banners */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10 sm:mt-14 grid sm:grid-cols-2 gap-4 sm:gap-6"
        >
          {/* Spa Banner */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-60 sm:h-72 group">
            <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: 'url(/spa-wellness.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-8">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1.5 sm:mb-2">Premium Spa</h3>
              <p className="text-white/70 text-sm mb-4 sm:mb-5 max-w-sm">Signature wellness treatments by expert therapists.</p>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="self-start px-6 sm:px-7 py-2 sm:py-2.5 bg-white text-primary rounded-full font-medium text-xs sm:text-sm hover:bg-white/90 transition-all"
              >
                Book a Treatment
              </motion.button>
            </div>
          </div>

          {/* Pool Banner */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-60 sm:h-72 group">
            <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: 'url(/hero-resort.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-8">
              <div className="flex gap-3 sm:gap-4 mb-3 sm:mb-4">
                {[
                  { value: '50m', label: 'Length' },
                  { value: '28\u00B0C', label: 'Heated' },
                  { value: '24/7', label: 'Access' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-lg sm:text-xl font-bold text-white">{stat.value}</p>
                    <p className="text-[9px] sm:text-[10px] text-white/60 tracking-wider uppercase">{stat.label}</p>
                  </div>
                ))}
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1.5 sm:mb-2">Infinity Pool</h3>
              <p className="text-white/70 text-sm mb-4 sm:mb-5 max-w-sm">Heated pool that seamlessly blends with the horizon.</p>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="self-start px-6 sm:px-7 py-2 sm:py-2.5 bg-white text-secondary rounded-full font-medium text-xs sm:text-sm hover:bg-white/90 transition-all"
              >
                Learn More
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
