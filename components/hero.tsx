'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ChevronDown } from 'lucide-react'

const floatingElements = [
  { size: 4, x: '15%', y: '25%', delay: 0, duration: 7 },
  { size: 3, x: '80%', y: '15%', delay: 1.5, duration: 6 },
  { size: 5, x: '70%', y: '65%', delay: 0.8, duration: 8 },
  { size: 2, x: '25%', y: '70%', delay: 2, duration: 5 },
  { size: 3, x: '90%', y: '40%', delay: 0.5, duration: 7 },
]

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
    <section ref={containerRef} className="relative w-full h-screen min-h-[600px] max-h-[900px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div className="absolute inset-0" style={{ y: bgY, scale }}>
        <Image
          src="/hero-resort.png"
          alt="Gramamstays Luxury Resort"
          fill
          className="object-cover"
          priority
        />
      </motion.div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />

      {/* Floating Elements - hidden on small screens */}
      {floatingElements.map((el, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/10 backdrop-blur-sm hidden sm:block"
          style={{
            width: el.size * 4,
            height: el.size * 4,
            left: el.x,
            top: el.y,
          }}
          animate={{
            y: [-10, 10, -10],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: el.duration,
            delay: el.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-40 bg-gradient-to-t from-background to-transparent" />

      {/* Content */}
      <motion.div className="relative z-10 text-center text-white max-w-5xl px-5 sm:px-6" style={{ y: textY, opacity }}>
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center justify-center gap-3 mb-5 sm:mb-6"
        >
          <div className="w-6 sm:w-8 h-px bg-secondary" />
          <span className="text-secondary text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase font-medium">Est. 2024</span>
          <div className="w-6 sm:w-8 h-px bg-secondary" />
        </motion.div>

        {/* Main Title */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-5 sm:mb-6 leading-[0.95] tracking-tight"
        >
          <span className="block">Where Nature</span>
          <span className="block mt-1.5 sm:mt-2">
            Meets{' '}
            <span className="italic font-light" style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text', backgroundImage: 'linear-gradient(135deg, #d4a574, #e8c9a8, #d4a574)', backgroundClip: 'text' }}>
              Luxury
            </span>
          </span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-base sm:text-lg md:text-xl text-white/70 max-w-xl sm:max-w-2xl mx-auto mb-8 sm:mb-10 font-light leading-relaxed"
        >
          An exclusive sanctuary nestled in the mountains, offering an unparalleled escape into elegance and world-class hospitality.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: '0 20px 40px rgba(212, 165, 116, 0.3)' }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 bg-gradient-to-r from-secondary via-secondary to-accent text-white rounded-full font-medium text-xs sm:text-sm tracking-widest uppercase shadow-xl"
          >
            Reserve Your Escape
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04, backgroundColor: 'rgba(255,255,255,0.15)' }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 bg-white/10 text-white border border-white/20 rounded-full font-medium text-xs sm:text-sm tracking-widest uppercase backdrop-blur-sm"
          >
            Explore the Resort
          </motion.button>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-12 sm:mt-16 flex items-center justify-center gap-6 sm:gap-10 md:gap-16"
        >
          {[
            { value: '5-Star', label: 'Rating' },
            { value: '150+', label: 'Rooms' },
            { value: '4.9', label: 'Guest Score' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-[10px] sm:text-xs text-white/50 tracking-widest uppercase mt-0.5 sm:mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="flex flex-col items-center gap-1.5 sm:gap-2">
          <span className="text-[9px] sm:text-[10px] text-white/40 tracking-[0.3em] uppercase">Scroll</span>
          <ChevronDown size={14} className="text-white/40" />
        </div>
      </motion.div>
    </section>
  )
}
