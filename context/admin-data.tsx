'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Booking, Room, Guest, Income, Expense, Staff, Activity } from '@/types/admin'

const generateId = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

const initialBookings: Booking[] = [
  { id: 'BK-1042', guest: 'Eleanor Whitfield', email: 'eleanor@email.com', phone: '+1 555-0101', room: 'Presidential Suite', roomNo: '301', checkIn: '2026-07-18', checkOut: '2026-07-22', nights: 4, status: 'Checked In', amount: 2600, paidAmount: 2600, payment: 'Fully Paid' },
  { id: 'BK-1041', guest: 'James Chen', email: 'james@email.com', phone: '+1 555-0102', room: 'Villa Deluxe', roomNo: '205', checkIn: '2026-07-17', checkOut: '2026-07-20', nights: 3, status: 'Checked In', amount: 1350, paidAmount: 1350, payment: 'Fully Paid' },
  { id: 'BK-1040', guest: 'Sofia Martinez', email: 'sofia@email.com', phone: '+1 555-0103', room: 'Garden Suite', roomNo: '108', checkIn: '2026-07-19', checkOut: '2026-07-21', nights: 2, status: 'Confirmed', amount: 500, paidAmount: 250, payment: 'Partial' },
  { id: 'BK-1039', guest: 'Amara Okafor', email: 'amara@email.com', phone: '+1 555-0104', room: 'Presidential Suite', roomNo: '302', checkIn: '2026-07-20', checkOut: '2026-07-25', nights: 5, status: 'Pending', amount: 3250, paidAmount: 0, payment: 'Pending' },
  { id: 'BK-1038', guest: 'David Kim', email: 'david@email.com', phone: '+1 555-0105', room: 'Garden Suite', roomNo: '109', checkIn: '2026-07-16', checkOut: '2026-07-18', nights: 2, status: 'Checked Out', amount: 500, paidAmount: 500, payment: 'Fully Paid' },
]

const initialRooms: Room[] = [
  { id: '301', type: 'Presidential Suite', floor: '3rd', status: 'Occupied', guest: 'EW', price: 650, amenities: 'King Bed, Ocean View, Private Pool, Butler', until: 'Jul 22' },
  { id: '302', type: 'Presidential Suite', floor: '3rd', status: 'Reserved', guest: '-', price: 650, amenities: 'King Bed, Ocean View, Private Pool, Butler', from: 'Jul 20' },
  { id: '303', type: 'Presidential Suite', floor: '3rd', status: 'Available', guest: '-', price: 650, amenities: 'King Bed, Ocean View, Private Pool, Butler' },
  { id: '205', type: 'Villa Deluxe', floor: '2nd', status: 'Occupied', guest: 'JC', price: 450, amenities: 'Queen Bed, Garden View, Balcony, Minibar', until: 'Jul 20' },
  { id: '206', type: 'Villa Deluxe', floor: '2nd', status: 'Available', guest: '-', price: 450, amenities: 'Queen Bed, Garden View, Balcony, Minibar' },
  { id: '207', type: 'Villa Deluxe', floor: '2nd', status: 'Maintenance', guest: '-', price: 450, amenities: 'Queen Bed, Garden View, Balcony, Minibar', note: 'AC Repair' },
  { id: '108', type: 'Garden Suite', floor: '1st', status: 'Occupied', guest: 'SM', price: 250, amenities: 'Double Bed, Courtyard, Kitchenette', until: 'Jul 21' },
  { id: '109', type: 'Garden Suite', floor: '1st', status: 'Available', guest: '-', price: 250, amenities: 'Double Bed, Courtyard, Kitchenette' },
  { id: '110', type: 'Garden Suite', floor: '1st', status: 'Available', guest: '-', price: 250, amenities: 'Double Bed, Courtyard, Kitchenette' },
]

const initialGuests: Guest[] = [
  { id: 'G-001', name: 'Eleanor Whitfield', email: 'eleanor@email.com', phone: '+1 555-0101', location: 'New York, USA', stays: 5, totalSpent: 7800, rating: 5, lastStay: 'Jul 18, 2026', vip: true },
  { id: 'G-002', name: 'James Chen', email: 'james@email.com', phone: '+1 555-0102', location: 'San Francisco, USA', stays: 3, totalSpent: 4200, rating: 4, lastStay: 'Jul 17, 2026', vip: false },
  { id: 'G-003', name: 'Sofia Martinez', email: 'sofia@email.com', phone: '+1 555-0103', location: 'Madrid, Spain', stays: 2, totalSpent: 1800, rating: 5, lastStay: 'Jul 19, 2026', vip: false },
  { id: 'G-004', name: 'Amara Okafor', email: 'amara@email.com', phone: '+1 555-0104', location: 'Lagos, Nigeria', stays: 4, totalSpent: 6500, rating: 5, lastStay: 'Jul 20, 2026', vip: true },
  { id: 'G-005', name: 'David Kim', email: 'david@email.com', phone: '+1 555-0105', location: 'Seoul, South Korea', stays: 1, totalSpent: 500, rating: 4, lastStay: 'Jul 16, 2026', vip: false },
]

const initialIncome: Income[] = [
  { id: 'IN-001', date: 'Jul 18', source: 'Room - Presidential Suite #301', amount: 650, type: 'Room Revenue' },
  { id: 'IN-002', date: 'Jul 18', source: 'Spa - Deep Tissue Massage', amount: 180, type: 'Spa' },
  { id: 'IN-003', date: 'Jul 17', source: 'Room - Villa Deluxe #205', amount: 450, type: 'Room Revenue' },
  { id: 'IN-004', date: 'Jul 17', source: 'Dining - Harvest & Hearth', amount: 320, type: 'F&B' },
  { id: 'IN-005', date: 'Jul 16', source: 'Room - Garden Suite #108', amount: 250, type: 'Room Revenue' },
  { id: 'IN-006', date: 'Jul 16', source: 'Wine Tasting Experience', amount: 120, type: 'Experience' },
  { id: 'IN-007', date: 'Jul 15', source: 'Room - Villa Deluxe #206', amount: 450, type: 'Room Revenue' },
  { id: 'IN-008', date: 'Jul 15', source: 'Pool Cabana Rental', amount: 75, type: 'Amenity' },
]

const initialExpenses: Expense[] = [
  { id: 'EX-001', date: 'Jul 18', label: 'Staff Payroll', description: 'Weekly payroll for all departments', amount: 4200, category: 'Payroll' },
  { id: 'EX-002', date: 'Jul 17', label: 'Kitchen Supplies', description: 'Fresh produce and cooking ingredients', amount: 850, category: 'Supplies' },
  { id: 'EX-003', date: 'Jul 17', label: 'Housekeeping Products', description: 'Cleaning supplies and linens', amount: 320, category: 'Supplies' },
  { id: 'EX-004', date: 'Jul 16', label: 'Spa Products', description: 'Essential oils and treatment supplies', amount: 480, category: 'Supplies' },
  { id: 'EX-005', date: 'Jul 16', label: 'Utilities', description: 'Electricity and water bill', amount: 1200, category: 'Utilities' },
  { id: 'EX-006', date: 'Jul 15', label: 'Marketing Campaign', description: 'Social media and Google ads', amount: 2500, category: 'Marketing' },
  { id: 'EX-007', date: 'Jul 15', label: 'AC Unit Maintenance', description: 'Repair of Presidential Suite AC', amount: 780, category: 'Maintenance' },
]

const initialStaff: Staff[] = [
  { id: 'S-001', name: 'Robert Williams', email: 'robert@gramamstays.com', phone: '+1 555-1001', role: 'General Manager', department: 'Management', status: 'Active', lastActive: '2 min ago', permissions: ['all'] },
  { id: 'S-002', name: 'Maria Santos', email: 'maria@gramamstays.com', phone: '+1 555-1002', role: 'Front Desk Lead', department: 'Front Desk', status: 'Active', lastActive: '5 min ago', permissions: ['bookings', 'guests', 'rooms'] },
  { id: 'S-003', name: 'Dr. Priya Sharma', email: 'priya@gramamstays.com', phone: '+1 555-1003', role: 'Spa Manager', department: 'Spa & Wellness', status: 'Active', lastActive: '10 min ago', permissions: ['spa'] },
  { id: 'S-004', name: 'Chef Antoine Dubois', email: 'antoine@gramamstays.com', phone: '+1 555-1004', role: 'Head Chef', department: 'F&B', status: 'Active', lastActive: '1 min ago', permissions: ['dining'] },
  { id: 'S-005', name: 'Sarah Johnson', email: 'sarah@gramamstays.com', phone: '+1 555-1005', role: 'Housekeeping Lead', department: 'Housekeeping', status: 'Off Duty', lastActive: '3 hr ago', permissions: ['rooms'] },
]

interface AdminDataContextType {
  bookings: Booking[]
  rooms: Room[]
  guests: Guest[]
  income: Income[]
  expenses: Expense[]
  staff: Staff[]
  activities: Activity[]
  addBooking: (b: Omit<Booking, 'id'>) => void
  updateBooking: (id: string, b: Partial<Booking>) => void
  deleteBooking: (id: string) => void
  addRoom: (r: Omit<Room, 'id'>) => void
  updateRoom: (id: string, r: Partial<Room>) => void
  deleteRoom: (id: string) => void
  addGuest: (g: Omit<Guest, 'id'>) => void
  updateGuest: (id: string, g: Partial<Guest>) => void
  deleteGuest: (id: string) => void
  addIncome: (i: Omit<Income, 'id'>) => void
  deleteIncome: (id: string) => void
  addExpense: (e: Omit<Expense, 'id'>) => void
  updateExpense: (id: string, e: Partial<Expense>) => void
  deleteExpense: (id: string) => void
  addStaff: (s: Omit<Staff, 'id'>) => void
  updateStaff: (id: string, s: Partial<Staff>) => void
  deleteStaff: (id: string) => void
  addActivity: (a: Omit<Activity, 'id'>) => void
}

const AdminDataContext = createContext<AdminDataContextType | null>(null)

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings)
  const [rooms, setRooms] = useState<Room[]>(initialRooms)
  const [guests, setGuests] = useState<Guest[]>(initialGuests)
  const [income, setIncome] = useState<Income[]>(initialIncome)
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses)
  const [staffList, setStaffList] = useState<Staff[]>(initialStaff)
  const [activities, setActivities] = useState<Activity[]>([
    { id: 'A-001', time: '2 min ago', text: 'New booking from E. Whitfield' },
    { id: 'A-002', time: '15 min ago', text: 'Check-in: James Chen' },
    { id: 'A-003', time: '1 hr ago', text: 'Room 207 marked for maintenance' },
    { id: 'A-004', time: '3 hr ago', text: 'Payment received: $2,600' },
  ])

  const addActivity = useCallback((a: Omit<Activity, 'id'>) => {
    setActivities(prev => [{ ...a, id: generateId('A') }, ...prev].slice(0, 20))
  }, [])

  const addBooking = useCallback((b: Omit<Booking, 'id'>) => {
    const newBooking = { ...b, id: generateId('BK') }
    setBookings(prev => [newBooking, ...prev])
    addActivity({ time: 'Just now', text: `New booking from ${b.guest}` })
    if (b.paidAmount > 0) {
      const now = new Date()
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const today = `${months[now.getMonth()]} ${now.getDate()}`
      setIncome(prev => [{ id: generateId('IN'), date: today, source: `Room - ${b.room} #${b.roomNo}`, amount: b.paidAmount, type: 'Room Revenue' }, ...prev])
      addActivity({ time: 'Just now', text: `Income recorded: $${b.paidAmount.toLocaleString()} from ${b.guest}` })
    }
  }, [addActivity])

  const updateBooking = useCallback((id: string, b: Partial<Booking>) => {
    setBookings(prev => prev.map(item => {
      if (item.id !== id) return item
      const updated = { ...item, ...b }
      if (b.payment === 'Fully Paid' && item.payment !== 'Fully Paid' && updated.amount > item.paidAmount) {
        const now = new Date()
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const today = `${months[now.getMonth()]} ${now.getDate()}`
        const remaining = updated.amount - item.paidAmount
        setIncome(prev => [{ id: generateId('IN'), date: today, source: `Room - ${updated.room} #${updated.roomNo}`, amount: remaining, type: 'Room Revenue' }, ...prev])
        addActivity({ time: 'Just now', text: `Payment completed: $${remaining.toLocaleString()} from ${updated.guest}` })
      }
      return updated
    }))
  }, [addActivity])

  const deleteBooking = useCallback((id: string) => {
    setBookings(prev => prev.filter(item => item.id !== id))
  }, [])

  const addRoom = useCallback((r: Omit<Room, 'id'>) => {
    setRooms(prev => [{ ...r, id: generateId('R') }, ...prev])
  }, [])

  const updateRoom = useCallback((id: string, r: Partial<Room>) => {
    setRooms(prev => prev.map(item => item.id === id ? { ...item, ...r } : item))
  }, [])

  const deleteRoom = useCallback((id: string) => {
    setRooms(prev => prev.filter(item => item.id !== id))
  }, [])

  const addGuest = useCallback((g: Omit<Guest, 'id'>) => {
    setGuests(prev => [{ ...g, id: generateId('G') }, ...prev])
  }, [])

  const updateGuest = useCallback((id: string, g: Partial<Guest>) => {
    setGuests(prev => prev.map(item => item.id === id ? { ...item, ...g } : item))
  }, [])

  const deleteGuest = useCallback((id: string) => {
    setGuests(prev => prev.filter(item => item.id !== id))
  }, [])

  const addIncome = useCallback((i: Omit<Income, 'id'>) => {
    setIncome(prev => [{ ...i, id: generateId('IN') }, ...prev])
    addActivity({ time: 'Just now', text: `Income recorded: $${i.amount}` })
  }, [addActivity])

  const deleteIncome = useCallback((id: string) => {
    setIncome(prev => prev.filter(item => item.id !== id))
  }, [])

  const addExpense = useCallback((e: Omit<Expense, 'id'>) => {
    setExpenses(prev => [{ ...e, id: generateId('EX') }, ...prev])
    addActivity({ time: 'Just now', text: `Expense added: ${e.label}` })
  }, [addActivity])

  const updateExpense = useCallback((id: string, e: Partial<Expense>) => {
    setExpenses(prev => prev.map(item => item.id === id ? { ...item, ...e } : item))
  }, [])

  const deleteExpense = useCallback((id: string) => {
    setExpenses(prev => prev.filter(item => item.id !== id))
  }, [])

  const addStaff = useCallback((s: Omit<Staff, 'id'>) => {
    setStaffList(prev => [{ ...s, id: generateId('S') }, ...prev])
  }, [])

  const updateStaff = useCallback((id: string, s: Partial<Staff>) => {
    setStaffList(prev => prev.map(item => item.id === id ? { ...item, ...s } : item))
  }, [])

  const deleteStaff = useCallback((id: string) => {
    setStaffList(prev => prev.filter(item => item.id !== id))
  }, [])

  return (
    <AdminDataContext.Provider value={{
      bookings, rooms, guests, income, expenses, staff: staffList, activities,
      addBooking, updateBooking, deleteBooking,
      addRoom, updateRoom, deleteRoom,
      addGuest, updateGuest, deleteGuest,
      addIncome, deleteIncome,
      addExpense, updateExpense, deleteExpense,
      addStaff, updateStaff, deleteStaff,
      addActivity,
    }}>
      {children}
    </AdminDataContext.Provider>
  )
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext)
  if (!ctx) throw new Error('useAdminData must be used within AdminDataProvider')
  return ctx
}
