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
    <section id="experience" className="py-20 sm:py-28 px-5 sm:px-6 lg:px-10 relative overflow-hidden" ref={ref}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{ backgroundImage: 'url(/spa-wellness.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background/95" />
      </div>

      <div className="max-w-8xl mx-auto relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-4 sm:mb-5"
          >
            <div className="w-8 sm:w-10 h-px bg-secondary" />
            <span className="text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase text-secondary font-medium">The Gramamstays Difference</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 leading-tight"
          >
            An Experience{' '}
            <span className="italic font-light" style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text', backgroundImage: 'linear-gradient(135deg, #d4a574, #c8956b)', backgroundClip: 'text' }}>Beyond</span>{' '}
            Ordinary
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-muted-foreground leading-relaxed"
          >
            We don&rsquo;t just offer rooms — we curate memories. Every detail is designed to enchant.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="group relative p-6 sm:p-8 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/60 hover:border-secondary/50 transition-all duration-500 premium-shadow hover:premium-shadow-lg cursor-default"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-gradient-to-br from-secondary/20 to-accent/10 flex items-center justify-center group-hover:from-secondary/30 group-hover:to-accent/20 transition-all duration-500">
                  <Icon size={20} className="text-secondary" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-3 mt-3 sm:mt-4">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Full Width Image Banner */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 sm:mt-20 relative rounded-2xl sm:rounded-3xl overflow-hidden h-[300px] sm:h-[350px] md:h-[420px]"
        >
          <div className="absolute inset-0" style={{ backgroundImage: 'url(/hero-resort.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/40" />
          <div className="absolute inset-0 z-10 flex items-center">
            <div className="px-6 sm:px-10 md:px-20 max-w-3xl">
              <h3 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 sm:mb-5 leading-tight">
                Your Journey to{' '}
                <span className="italic font-light">Inner Peace</span>{' '}
                Begins Here
              </h3>
              <p className="text-white/70 text-sm sm:text-lg mb-6 sm:mb-8 max-w-xl">
                Surrender to the rhythm of nature. Our wellness retreats combine ancient healing with modern luxury.
              </p>
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 15px 35px rgba(0,0,0,0.2)' }}
                whileTap={{ scale: 0.97 }}
                className="px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-primary rounded-full font-medium text-xs sm:text-sm tracking-widest uppercase hover:bg-white/90 transition-all"
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
