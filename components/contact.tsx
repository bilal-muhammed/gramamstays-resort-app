'use client'

import { Mail, Phone, MapPin, Clock } from 'lucide-react'
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

  const { ref, isVisible } = useScrollAnimation()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setFormData({ name: '', email: '', phone: '', message: '' })
  }

  const infoVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  }

  const formVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Get in Touch
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about your stay? Our dedicated team is here to help.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            className="space-y-8"
            variants={infoVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
          >
            <motion.div
              className="flex gap-4"
              whileHover={{ x: 10 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <motion.div
                className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0"
                whileHover={{ rotate: 10 }}
              >
                <MapPin className="text-secondary" size={24} />
              </motion.div>
              <div>
                <h3 className="font-bold text-foreground mb-1">Location</h3>
                <p className="text-muted-foreground text-sm">
                  Luxury Mountain Road<br />
                  Nature Valley, NV 12345<br />
                  United States
                </p>
              </div>
            </motion.div>

            <motion.div
              className="flex gap-4"
              whileHover={{ x: 10 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <motion.div
                className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0"
                whileHover={{ rotate: 10 }}
              >
                <Phone className="text-secondary" size={24} />
              </motion.div>
              <div>
                <h3 className="font-bold text-foreground mb-1">Phone</h3>
                <p className="text-muted-foreground text-sm">
                  +1 (555) 123-4567<br />
                  +1 (555) 987-6543
                </p>
              </div>
            </motion.div>

            <motion.div
              className="flex gap-4"
              whileHover={{ x: 10 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <motion.div
                className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0"
                whileHover={{ rotate: 10 }}
              >
                <Mail className="text-secondary" size={24} />
              </motion.div>
              <div>
                <h3 className="font-bold text-foreground mb-1">Email</h3>
                <p className="text-muted-foreground text-sm">
                  hello@gramamstays.com<br />
                  reservations@gramamstays.com
                </p>
              </div>
            </motion.div>

            <motion.div
              className="flex gap-4"
              whileHover={{ x: 10 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <motion.div
                className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0"
                whileHover={{ rotate: 10 }}
              >
                <Clock className="text-secondary" size={24} />
              </motion.div>
              <div>
                <h3 className="font-bold text-foreground mb-1">Availability</h3>
                <p className="text-muted-foreground text-sm">
                  Available 24/7<br />
                  For reservations & inquiries
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="bg-background rounded-xl p-8 border border-border"
            variants={formVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none h-32"
                  placeholder="Tell us about your inquiry..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all font-semibold"
              >
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
