'use client'

import { Wifi, Dumbbell, Car, Baby, Wine } from 'lucide-react'
import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const amenities = [
  { icon: Wifi, name: 'High-Speed WiFi', description: 'Enterprise-grade fiber connectivity throughout the resort.', accent: 'from-sky-500/10 to-blue-500/10' },
  { icon: Dumbbell, name: 'Fitness Center', description: 'State-of-the-art equipment, personal trainers, and yoga classes.', accent: 'from-red-500/10 to-rose-500/10' },
  { icon: Wine, name: 'Wine Cellar', description: '500+ labels from premier vineyards with private tastings.', accent: 'from-rose-500/10 to-red-500/10' },
  { icon: Car, name: 'Valet & Transfer', description: 'Complimentary valet and luxury airport transfers.', accent: 'from-slate-500/10 to-gray-500/10' },
  { icon: Baby, name: 'Kids Club', description: 'Supervised adventure zone with educational activities.', accent: 'from-teal-500/10 to-cyan-500/10' },
]

export function Amenities() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 })

  return (
    <section id="amenities" className="py-14 sm:py-20 px-5 sm:px-6 lg:px-10 relative" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{ backgroundImage: 'url(/spa-wellness.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/93 via-background/91 to-background/93" />
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
            <span className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-secondary font-medium font-hand">Facilities & Services</span>
            <div className="w-8 h-px bg-secondary" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-foreground mb-3 sm:mb-4 leading-tight"
          >
            World-Class{' '}
            <span className="italic font-light text-gradient-gold">Amenities</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-xs sm:text-sm text-muted-foreground"
          >
            Premium facilities designed to elevate every moment of your stay.
          </motion.p>
        </div>

        {/* Amenities Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4">
          {amenities.map((amenity, i) => {
            const Icon = amenity.icon
            return (
              <motion.div
                key={amenity.name}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.08 + i * 0.05 }}
                whileHover={{ y: -5, transition: { duration: 0.25 } }}
                className="group p-3.5 sm:p-5 rounded-lg bg-card/80 backdrop-blur-sm border border-border/50 hover:border-secondary/35 transition-all duration-400 premium-shadow hover:premium-shadow-lg cursor-default text-center"
              >
                <div className={`inline-flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-md bg-gradient-to-br ${amenity.accent} mb-2.5 sm:mb-3 group-hover:scale-105 transition-transform duration-400`}>
                  <Icon size={17} className="text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="text-[11px] sm:text-xs font-bold text-foreground mb-1">{amenity.name}</h3>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground leading-relaxed hidden sm:block">{amenity.description}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Highlight Banners */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-8 sm:mt-11 grid sm:grid-cols-2 gap-3 sm:gap-5"
        >
          {/* Athirapilly Waterfall Banner */}
          <div className="relative rounded-lg overflow-hidden h-52 sm:h-64 group">
            <div className="absolute inset-0 transition-transform duration-600 group-hover:scale-105" style={{ backgroundImage: 'url(/athirapilly_falls.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
            <div className="relative z-10 h-full flex flex-col justify-end p-5 sm:p-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">Athirapilly Waterfall</h3>
              <p className="text-white/65 text-xs sm:text-sm mb-3 sm:mb-4 max-w-xs">The Niagara of India — just 10 minutes from the resort. A majestic 80ft cascade through lush Shola forests.</p>
              <motion.a
                href="https://wa.me/919526522031?text=Hi%2C%20I%20would%20like%20to%20know%20more%20about%20the%20Athirapilly%20Waterfall%20trip%20from%20Gramamstays%20Resort."
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="self-start px-5 py-2 bg-white text-primary rounded-md font-medium text-xs sm:text-sm text-center"
              >
                Plan a Visit
              </motion.a>
            </div>
          </div>

          {/* Lakeside Escapes Banner */}
          <div className="relative rounded-lg overflow-hidden h-52 sm:h-64 group">
            <div className="absolute inset-0 transition-transform duration-600 group-hover:scale-105" style={{ backgroundImage: 'url(/lakeview_1.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
            <div className="relative z-10 h-full flex flex-col justify-end p-5 sm:p-6">
              <div className="flex gap-3 sm:gap-4 mb-2.5 sm:mb-3">
                {[
                  { value: '3+', label: 'Lakes Nearby' },
                  { value: '10 min', label: 'Drive' },
                  { value: 'Year', label: 'Round' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-base sm:text-lg font-bold text-white">{stat.value}</p>
                    <p className="text-[9px] text-white/55 tracking-wider uppercase">{stat.label}</p>
                  </div>
                ))}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">Lakeside Escapes</h3>
              <p className="text-white/65 text-xs sm:text-sm mb-3 sm:mb-4 max-w-xs">Charakara & Viyyur lakes — serene spots for fishing, kayaking, and sunset views near the resort.</p>
              <motion.a
                href="https://wa.me/919526522031?text=Hi%2C%20I%20would%20like%20to%20know%20more%20about%20the%20lakeside%20experiences%20near%20Gramamstays%20Resort."
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="self-start px-5 py-2 bg-white text-secondary rounded-md font-medium text-xs sm:text-sm text-center"
              >
                Explore Stays
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
