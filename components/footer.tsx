'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, ArrowUp, Send, Globe, MessageCircle, Play, Camera } from 'lucide-react'
import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useState, useEffect } from 'react'

const quickLinks = [
  { label: 'Properties', href: '#properties' },
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

        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 relative z-10">
          {/* Newsletter Section */}
          <div className="py-8 sm:py-11 border-b border-white/15">
            <div className="grid sm:grid-cols-2 gap-5 sm:gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1.5 sm:mb-2">Stay Inspired</h3>
                <p className="text-white/55 text-xs sm:text-sm max-w-md">Join our circle for exclusive offers, seasonal events, and luxury travel inspiration.</p>
              </motion.div>
              <motion.form
                initial={{ opacity: 0, y: 15 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.08 }}
                onSubmit={(e) => { e.preventDefault(); setEmail('') }}
                className="flex gap-2"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 min-w-0 px-4 py-2.5 rounded-md bg-white/10 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-1.5 focus:ring-secondary/50 transition-all text-sm backdrop-blur-sm"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-4 sm:px-5 py-2.5 bg-gradient-to-r from-secondary to-accent text-white rounded-md font-medium text-xs sm:text-sm flex items-center gap-1.5 hover:shadow-md transition-all shrink-0"
                >
                  <Send size={13} />
                  <span className="hidden sm:inline">Subscribe</span>
                </motion.button>
              </motion.form>
            </div>
          </div>

          {/* Main Footer */}
          <div className="py-8 sm:py-11 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {/* Brand */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="col-span-2 md:col-span-1"
            >
              <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
                <div className="w-9 h-9 rounded-md overflow-hidden relative bg-black">
                  <Image src="/logo.png" alt="Gramamstays Logo" fill className="object-contain" sizes="36px" />
                </div>
                <span className="text-sm sm:text-base font-bold text-white">Gramamstays</span>
              </div>
              <p className="text-white/45 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 max-w-xs">
                An exclusive sanctuary where luxury meets nature.
              </p>
              <div className="flex gap-2">
                {[Camera, Globe, MessageCircle, Play].map((Icon, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    whileHover={{ scale: 1.08, y: -1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center hover:bg-secondary/30 text-white/65 hover:text-white transition-all"
                  >
                    <Icon size={14} />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Explore */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.12 }}
            >
              <h4 className="font-bold text-xs sm:text-sm mb-3 sm:mb-4 text-white">Explore</h4>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-xs sm:text-sm text-white/45 hover:text-secondary transition-colors duration-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Services */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.16 }}
            >
              <h4 className="font-bold text-xs sm:text-sm mb-3 sm:mb-4 text-white">Services</h4>
              <ul className="space-y-2">
                {services.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-xs sm:text-sm text-white/45 hover:text-secondary transition-colors duration-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Quick */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h4 className="font-bold text-xs sm:text-sm mb-3 sm:mb-4 text-white">Contact</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-white/45">
                <li>Nature Valley, India</li>
                <li>+91 95392 22031</li>
                <li>+91 97447 89195</li>
                <li>hello@gramamstays.com</li>
                <li className="pt-1">
                  <a href="https://wa.me/919526522031?text=Hi%2C%20I%20would%20like%20to%20get%20in%20touch%20with%20Gramamstays%20Resort." target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-accent transition-colors text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider">
                    Get in Touch &rarr;
                  </a>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Bottom */}
          <div className="py-4 sm:py-5 border-t border-white/15 flex flex-col sm:flex-row justify-between items-center gap-2.5">
            <p className="text-[10px] sm:text-[11px] text-white/40">
              &copy; {currentYear} Gramamstays Resort & Spa. All rights reserved.
            </p>
            <p className="text-[10px] sm:text-[11px] text-white/40 flex items-center gap-1">
              Crafted with <Heart size={8} className="text-secondary fill-secondary" /> in Nature Valley
            </p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top */}
      <motion.button
        onClick={scrollToTop}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: showScrollTop ? 1 : 0, scale: showScrollTop ? 1 : 0.8 }}
        className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50 w-9 h-9 sm:w-10 sm:h-10 bg-primary text-white rounded-md flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.9 }}
        style={{ pointerEvents: showScrollTop ? 'auto' : 'none' }}
      >
        <ArrowUp size={15} />
      </motion.button>
    </>
  )
}
