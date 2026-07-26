'use client'

import { ChefHat, Wine, Users, Clock, Star, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const restaurants = [
  {
    icon: ChefHat,
    name: 'Harvest & Hearth',
    type: 'Fine Dining',
    description: 'Intimate 32-seat space with nightly tasting menus from estate-garden ingredients.',
    hours: 'Dinner: 6 PM - 11 PM',
    rating: 4.9,
    priceRange: '₹₹₹₹',
    menuHighlights: ['Wagyu Tartare', 'Saffron Risotto', 'Chocolate Fondant'],
    image: '/luxury-room.png',
  },
  {
    icon: Wine,
    name: 'The Golden Room',
    type: 'Wine Lounge',
    description: 'Hand-crafted cocktails, rare vintings, and 500+ curated labels from 12 countries.',
    hours: '10 AM - Midnight',
    rating: 4.8,
    priceRange: '₹₹₹',
    menuHighlights: ['Old Fashioned', 'Truffle Fries', 'Cheese Board'],
    image: '/spa-wellness.png',
  },
  {
    icon: Users,
    name: 'Garden Café',
    type: 'All-Day Dining',
    description: 'Al fresco dining under century-old oaks with panoramic garden vistas.',
    hours: '7 AM - 10 PM',
    rating: 4.7,
    priceRange: '₹₹',
    menuHighlights: ['Eggs Benedict', 'Grilled Sea Bass', 'Açaí Bowl'],
    image: '/hero-resort.png',
  },
]

export function Dining() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 })

  return (
    <section id="dining" className="py-14 sm:py-20 px-5 sm:px-6 lg:px-10 relative overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{ backgroundImage: 'url(/hero-resort.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/96 via-background/94 to-background/96" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 sm:mb-11 gap-4">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-3 sm:mb-4"
            >
              <div className="w-8 h-px bg-secondary" />
              <span className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-secondary font-medium">Culinary Arts</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3 leading-tight"
            >
              Culinary{' '}
              <span className="italic font-light text-gradient-gold">Excellence</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-xs sm:text-sm text-muted-foreground"
            >
              From fine dining to al fresco meals, designed to delight every palate.
            </motion.p>
          </div>
        </div>

        {/* Restaurant Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {restaurants.map((restaurant, i) => {
            const Icon = restaurant.icon
            return (
              <motion.div
                key={restaurant.name}
                initial={{ opacity: 0, y: 35 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
                whileHover={{ y: -4 }}
                className="group rounded-lg overflow-hidden border border-border/40 hover:border-secondary/35 transition-all duration-400 premium-shadow hover:premium-shadow-lg bg-card/80 backdrop-blur-sm"
              >
                {/* Image Header */}
                <div className="relative h-36 sm:h-44 overflow-hidden">
                  <div className="absolute inset-0 transition-transform duration-600 group-hover:scale-105" style={{ backgroundImage: `url(${restaurant.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                  <div className="absolute top-3 left-3 w-9 h-9 rounded-md bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Icon className="text-white" size={17} strokeWidth={1.5} />
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-md px-2 py-0.5">
                    <Star size={10} className="fill-secondary text-secondary" />
                    <span className="text-[10px] sm:text-[11px] font-bold text-white">{restaurant.rating}</span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <h3 className="text-lg sm:text-xl font-bold text-white">{restaurant.name}</h3>
                    <p className="text-[11px] sm:text-xs text-white/65">{restaurant.type} &middot; {restaurant.priceRange}</p>
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  <p className="text-xs text-muted-foreground leading-relaxed mb-2.5">{restaurant.description}</p>

                  {/* Dishes */}
                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    {restaurant.menuHighlights.map((dish) => (
                      <span key={dish} className="px-2 py-0.5 bg-secondary/10 text-secondary-foreground text-[10px] rounded-md font-medium border border-secondary/15">
                        {dish}
                      </span>
                    ))}
                  </div>

                  {/* Hours */}
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-3.5">
                    <Clock size={10} />
                    <span>{restaurant.hours}</span>
                  </div>

                  <motion.a
                    href={`https://wa.me/919539222031?text=${encodeURIComponent(`Hi, I would like to reserve a table at ${restaurant.name} (${restaurant.type}) at Gramamstays Resort.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2 bg-primary text-white rounded-md font-medium text-xs sm:text-sm hover:bg-primary/90 transition-all text-center block"
                  >
                    Reserve a Table
                  </motion.a>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Chef Spotlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-8 sm:mt-11 relative rounded-lg overflow-hidden"
        >
          <div className="absolute inset-0">
            <div className="absolute inset-0" style={{ backgroundImage: 'url(/spa-wellness.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/90 to-primary/70" />
          </div>
          <div className="relative z-10 grid sm:grid-cols-2 gap-0">
            <div className="p-5 sm:p-7 lg:p-9 flex flex-col justify-center">
              <span className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-white/45 mb-2">Chef&apos;s Corner</span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2.5">Meet Chef Aria</h3>
              <p className="text-white/65 leading-relaxed mb-4 sm:mb-5 text-xs sm:text-sm">
                With two Michelin stars, Chef Aria transforms local ingredients into edible art that tells the story of our region.
              </p>
              <div className="flex gap-5 sm:gap-6">
                <div>
                  <p className="text-lg sm:text-xl font-bold text-white">15+</p>
                  <p className="text-[10px] sm:text-[11px] text-white/45">Years Experience</p>
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold text-white">2</p>
                  <p className="text-[10px] sm:text-[11px] text-white/45">Michelin Stars</p>
                </div>
              </div>
            </div>
            <div className="p-5 sm:p-7 lg:p-9 flex flex-col justify-center sm:border-l border-white/10">
              <h4 className="text-sm sm:text-base font-bold text-white mb-2.5">Tonight&apos;s Tasting Menu</h4>
              <div className="space-y-2">
                {[
                  { course: 'Starter', dish: 'Seared Scallops, Cauliflower Purée, Truffle' },
                  { course: 'Main', dish: 'Wagyu Tenderloin, Seasonal Vegetables, Red Wine Jus' },
                  { course: 'Dessert', dish: 'Dark Chocolate Soufflé, Vanilla Bean Ice Cream' },
                ].map((item) => (
                  <div key={item.course} className="flex gap-2">
                    <span className="text-[10px] font-semibold text-secondary uppercase tracking-wider whitespace-nowrap">{item.course}</span>
                    <p className="text-[11px] sm:text-xs text-white/65">{item.dish}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <p className="text-[11px] sm:text-xs text-white/45">7 courses &middot; ₹185/person</p>
                <motion.a
                  href="https://wa.me/919539222031?text=Hi%2C%20I%20would%20like%20to%20reserve%20a%20table%20for%20the%20Chef%27s%20Tasting%20Menu%20at%20Gramamstays%20Resort."
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 3 }}
                  className="flex items-center gap-1 text-xs font-medium text-secondary hover:text-accent transition-colors"
                >
                  Reserve <ArrowRight size={12} />
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
