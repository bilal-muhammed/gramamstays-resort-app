'use client'

import { Mail, Phone, MapPin, Clock, Send, Loader2, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, type: 'general' }),
      })
      if (res.ok) {
        setStatus('sent')
        setFormData({ name: '', email: '', phone: '', message: '' })
        setTimeout(() => setStatus('idle'), 4000)
      } else {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 3000)
      }
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const contactInfo = [
    { icon: MapPin, label: 'Vadakkumbhagom, Konnakuzhy, Kerala 683575' },
    { icon: Phone, label: '+91 95392 22031' },
    { icon: Mail, label: 'admin@gramamstays.com' },
    { icon: Clock, label: 'Available 24/7' },
  ]

  return (
    <section id="contact" className="py-14 sm:py-20 px-5 sm:px-6 lg:px-10 relative" ref={ref}>
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{ backgroundImage: 'url(/athirapilly_falls.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/55 to-background/60" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3 mb-3">
            <div className="w-8 h-px bg-secondary" />
            <span className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-secondary font-medium font-hand">Reach Out</span>
            <div className="w-8 h-px bg-secondary" />
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.08 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-foreground leading-tight">
            Begin Your <span className="italic font-light text-gradient-gold">Journey</span>
          </motion.h2>
        </div>

        {/* Horizontal: Map Left + Form Right */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.15 }}
          className="grid lg:grid-cols-2 gap-4 sm:gap-5">

          {/* Left: Map */}
          <div className="relative rounded-xl overflow-hidden border border-border/50 premium-shadow h-[260px] sm:h-[300px] lg:h-full lg:min-h-[380px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d981.3923425933334!2d76.43426856959191!3d10.296238899364054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0801001ec6f0bf%3A0xe5ebe3705488559b!2sThe%20Chedi%20by%20Gramam%20stays!5e0!3m2!1sen!2sin!4v1785934232128!5m2!1sen!2sin"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Gramamstays Resort Location"
              allowFullScreen
            />
            <div className="absolute bottom-3 left-3 bg-card/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-border/50 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                  <MapPin size={12} className="text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-foreground">Gramamstays - The Chedi</p>
                  <p className="text-[9px] text-muted-foreground">Chalakkudy, Kerala</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form + Info */}
          <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 premium-shadow p-5 sm:p-6 flex flex-col">
            <div className="mb-4">
              <h3 className="text-sm sm:text-base font-bold text-foreground">Send a Message</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">We respond within 2 hours</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 flex-1">
              <div className="grid sm:grid-cols-2 gap-3">
                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Name *" required
                  className="w-full px-3 py-2.5 rounded-lg border border-border/80 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" />
                <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Email *" required
                  className="w-full px-3 py-2.5 rounded-lg border border-border/80 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" />
              </div>
              <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Phone"
                className="w-full px-3 py-2.5 rounded-lg border border-border/80 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" />
              <textarea value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}
                placeholder="Message *" required rows={3}
                className="w-full px-3 py-2.5 rounded-lg border border-border/80 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none text-sm" />
              <motion.button type="submit" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                disabled={status === 'sending' || status === 'sent'}
                className={`w-full py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                  status === 'sent' ? 'bg-emerald-500 text-white'
                  : status === 'error' ? 'bg-red-500 text-white'
                  : 'bg-gradient-to-r from-primary to-primary/90 text-white hover:shadow-lg'
                }`}>
                {status === 'sending' ? <><Loader2 size={14} className="animate-spin" /> Sending...</>
                : status === 'sent' ? <><CheckCircle2 size={14} /> Sent!</>
                : status === 'error' ? 'Try again'
                : <><Send size={13} /> Send Inquiry</>}
              </motion.button>
            </form>

            {/* Contact Info Row */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border/30">
              {contactInfo.map((info) => {
                const Icon = info.icon
                return (
                  <div key={info.label} className="flex items-center gap-2">
                    <Icon size={12} className="text-secondary shrink-0" />
                    <span className="text-[10px] sm:text-[11px] text-muted-foreground truncate">{info.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
