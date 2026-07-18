'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed w-full top-0 z-50 bg-white/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-foreground">Gramamstays</h1>
              <p className="text-xs text-muted-foreground">Luxury Retreat</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 items-center">
            <Link href="#rooms" className="text-foreground hover:text-primary transition-colors font-medium">
              Rooms
            </Link>
            <Link href="#amenities" className="text-foreground hover:text-primary transition-colors font-medium">
              Amenities
            </Link>
            <Link href="#dining" className="text-foreground hover:text-primary transition-colors font-medium">
              Dining
            </Link>
            <Link href="#contact" className="text-foreground hover:text-primary transition-colors font-medium">
              Contact
            </Link>
            <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all font-medium">
              Book Now
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-4">
            <Link href="#rooms" className="text-foreground hover:text-primary transition-colors font-medium">
              Rooms
            </Link>
            <Link href="#amenities" className="text-foreground hover:text-primary transition-colors font-medium">
              Amenities
            </Link>
            <Link href="#dining" className="text-foreground hover:text-primary transition-colors font-medium">
              Dining
            </Link>
            <Link href="#contact" className="text-foreground hover:text-primary transition-colors font-medium">
              Contact
            </Link>
            <button className="w-full px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all font-medium">
              Book Now
            </button>
          </nav>
        )}
      </div>
    </header>
  )
}
