'use client'

import { ChefHat, Wine, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const restaurants = [
  {
    icon: ChefHat,
    name: 'Harvest & Hearth',
    type: 'Fine Dining',
    description: 'Elevate your palate with our signature farm-to-table cuisine prepared by award-winning chefs.',
    hours: 'Dinner: 6 PM - 11 PM',
    specialty: 'Contemporary Global Cuisine',
  },
  {
    icon: Wine,
    name: 'The Golden Room',
    type: 'Wine Lounge',
    description: 'Curated collection of wines from around the world in an intimate, sophisticated setting.',
    hours: 'All Day: 10 AM - Midnight',
    specialty: 'Premium Wine Selection',
  },
  {
    icon: Users,
    name: 'Garden Café',
    type: 'Casual Dining',
    description: 'Fresh, light meals with panoramic garden views perfect for any time of day.',
    hours: 'All Day: 7 AM - 10 PM',
    specialty: 'International & Local Favorites',
  },
]

export function Dining() {
  const { ref, isVisible } = useScrollAnimation()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section id="dining" className="py-20 px-4 sm:px-6 lg:px-8 bg-background" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Culinary Excellence
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Embark on a gastronomic journey through our diverse collection of dining experiences.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {restaurants.map((restaurant) => {
            const Icon = restaurant.icon
            return (
              <motion.div
                key={restaurant.name}
                variants={itemVariants}
                className="bg-card rounded-xl p-8 border border-border hover:shadow-lg hover:border-secondary transition-all group"
                whileHover={{ x: 10 }}
              >
                <div className="w-16 h-16 bg-secondary/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-secondary/30 transition-colors">
                  <Icon className="text-secondary group-hover:text-accent transition-colors" size={32} />
                </div>

                <h3 className="text-2xl font-bold text-foreground mb-1">{restaurant.name}</h3>
                <p className="text-sm font-semibold text-primary mb-3">{restaurant.type}</p>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  {restaurant.description}
                </p>

                <div className="space-y-2 border-t border-border pt-4">
                  <p className="text-xs">
                    <span className="font-semibold text-foreground">Hours:</span>{' '}
                    <span className="text-muted-foreground">{restaurant.hours}</span>
                  </p>
                  <p className="text-xs">
                    <span className="font-semibold text-foreground">Specialty:</span>{' '}
                    <span className="text-muted-foreground">{restaurant.specialty}</span>
                  </p>
                </div>

                <button className="w-full mt-6 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all font-medium">
                  Make a Reservation
                </button>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
