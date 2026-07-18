'use client'

import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const message = `Hi, I'm ${formData.name}.\n\n${formData.message}${formData.phone ? `\n\nPhone: ${formData.phone}` : ''}${formData.email ? `\nEmail: ${formData.email}` : ''}`
    const whatsappUrl = `https://wa.me/919539222031?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 3000)
    setFormData({ name: '', email: '', phone: '', message: '' })
  }

  const contactInfo = [
    { icon: MapPin, label: 'Location', value: 'Nature Valley, India' },
    { icon: Phone, label: 'Reservations', value: '+91 95392 22031' },
    { icon: Mail, label: 'Email', value: 'hello@gramamstays.com' },
    { icon: Clock, label: 'Front Desk', value: 'Available 24/7' },
  ]

  return (
    <section id="contact" className="py-20 sm:py-28 px-5 sm:px-6 lg:px-10 relative" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{ backgroundImage: 'url(/luxury-room.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/96 via-background/94 to-background/96" />
      </div>

      <div className="max-w-8xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-4 sm:mb-5"
          >
            <div className="w-8 sm:w-10 h-px bg-secondary" />
            <span className="text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase text-secondary font-medium">Reach Out</span>
            <div className="w-8 sm:w-10 h-px bg-secondary" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-5 leading-tight"
          >
            Begin Your{' '}
            <span className="italic font-light" style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text', backgroundImage: 'linear-gradient(135deg, #d4a574, #c8956b)', backgroundClip: 'text' }}>Journey</span>
          </motion.h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 sm:gap-10">
          {/* Contact Info */}
          <motion.div
            className="lg:col-span-2 space-y-4 sm:space-y-5"
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {contactInfo.map((info) => {
              const Icon = info.icon
              return (
                <motion.div
                  key={info.label}
                  whileHover={{ x: 6 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="flex gap-3 sm:gap-4 group"
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0 group-hover:bg-secondary/20 transition-colors">
                    <Icon className="text-secondary" size={17} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">{info.label}</p>
                    <p className="text-foreground font-medium text-xs sm:text-sm">{info.value}</p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-border/60 premium-shadow">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-[10px] sm:text-xs font-semibold text-foreground mb-1.5 sm:mb-2 uppercase tracking-wider">Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-border/80 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs font-semibold text-foreground mb-1.5 sm:mb-2 uppercase tracking-wider">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-border/80 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-foreground mb-1.5 sm:mb-2 uppercase tracking-wider">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-border/80 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-foreground mb-1.5 sm:mb-2 uppercase tracking-wider">Message *</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-border/80 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none h-24 sm:h-28 text-sm"
                    placeholder="Tell us about your ideal stay..."
                    required
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.01, boxShadow: '0 10px 30px rgba(74, 103, 65, 0.25)' }}
                  whileTap={{ scale: 0.99 }}
                  disabled={isSubmitted}
                  className={`w-full py-3 sm:py-3.5 rounded-lg sm:rounded-xl font-semibold text-sm tracking-wide flex items-center justify-center gap-2 transition-all ${
                    isSubmitted
                      ? 'bg-green-500 text-white'
                      : 'bg-gradient-to-r from-primary to-primary/90 text-white hover:shadow-xl'
                  }`}
                >
                  {isSubmitted ? (
                    <>Sent Successfully!</>
                  ) : (
                    <>
                      Send Message <Send size={14} />
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
