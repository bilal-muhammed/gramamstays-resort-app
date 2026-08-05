'use client'

import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { TreePine, Sparkles, Mountain, Heart } from 'lucide-react'

const features = [
  {
    icon: Mountain,
    title: 'Mountain Sanctuary',
    description: 'Perched at 6,000 feet with panoramic mountain vistas that redefine tranquility.',
  },
  {
    icon: Sparkles,
    title: 'Bespoke Experiences',
    description: 'From sunrise yoga to private dining under the stars, every moment is crafted.',
  },
  {
    icon: TreePine,
    title: 'Eco-Luxury',
    description: 'Solar-powered suites, organic gardens, and zero-waste dining.',
  },
  {
    icon: Heart,
    title: 'Wellness First',
    description: 'Holistic programs designed by world-renowned practitioners.',
  },
]

export function Experience() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 })

  return (
    <section id="experience" className="py-14 sm:py-20 px-5 sm:px-6 lg:px-10 relative overflow-hidden" ref={ref}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{ backgroundImage: 'url(/spa-wellness.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/87 to-background/90" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-10 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-3 sm:mb-4"
          >
            <div className="w-8 h-px bg-secondary" />
            <span className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-secondary font-medium">The Gramamstays Difference</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 leading-tight"
          >
            An Experience{' '}
            <span className="italic font-light text-gradient-gold">Beyond</span>{' '}
            Ordinary
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-sm sm:text-base text-muted-foreground leading-relaxed"
          >
            We don&rsquo;t just offer rooms — we curate memories. Every detail is designed to enchant.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 25 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className="group relative p-5 sm:p-6 rounded-lg bg-card/80 backdrop-blur-sm border border-border/50 hover:border-secondary/40 transition-all duration-400 premium-shadow hover:premium-shadow-lg cursor-default"
              >
                <div className="w-10 h-10 rounded-md bg-secondary/10 flex items-center justify-center mb-3 group-hover:bg-secondary/15 transition-colors duration-400">
                  <Icon size={18} className="text-secondary" strokeWidth={1.5} />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-foreground mb-1.5">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Full Width Image Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-12 sm:mt-16 relative rounded-lg overflow-hidden h-[250px] sm:h-[300px] md:h-[360px]"
        >
          <div className="absolute inset-0" style={{ backgroundImage: 'url(/hero-resort_1.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/40" />
          <div className="absolute inset-0 z-10 flex items-center">
            <div className="px-6 sm:px-10 md:px-16 max-w-3xl">
              <h3 className="text-xl sm:text-2xl md:text-4xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                Your Journey to{' '}
                <span className="italic font-light">Inner Peace</span>{' '}
                Begins Here
              </h3>
              <p className="text-white/65 text-xs sm:text-base mb-5 sm:mb-6 max-w-md">
                Surrender to the rhythm of nature. Our wellness retreats combine ancient healing with modern luxury.
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-6 py-2.5 bg-white text-primary rounded-md font-medium text-xs sm:text-sm tracking-wide"
              >
                Discover Wellness
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
