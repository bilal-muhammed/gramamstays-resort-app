'use client'

import { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef, type ReactNode } from 'react'
import type { Booking, Room, Guest, Income, Expense, Staff, Activity, Property, Testimonial, Inquiry } from '@/types/admin'
import { startLoading, doneLoading } from '@/components/loading-bar'

interface AdminDataContextType {
  bookings: Booking[]
  rooms: Room[]
  guests: Guest[]
  income: Income[]
  expenses: Expense[]
  staff: Staff[]
  activities: Activity[]
  properties: Property[]
  testimonials: Testimonial[]
  inquiries: Inquiry[]
  loading: boolean
  addBooking: (b: Omit<Booking, 'id'> & { sendEmail?: boolean; sendWhatsApp?: boolean }) => Promise<{ emailStatus?: { sent: boolean; error?: string }; whatsappStatus?: { sent: boolean; error?: string } } | null>
  updateBooking: (id: string, b: Partial<Booking> & { sendEmail?: boolean; sendWhatsApp?: boolean }) => Promise<{ emailStatus?: { sent: boolean; error?: string }; whatsappStatus?: { sent: boolean; error?: string } } | null>
  deleteBooking: (id: string) => Promise<void>
  addRoom: (r: Omit<Room, 'id'>) => Promise<void>
  updateRoom: (id: string, r: Partial<Room>) => Promise<void>
  deleteRoom: (id: string) => Promise<void>
  addGuest: (g: Omit<Guest, 'id'>) => Promise<void>
  updateGuest: (id: string, g: Partial<Guest>) => Promise<void>
  deleteGuest: (id: string) => Promise<void>
  addIncome: (i: Omit<Income, 'id'>) => Promise<void>
  deleteIncome: (id: string) => Promise<void>
  addExpense: (e: Omit<Expense, 'id'>) => Promise<void>
  updateExpense: (id: string, e: Partial<Expense>) => Promise<void>
  deleteExpense: (id: string) => Promise<void>
  addStaff: (s: Omit<Staff, 'id'>) => Promise<void>
  updateStaff: (id: string, s: Partial<Staff>) => Promise<void>
  deleteStaff: (id: string) => Promise<void>
  addActivity: (a: Omit<Activity, 'id'>) => Promise<void>
  addProperty: (p: Omit<Property, 'id'>) => Promise<void>
  updateProperty: (id: string, p: Partial<Property>) => Promise<void>
  deleteProperty: (id: string) => Promise<void>
  addTestimonial: (t: Omit<Testimonial, 'id'>) => Promise<void>
  updateTestimonial: (id: string, t: Partial<Testimonial>) => Promise<void>
  deleteTestimonial: (id: string) => Promise<void>
  updateInquiry: (id: string, i: Partial<Inquiry>) => Promise<void>
  deleteInquiry: (id: string) => Promise<void>
}

const AdminDataContext = createContext<AdminDataContextType | null>(null)

async function api<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    startLoading()
    const res = await fetch(url, { ...options, headers: { 'Content-Type': 'application/json', ...options?.headers } })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  } finally {
    doneLoading()
  }
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0]
}

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [guests, setGuests] = useState<Guest[]>([])
  const [income, setIncome] = useState<Income[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [staffList, setStaffList] = useState<Staff[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)

  const bookingsRef = useRef(bookings)
  bookingsRef.current = bookings

  useEffect(() => {
    Promise.all([
      api<Booking[]>('/api/bookings'),
      api<Room[]>('/api/rooms'),
      api<Guest[]>('/api/guests'),
      api<Income[]>('/api/income'),
      api<Expense[]>('/api/expenses'),
      api<Staff[]>('/api/staff'),
      api<Activity[]>('/api/activities'),
      api<Property[]>('/api/properties'),
      api<Testimonial[]>('/api/testimonials'),
      api<Inquiry[]>('/api/inquiries'),
    ]).then(([b, r, g, i, e, s, a, p, t, q]) => {
      if (b) setBookings(b)
      if (r) setRooms(r)
      if (g) setGuests(g)
      if (i) setIncome(i)
      if (e) setExpenses(e)
      if (s) setStaffList(s)
      if (a) setActivities(a)
      if (p) setProperties(p)
      if (t) setTestimonials(t)
      if (q) setInquiries(q)
    }).finally(() => setLoading(false))
  }, [])

  const addActivity = useCallback(async (a: Omit<Activity, 'id'>) => {
    const activity = await api<Activity>('/api/activities', { method: 'POST', body: JSON.stringify(a) })
    if (activity) setActivities(prev => [activity, ...prev].slice(0, 20))
  }, [])

  const addBooking = useCallback(async (b: Omit<Booking, 'id'> & { sendEmail?: boolean; sendWhatsApp?: boolean }) => {
    const booking = await api<Booking & { emailStatus?: { sent: boolean; error?: string }; whatsappStatus?: { sent: boolean; error?: string } }>('/api/bookings', { method: 'POST', body: JSON.stringify(b) })
    if (booking) {
      setBookings(prev => [booking, ...prev])
      await api<Activity>('/api/activities', { method: 'POST', body: JSON.stringify({ time: 'Just now', text: `New booking from ${b.guest}` }) })
      if (b.paidAmount > 0) {
        const incomeEntry = await api<Income>('/api/income', { method: 'POST', body: JSON.stringify({ date: todayStr(), source: `${booking.id} - ${b.guest}`, amount: b.paidAmount, type: 'Room Revenue', description: `${b.room} #${b.roomNo} | ${b.nights} nights | Check-in: ${b.checkIn}` }) })
        if (incomeEntry) {
          setIncome(prev => [incomeEntry, ...prev])
          await api<Activity>('/api/activities', { method: 'POST', body: JSON.stringify({ time: 'Just now', text: `Income recorded: ₹${b.paidAmount.toLocaleString()} from ${b.guest}` }) })
        }
      }
      return { emailStatus: booking.emailStatus, whatsappStatus: booking.whatsappStatus }
    }
    return null
  }, [])

  const updateBooking = useCallback(async (id: string, b: Partial<Booking> & { sendEmail?: boolean; sendWhatsApp?: boolean }) => {
    const updated = await api<Booking & { emailStatus?: { sent: boolean; error?: string }; whatsappStatus?: { sent: boolean; error?: string } }>(`/api/bookings/${id}`, { method: 'PATCH', body: JSON.stringify(b) })
    if (updated) {
      const original = bookingsRef.current.find(item => item.id === id)
      setBookings(prev => prev.map(item => item.id === id ? updated : item))
      if (original && b.paidAmount !== undefined && updated.paidAmount > original.paidAmount) {
        const additional = updated.paidAmount - original.paidAmount
        const incomeEntry = await api<Income>('/api/income', { method: 'POST', body: JSON.stringify({ date: todayStr(), source: `${updated.id} - ${updated.guest}`, amount: additional, type: 'Room Revenue', description: `${updated.room} #${updated.roomNo} | Partial payment` }) })
        if (incomeEntry) {
          setIncome(prev => [incomeEntry, ...prev])
          await api<Activity>('/api/activities', { method: 'POST', body: JSON.stringify({ time: 'Just now', text: `Payment of ₹${additional.toLocaleString()} from ${updated.guest}` }) })
        }
      }
      return { emailStatus: updated.emailStatus, whatsappStatus: updated.whatsappStatus }
    }
    return null
  }, [])

  const deleteBooking = useCallback(async (id: string) => {
    const result = await api(`/api/bookings/${id}`, { method: 'DELETE' })
    if (result) setBookings(prev => prev.filter(item => item.id !== id))
  }, [])

  const addRoom = useCallback(async (r: Omit<Room, 'id'>) => {
    const room = await api<Room>('/api/rooms', { method: 'POST', body: JSON.stringify(r) })
    if (room) setRooms(prev => [room, ...prev])
  }, [])

  const updateRoom = useCallback(async (id: string, r: Partial<Room>) => {
    const updated = await api<Room>(`/api/rooms/${id}`, { method: 'PATCH', body: JSON.stringify(r) })
    if (updated) setRooms(prev => prev.map(item => item.id === id ? updated : item))
  }, [])

  const deleteRoom = useCallback(async (id: string) => {
    const result = await api(`/api/rooms/${id}`, { method: 'DELETE' })
    if (result) setRooms(prev => prev.filter(item => item.id !== id))
  }, [])

  const addGuest = useCallback(async (g: Omit<Guest, 'id'>) => {
    const guest = await api<Guest>('/api/guests', { method: 'POST', body: JSON.stringify(g) })
    if (guest) setGuests(prev => [guest, ...prev])
  }, [])

  const updateGuest = useCallback(async (id: string, g: Partial<Guest>) => {
    const updated = await api<Guest>(`/api/guests/${id}`, { method: 'PATCH', body: JSON.stringify(g) })
    if (updated) setGuests(prev => prev.map(item => item.id === id ? updated : item))
  }, [])

  const deleteGuest = useCallback(async (id: string) => {
    const result = await api(`/api/guests/${id}`, { method: 'DELETE' })
    if (result) setGuests(prev => prev.filter(item => item.id !== id))
  }, [])

  const addIncome = useCallback(async (i: Omit<Income, 'id'>) => {
    const incomeEntry = await api<Income>('/api/income', { method: 'POST', body: JSON.stringify(i) })
    if (incomeEntry) {
      setIncome(prev => [incomeEntry, ...prev])
      addActivity({ time: 'Just now', text: `Income recorded: ₹${i.amount}` })
    }
  }, [addActivity])

  const deleteIncome = useCallback(async (id: string) => {
    const result = await api(`/api/income/${id}`, { method: 'DELETE' })
    if (result) setIncome(prev => prev.filter(item => item.id !== id))
  }, [])

  const addExpense = useCallback(async (e: Omit<Expense, 'id'>) => {
    const expense = await api<Expense>('/api/expenses', { method: 'POST', body: JSON.stringify(e) })
    if (expense) {
      setExpenses(prev => [expense, ...prev])
      addActivity({ time: 'Just now', text: `Expense added: ${e.label}` })
    }
  }, [addActivity])

  const updateExpense = useCallback(async (id: string, e: Partial<Expense>) => {
    const updated = await api<Expense>(`/api/expenses/${id}`, { method: 'PATCH', body: JSON.stringify(e) })
    if (updated) setExpenses(prev => prev.map(item => item.id === id ? updated : item))
  }, [])

  const deleteExpense = useCallback(async (id: string) => {
    const result = await api(`/api/expenses/${id}`, { method: 'DELETE' })
    if (result) setExpenses(prev => prev.filter(item => item.id !== id))
  }, [])

  const addStaff = useCallback(async (s: Omit<Staff, 'id'>) => {
    const member = await api<Staff>('/api/staff', { method: 'POST', body: JSON.stringify(s) })
    if (member) setStaffList(prev => [member, ...prev])
  }, [])

  const updateStaff = useCallback(async (id: string, s: Partial<Staff>) => {
    const updated = await api<Staff>(`/api/staff/${id}`, { method: 'PATCH', body: JSON.stringify(s) })
    if (updated) setStaffList(prev => prev.map(item => item.id === id ? updated : item))
  }, [])

  const deleteStaff = useCallback(async (id: string) => {
    const result = await api(`/api/staff/${id}`, { method: 'DELETE' })
    if (result) setStaffList(prev => prev.filter(item => item.id !== id))
  }, [])

  const addProperty = useCallback(async (p: Omit<Property, 'id'>) => {
    const property = await api<Property>('/api/properties', { method: 'POST', body: JSON.stringify(p) })
    if (property) setProperties(prev => [property, ...prev])
  }, [])

  const updateProperty = useCallback(async (id: string, p: Partial<Property>) => {
    const updated = await api<Property>(`/api/properties/${id}`, { method: 'PATCH', body: JSON.stringify(p) })
    if (updated) setProperties(prev => prev.map(item => item.id === id ? updated : item))
  }, [])

  const deleteProperty = useCallback(async (id: string) => {
    const result = await api(`/api/properties/${id}`, { method: 'DELETE' })
    if (result) setProperties(prev => prev.filter(item => item.id !== id))
  }, [])

  const addTestimonial = useCallback(async (t: Omit<Testimonial, 'id'>) => {
    const testimonial = await api<Testimonial>('/api/testimonials', { method: 'POST', body: JSON.stringify(t) })
    if (testimonial) setTestimonials(prev => [testimonial, ...prev])
  }, [])

  const updateTestimonial = useCallback(async (id: string, t: Partial<Testimonial>) => {
    const updated = await api<Testimonial>(`/api/testimonials/${id}`, { method: 'PATCH', body: JSON.stringify(t) })
    if (updated) setTestimonials(prev => prev.map(item => item.id === id ? updated : item))
  }, [])

  const deleteTestimonial = useCallback(async (id: string) => {
    const result = await api(`/api/testimonials/${id}`, { method: 'DELETE' })
    if (result) setTestimonials(prev => prev.filter(item => item.id !== id))
  }, [])

  const updateInquiry = useCallback(async (id: string, i: Partial<Inquiry>) => {
    const updated = await api<Inquiry>(`/api/inquiries/${id}`, { method: 'PATCH', body: JSON.stringify(i) })
    if (updated) setInquiries(prev => prev.map(item => item.id === id ? updated : item))
  }, [])

  const deleteInquiry = useCallback(async (id: string) => {
    const result = await api(`/api/inquiries/${id}`, { method: 'DELETE' })
    if (result) setInquiries(prev => prev.filter(item => item.id !== id))
  }, [])

  const value = useMemo(() => ({
    bookings, rooms, guests, income, expenses, staff: staffList, activities, properties, testimonials, inquiries, loading,
    addBooking, updateBooking, deleteBooking,
    addRoom, updateRoom, deleteRoom,
    addGuest, updateGuest, deleteGuest,
    addIncome, deleteIncome,
    addExpense, updateExpense, deleteExpense,
    addStaff, updateStaff, deleteStaff,
    addActivity,
    addProperty, updateProperty, deleteProperty,
    addTestimonial, updateTestimonial, deleteTestimonial,
    updateInquiry, deleteInquiry,
  }), [bookings, rooms, guests, income, expenses, staffList, activities, properties, testimonials, inquiries, loading, addBooking, updateBooking, deleteBooking, addRoom, updateRoom, deleteRoom, addGuest, updateGuest, deleteGuest, addIncome, deleteIncome, addExpense, updateExpense, deleteExpense, addStaff, updateStaff, deleteStaff, addActivity, addProperty, updateProperty, deleteProperty, addTestimonial, updateTestimonial, deleteTestimonial, updateInquiry, deleteInquiry])

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  )
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext)
  if (!ctx) throw new Error('useAdminData must be used within AdminDataProvider')
  return ctx
}
