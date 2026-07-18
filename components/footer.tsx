import Link from 'next/link'
import { Heart, Star, Zap, Award } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold">G</span>
              </div>
              <h3 className="text-lg font-bold">Gramamstays</h3>
            </div>
            <p className="text-white/80 text-sm">Experience luxury in perfect harmony with nature.</p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="hover:text-secondary transition-colors">
                <Heart size={20} />
              </a>
              <a href="#" className="hover:text-secondary transition-colors">
                <Star size={20} />
              </a>
              <a href="#" className="hover:text-secondary transition-colors">
                <Zap size={20} />
              </a>
              <a href="#" className="hover:text-secondary transition-colors">
                <Award size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#rooms" className="hover:text-secondary transition-colors">
                  Rooms & Suites
                </Link>
              </li>
              <li>
                <Link href="#amenities" className="hover:text-secondary transition-colors">
                  Amenities
                </Link>
              </li>
              <li>
                <Link href="#dining" className="hover:text-secondary transition-colors">
                  Dining
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-secondary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Spa & Wellness
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Concierge
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Events & Meetings
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Packages
                </a>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-bold mb-4">Information</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Cancellation Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/70">
              &copy; {currentYear} Gramamstays. All rights reserved.
            </p>
            <p className="text-sm text-white/70">
              Luxury Resort & Spa | Mountain Retreat
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
