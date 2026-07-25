'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { Booking, Room, Guest, Income, Expense, Staff, Activity, Property } from '@/types/admin'

interface AdminDataContextType {
  bookings: Booking[]
  rooms: Room[]
  guests: Guest[]
  income: Income[]
  expenses: Expense[]
  staff: Staff[]
  activities: Activity[]
  properties: Property[]
  loading: boolean
  addBooking: (b: Omit<Booking, 'id'>) => Promise<void>
  updateBooking: (id: string, b: Partial<Booking>) => Promise<void>
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
}

const AdminDataContext = createContext<AdminDataContextType | null>(null)

async function api<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, { ...options, headers: { 'Content-Type': 'application/json', ...options?.headers } })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
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
  const [loading, setLoading] = useState(true)

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
    ]).then(([b, r, g, i, e, s, a, p]) => {
      if (b) setBookings(b)
      if (r) setRooms(r)
      if (g) setGuests(g)
      if (i) setIncome(i)
      if (e) setExpenses(e)
      if (s) setStaffList(s)
      if (a) setActivities(a)
      if (p) setProperties(p)
    }).finally(() => setLoading(false))
  }, [])

  const addActivity = useCallback(async (a: Omit<Activity, 'id'>) => {
    const activity = await api<Activity>('/api/activities', { method: 'POST', body: JSON.stringify(a) })
    if (activity) setActivities(prev => [activity, ...prev].slice(0, 20))
  }, [])

  const addBooking = useCallback(async (b: Omit<Booking, 'id'>) => {
    const booking = await api<Booking>('/api/bookings', { method: 'POST', body: JSON.stringify(b) })
    if (booking) {
      setBookings(prev => [booking, ...prev])
      const calls = [
        api<Activity>('/api/activities', { method: 'POST', body: JSON.stringify({ time: 'Just now', text: `New booking from ${b.guest}` }) }),
      ]
      if (b.paidAmount > 0) {
        calls.push(
          api<Income>('/api/income', { method: 'POST', body: JSON.stringify({ date: todayStr(), source: `Room - ${b.room} #${b.roomNo}`, amount: b.paidAmount, type: 'Room Revenue' }) }),
          api<Activity>('/api/activities', { method: 'POST', body: JSON.stringify({ time: 'Just now', text: `Income recorded: ₹${b.paidAmount.toLocaleString()} from ${b.guest}` }) }),
        )
      }
      const results = await Promise.all(calls)
      const newActivities = results.filter((r): r is Activity => r !== null && 'text' in (r as object))
      if (newActivities.length) setActivities(prev => [...newActivities, ...prev].slice(0, 20))
      const incomeResult = results[1]
      if (incomeResult && 'amount' in (incomeResult as object)) setIncome(prev => [incomeResult as Income, ...prev])
    }
  }, [])

  const updateBooking = useCallback(async (id: string, b: Partial<Booking>) => {
    const updated = await api<Booking>(`/api/bookings/${id}`, { method: 'PATCH', body: JSON.stringify(b) })
    if (updated) {
      setBookings(prev => {
        const original = prev.find(item => item.id === id)
        if (original && b.paidAmount !== undefined && updated.paidAmount > original.paidAmount) {
          const additional = updated.paidAmount - original.paidAmount
          Promise.all([
            api<Income>('/api/income', { method: 'POST', body: JSON.stringify({ date: todayStr(), source: `Room - ${updated.room} #${updated.roomNo}`, amount: additional, type: 'Room Revenue' }) }),
            api<Activity>('/api/activities', { method: 'POST', body: JSON.stringify({ time: 'Just now', text: `Payment of ₹${additional.toLocaleString()} from ${updated.guest}` }) }),
          ]).then(([incomeRes, activityRes]) => {
            if (incomeRes && 'amount' in (incomeRes as object)) setIncome(prev => [incomeRes as Income, ...prev])
            if (activityRes && 'text' in (activityRes as object)) setActivities(prev => [activityRes as Activity, ...prev].slice(0, 20))
          })
        }
        return prev.map(item => item.id === id ? updated : item)
      })
    }
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

  return (
    <AdminDataContext.Provider value={{
      bookings, rooms, guests, income, expenses, staff: staffList, activities, properties, loading,
      addBooking, updateBooking, deleteBooking,
      addRoom, updateRoom, deleteRoom,
      addGuest, updateGuest, deleteGuest,
      addIncome, deleteIncome,
      addExpense, updateExpense, deleteExpense,
      addStaff, updateStaff, deleteStaff,
      addActivity,
      addProperty, updateProperty, deleteProperty,
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
