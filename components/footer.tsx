'use client'

import Link from 'next/link'
import { Heart, ArrowUp, Send, Globe, MessageCircle, Play, Camera } from 'lucide-react'
import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useState, useEffect } from 'react'

const quickLinks = [
  { label: 'Rooms & Suites', href: '#rooms' },
  { label: 'Amenities', href: '#amenities' },
  { label: 'Dining', href: '#dining' },
  { label: 'Experiences', href: '#experience' },
]

const services = [
  { label: 'Spa & Wellness', href: '#amenities' },
  { label: 'Concierge', href: '#contact' },
  { label: 'Private Events', href: '#' },
  { label: 'Airport Transfers', href: '#' },
]

export function Footer() {
  const currentYear = new Date().getFullYear()
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 })
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [email, setEmail] = useState('')

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 600)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <>
      <footer className="relative overflow-hidden" ref={ref}>
        {/* Background Image */}
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{ backgroundImage: 'url(/hero-resort.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/95 via-primary/92 to-forest/98" />
        </div>

        <div className="max-w-8xl mx-auto px-5 sm:px-6 lg:px-10 relative z-10">
          {/* Newsletter Section */}
          <div className="py-10 sm:py-14 border-b border-white/15">
            <div className="grid sm:grid-cols-2 gap-6 sm:gap-10 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3">Stay Inspired</h3>
                <p className="text-white/60 text-xs sm:text-sm max-w-md">Join our circle for exclusive offers, seasonal events, and luxury travel inspiration.</p>
              </motion.div>
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 }}
                onSubmit={(e) => { e.preventDefault(); setEmail('') }}
                className="flex gap-2 sm:gap-3"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 min-w-0 px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all text-sm backdrop-blur-sm"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-4 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-secondary to-accent text-white rounded-xl font-medium text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 hover:shadow-lg transition-all shrink-0"
                >
                  <Send size={14} />
                  <span className="hidden sm:inline">Subscribe</span>
                </motion.button>
              </motion.form>
            </div>
          </div>

          {/* Main Footer */}
          <div className="py-10 sm:py-14 grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
            {/* Brand */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="col-span-2 md:col-span-1"
            >
              <div className="flex items-center gap-2 sm:gap-2.5 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                  <span className="text-white font-bold text-xs sm:text-sm">G</span>
                </div>
                <span className="text-base sm:text-lg font-bold text-white">Gramamstays</span>
              </div>
              <p className="text-white/50 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5 max-w-xs">
                An exclusive sanctuary where luxury meets nature.
              </p>
              <div className="flex gap-2.5 sm:gap-3">
                {[Camera, Globe, MessageCircle, Play].map((Icon, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-secondary/30 text-white/70 hover:text-white transition-all"
                  >
                    <Icon size={15} />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Explore */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <h4 className="font-bold text-xs sm:text-sm mb-4 sm:mb-5 text-white">Explore</h4>
              <ul className="space-y-2.5 sm:space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-xs sm:text-sm text-white/50 hover:text-secondary transition-colors duration-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Services */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="font-bold text-xs sm:text-sm mb-4 sm:mb-5 text-white">Services</h4>
              <ul className="space-y-2.5 sm:space-y-3">
                {services.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-xs sm:text-sm text-white/50 hover:text-secondary transition-colors duration-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Quick */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              <h4 className="font-bold text-xs sm:text-sm mb-4 sm:mb-5 text-white">Contact</h4>
              <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-white/50">
                <li>Nature Valley, Nevada</li>
                <li>+1 (555) 123-4567</li>
                <li>hello@gramamstays.com</li>
                <li className="pt-1.5 sm:pt-2">
                  <Link href="#contact" className="text-secondary hover:text-accent transition-colors text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                    Get in Touch &rarr;
                  </Link>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Bottom */}
          <div className="py-5 sm:py-6 border-t border-white/15 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-[10px] sm:text-xs text-white/40">
              &copy; {currentYear} Gramamstays Resort & Spa. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-[10px] sm:text-xs text-white/30 hover:text-white/60 transition-colors">
                Admin
              </Link>
              <p className="text-[10px] sm:text-xs text-white/40 flex items-center gap-1">
                Crafted with <Heart size={9} className="text-secondary fill-secondary" /> in Nature Valley
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top */}
      <motion.button
        onClick={scrollToTop}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: showScrollTop ? 1 : 0, scale: showScrollTop ? 1 : 0.8 }}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 w-10 h-10 sm:w-12 sm:h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-xl hover:bg-primary/90 transition-colors"
        whileHover={{ scale: 1.1, boxShadow: '0 10px 30px rgba(74, 103, 65, 0.3)' }}
        whileTap={{ scale: 0.9 }}
        style={{ pointerEvents: showScrollTop ? 'auto' : 'none' }}
      >
        <ArrowUp size={16} />
      </motion.button>
    </>
  )
}
