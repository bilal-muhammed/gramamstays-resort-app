'use client'

import Link from 'next/link'
import { Heart, Star, Zap, Award } from 'lucide-react'
import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const { ref, isVisible } = useScrollAnimation()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <footer className="bg-primary text-white py-16 px-4 sm:px-6 lg:px-8" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="grid md:grid-cols-4 gap-12 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {/* Brand */}
          <motion.div variants={itemVariants}>
            <motion.div
              className="flex items-center gap-2 mb-4"
              whileHover={{ x: 5 }}
            >
              <motion.div
                className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-primary font-bold">G</span>
              </motion.div>
              <h3 className="text-lg font-bold">Gramamstays</h3>
            </motion.div>
            <p className="text-white/80 text-sm">Experience luxury in perfect harmony with nature.</p>
            <div className="flex gap-4 mt-6">
              {[Heart, Star, Zap, Award].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="hover:text-secondary transition-colors"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#rooms" className="hover:text-secondary transition-colors">
                  Rooms & Suites
                </Link>
              </li>
              <li>
                <Link href="#amenities" className="hover:text-secondary transition-colors">
                  Amenities
                </Link>
              </li>
              <li>
                <Link href="#dining" className="hover:text-secondary transition-colors">
                  Dining
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-secondary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div variants={itemVariants}>
            <h4 className="font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Spa & Wellness
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Concierge
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Events & Meetings
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Packages
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Policies */}
          <motion.div variants={itemVariants}>
            <h4 className="font-bold mb-4">Information</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Cancellation Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/70">
              &copy; {currentYear} Gramamstays. All rights reserved.
            </p>
            <p className="text-sm text-white/70">
              Luxury Resort & Spa | Mountain Retreat
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
