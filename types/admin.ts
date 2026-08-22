export interface Booking {
  id: string
  guest: string
  email: string
  phone: string
  room: string
  roomNo: string
  checkIn: string
  checkOut: string
  nights: number
  status: 'Checked In' | 'Confirmed' | 'Pending' | 'Checked Out'
  amount: number
  paidAmount: number
  payment: 'Fully Paid' | 'Partial' | 'Pending'
  addons?: string[]
  addonNote?: string
}

export interface Room {
  id: string
  type: string
  floor: string
  status: 'Occupied' | 'Available' | 'Maintenance' | 'Reserved'
  guest: string
  price: number
  amenities: string
  until?: string
  from?: string
  note?: string
}

export interface Guest {
  id: string
  name: string
  email: string
  phone: string
  location: string
  stays: number
  totalSpent: number
  rating: number
  lastStay: string
  vip: boolean
}

export interface Income {
  id: string
  date: string
  source: string
  amount: number
  type: string
  description?: string
}

export interface Expense {
  id: string
  date: string
  label: string
  description: string
  amount: number
  category: string
}

export interface Staff {
  id: string
  name: string
  email: string
  phone: string
  role: string
  department: string
  status: 'Active' | 'Off Duty'
  lastActive: string
  permissions: string[]
}

export interface Activity {
  id: string
  time: string
  text: string
}

export interface Property {
  id: string
  name: string
  description: string
  price: number
  status: string
  amenities: string
  image?: string
  gallery?: string
  tagline?: string
  features?: string
  specs?: string
  badge?: string
  rating?: number
  reviews?: number
  originalPrice?: number
}

export interface Testimonial {
  id: string
  name: string
  role: string
  location: string
  rating: number
  text: string
  avatar: string
  status: string
  order: number
}

export interface Inquiry {
  id: string
  name: string
  email: string
  phone: string
  message: string
  type: string
  status: string
  notes: string
}
