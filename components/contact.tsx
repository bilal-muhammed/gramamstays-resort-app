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
    <section id="contact" className="py-14 sm:py-20 px-5 sm:px-6 lg:px-10 relative" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{ backgroundImage: 'url(/luxury-room.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/96 via-background/94 to-background/96" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-11">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3 mb-3 sm:mb-4"
          >
            <div className="w-8 h-px bg-secondary" />
            <span className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-secondary font-medium">Reach Out</span>
            <div className="w-8 h-px bg-secondary" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4 leading-tight"
          >
            Begin Your{' '}
            <span className="italic font-light text-gradient-gold">Journey</span>
          </motion.h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Contact Info */}
          <motion.div
            className="lg:col-span-2 space-y-3.5 sm:space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {contactInfo.map((info) => {
              const Icon = info.icon
              return (
                <motion.div
                  key={info.label}
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="flex gap-3 group"
                >
                  <div className="w-9 h-9 rounded-md bg-secondary/10 flex items-center justify-center shrink-0 group-hover:bg-secondary/15 transition-colors">
                    <Icon className="text-secondary" size={15} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">{info.label}</p>
                    <p className="text-foreground font-medium text-xs sm:text-sm">{info.value}</p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-card/80 backdrop-blur-sm rounded-lg p-5 sm:p-6 border border-border/50 premium-shadow">
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="grid sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[10px] font-semibold text-foreground mb-1.5 uppercase tracking-wider">Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-md border border-border/80 bg-background focus:outline-none focus:ring-1.5 focus:ring-primary/30 focus:border-primary transition-all text-sm"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-foreground mb-1.5 uppercase tracking-wider">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-md border border-border/80 bg-background focus:outline-none focus:ring-1.5 focus:ring-primary/30 focus:border-primary transition-all text-sm"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-foreground mb-1.5 uppercase tracking-wider">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-border/80 bg-background focus:outline-none focus:ring-1.5 focus:ring-primary/30 focus:border-primary transition-all text-sm"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-foreground mb-1.5 uppercase tracking-wider">Message *</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-border/80 bg-background focus:outline-none focus:ring-1.5 focus:ring-primary/30 focus:border-primary transition-all resize-none h-20 sm:h-24 text-sm"
                    placeholder="Tell us about your ideal stay..."
                    required
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={isSubmitted}
                  className={`w-full py-2.5 rounded-md font-semibold text-sm tracking-wide flex items-center justify-center gap-2 transition-all ${
                    isSubmitted
                      ? 'bg-green-500 text-white'
                      : 'bg-gradient-to-r from-primary to-primary/90 text-white hover:shadow-lg'
                  }`}
                >
                  {isSubmitted ? (
                    <>Sent Successfully!</>
                  ) : (
                    <>
                      Send Message <Send size={13} />
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
