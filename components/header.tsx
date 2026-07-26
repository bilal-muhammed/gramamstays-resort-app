'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Menu, X, Phone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const WHATSAPP_NUMBER = '919539222031'
const WHATSAPP_BASE = `https://wa.me/${WHATSAPP_NUMBER}`
const WHATSAPP_BOOKING = `${WHATSAPP_BASE}?text=${encodeURIComponent('Hi, I would like to book a stay at Gramamstays Resort. Please share the availability and pricing.')}`

const navItems = [
  { label: 'Experience', href: '#experience' },
  { label: 'Rooms', href: '#rooms' },
  { label: 'Amenities', href: '#amenities' },
  { label: 'Dining', href: '#dining' },
  { label: 'Stories', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)

      const sections = navItems.map(item => item.href.slice(1))
      for (const section of [...sections].reverse()) {
        const el = document.getElementById(section)
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(section)
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isMenuOpen])

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed w-full top-0 z-50 transition-all duration-400 ${
          scrolled
            ? 'bg-background/92 backdrop-blur-xl border-b border-border/40 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
          <div className="flex justify-between items-center h-14 sm:h-16 lg:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group relative z-10">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.04 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-md overflow-hidden shadow-sm relative bg-black">
                  <Image src="/logo.png" alt="Gramamstays Logo" fill className="object-contain" sizes="40px" priority />
                </div>
              </motion.div>
              <div className="hidden sm:block">
                <h1 className={`text-sm lg:text-base font-bold tracking-tight transition-colors duration-400 ${
                  scrolled ? 'text-foreground' : 'text-white'
                }`}>
                  Gramamstays
                </h1>
                <p className={`text-[9px] lg:text-[10px] tracking-[0.2em] uppercase transition-colors duration-400 ${
                  scrolled ? 'text-muted-foreground' : 'text-white/55'
                }`}>
                  Resort & Wellness
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3 py-1.5 text-[12px] font-medium tracking-wide transition-all duration-300 group ${
                    activeSection === item.href.slice(1)
                      ? scrolled
                        ? 'text-primary'
                        : 'text-white'
                      : scrolled
                        ? 'text-muted-foreground hover:text-foreground'
                        : 'text-white/65 hover:text-white'
                  }`}
                >
                  {item.label}
                  <span className={`absolute bottom-0.5 left-3 right-3 h-px transition-all duration-300 ${
                    activeSection === item.href.slice(1)
                      ? scrolled
                        ? 'bg-primary scale-x-100'
                        : 'bg-white scale-x-100'
                      : 'bg-current scale-x-0 group-hover:scale-x-100'
                  }`} />
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <motion.a
                href={WHATSAPP_BOOKING}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1.5 text-[12px] font-medium transition-colors duration-300 ${
                  scrolled ? 'text-muted-foreground hover:text-foreground' : 'text-white/65 hover:text-white'
                }`}
                whileHover={{ scale: 1.02 }}
              >
                <Phone size={12} />
                <span className="hidden xl:inline">+91 95392 22031</span>
              </motion.a>
              <motion.a
                href={WHATSAPP_BOOKING}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`px-5 py-2 font-medium text-[12px] tracking-wide transition-all duration-300 ${
                  scrolled
                    ? 'bg-gradient-to-r from-secondary to-accent text-white'
                    : 'bg-white/15 text-white backdrop-blur-sm border border-white/20 hover:bg-white/25'
                } rounded-md`}
              >
                Book Your Stay
              </motion.a>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className={`lg:hidden p-2 rounded-md transition-colors duration-300 relative z-10 ${
                scrolled ? 'text-foreground' : 'text-white'
              }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              {isMenuOpen ? <X size={19} /> : <Menu size={19} />}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-background/98 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex flex-col justify-center items-center h-full px-6">
              <nav className="flex flex-col gap-1 items-center">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: i * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={item.href}
                      className="text-xl sm:text-2xl font-light text-foreground hover:text-secondary transition-colors duration-300 block py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navItems.length * 0.05, duration: 0.35 }}
                className="mt-7 flex flex-col items-center gap-3"
              >
                <div className="w-10 h-px bg-secondary" />
                <p className="text-[10px] text-muted-foreground tracking-[0.25em] uppercase">Call us</p>
                <a href={WHATSAPP_BOOKING} target="_blank" rel="noopener noreferrer" className="text-sm text-foreground font-medium">+91 95392 22031</a>
                <a
                  href={WHATSAPP_BOOKING}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 px-8 py-3 bg-gradient-to-r from-secondary to-accent text-white rounded-md font-medium text-sm tracking-wide"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Book Your Stay
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
