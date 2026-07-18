'use client'

import { Waves, Utensils, Dumbbell, Leaf, Wifi, Zap } from 'lucide-react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const amenities = [
  {
    icon: Waves,
    name: 'Infinity Pool',
    description: 'Olympic-sized pool with breathtaking views and premium poolside service.',
  },
  {
    icon: Utensils,
    name: 'Gourmet Dining',
    description: 'World-class chefs crafting culinary masterpieces with farm-to-table ingredients.',
  },
  {
    icon: Leaf,
    name: 'Spa & Wellness',
    description: 'Full-service spa offering rejuvenating treatments and wellness programs.',
  },
  {
    icon: Dumbbell,
    name: 'Fitness Center',
    description: 'State-of-the-art facilities with personal trainers and yoga classes.',
  },
  {
    icon: Wifi,
    name: 'High-Speed WiFi',
    description: 'Seamless connectivity throughout the resort for your convenience.',
  },
  {
    icon: Zap,
    name: 'Concierge Service',
    description: '24/7 dedicated concierge team to arrange any experience you desire.',
  },
]

export function Amenities() {
  const { ref, isVisible } = useScrollAnimation()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section id="amenities" className="py-20 px-4 sm:px-6 lg:px-8 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            World-Class Amenities
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Indulge in a curated selection of premium facilities designed for your ultimate relaxation and enjoyment.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {amenities.map((amenity) => {
            const Icon = amenity.icon
            return (
              <motion.div
                key={amenity.name}
                variants={itemVariants}
                className="p-8 bg-card rounded-xl border border-border hover:border-secondary hover:shadow-lg transition-all duration-300 text-center"
                whileHover={{ y: -8 }}
              >
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <Icon size={32} className="text-primary" />
                </motion.div>
                <h3 className="text-2xl font-bold text-foreground mb-2">{amenity.name}</h3>
                <p className="text-muted-foreground">{amenity.description}</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Spa Image Section */}
        <motion.div
          className="relative h-96 rounded-xl overflow-hidden border border-border shadow-xl"
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <Image
            src="/spa-wellness.png"
            alt="Spa and Wellness Center"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-all duration-300" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <h3 className="text-4xl font-bold mb-3 text-balance">Premium Spa Experiences</h3>
              <p className="text-lg mb-6">Rejuvenate with our signature wellness treatments</p>
              <motion.button
                className="px-8 py-3 bg-secondary text-white rounded-lg hover:bg-accent transition-all font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Book a Treatment
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
