'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ChevronDown } from 'lucide-react'

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1])

  return (
    <section ref={containerRef} className="relative w-full h-[85vh] min-h-[500px] max-h-[800px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div className="absolute inset-0" style={{ y: bgY, scale }}>
        <Image
          src="/main_banner_.png"
          alt="Gramamstays Luxury Resort"
          fill
          className="object-cover object-[70%_40%] sm:object-center"
          priority
        />
      </motion.div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-black/15" />

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-background to-transparent" />

      {/* Content */}
      <motion.div className="relative z-10 text-center text-white max-w-4xl px-5 sm:px-6" style={{ y: textY, opacity }}>
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex items-center justify-center gap-3 mb-4 sm:mb-5"
        >
          <div className="w-8 h-px bg-secondary" />
          <span className="text-secondary text-[10px] sm:text-[11px] tracking-[0.3em] uppercase font-medium font-hand">Est. 2024</span>
          <div className="w-8 h-px bg-secondary" />
        </motion.div>

        {/* Main Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display mb-4 sm:mb-5 leading-[0.95] tracking-tight"
        >
          <span className="block">Where Nature</span>
          <span className="block mt-1.5 sm:mt-2">
            Meets{' '}
            <span className="italic font-light text-gradient-gold">Elegance</span>
          </span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-sm sm:text-base md:text-lg text-white/65 max-w-lg sm:max-w-xl mx-auto mb-7 sm:mb-9 font-light leading-relaxed"
        >
        Experience the perfect harmony of nature, comfort, and warm hospitality just moments from Athirappilly Waterfalls.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center"
        >
          <motion.a
            href="https://wa.me/919526522031?text=Hi%2C%20I%20would%20like%20to%20book%20a%20stay%20at%20Gramamstays%20Resort.%20Please%20share%20the%20availability%20and%20pricing."
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto px-7 sm:px-9 py-3 sm:py-3.5 bg-gradient-to-r from-secondary via-secondary to-accent text-white rounded-md font-medium text-xs sm:text-sm tracking-widest uppercase text-center"
          >
            Reserve Your Escape
          </motion.a>
          <motion.button
            whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.12)' }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto px-7 sm:px-9 py-3 sm:py-3.5 bg-white/10 text-white border border-white/20 rounded-md font-medium text-xs sm:text-sm tracking-widest uppercase backdrop-blur-sm"
          >
            Explore the Resort
          </motion.button>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.1 }}
          className="mt-10 sm:mt-14 flex items-center justify-center gap-8 sm:gap-14"
        >
          {[
            { value: '5-Star', label: 'Rating' },
            { value: '150+', label: 'Rooms' },
            { value: '4.9', label: 'Guest Score' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-lg sm:text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-[10px] sm:text-[11px] text-white/45 tracking-[0.15em] uppercase mt-0.5">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="flex flex-col items-center gap-1">
          <span className="text-[9px] text-white/35 tracking-[0.25em] uppercase">Scroll</span>
          <ChevronDown size={13} className="text-white/35" />
        </div>
      </motion.div>
    </section>
  )
}
