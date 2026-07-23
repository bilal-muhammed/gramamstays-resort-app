import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

function toISODateTime(val: unknown): Date {
  if (val instanceof Date) return val
  if (typeof val === 'string') {
    if (val.includes('T')) return new Date(val)
    return new Date(val + 'T00:00:00.000Z')
  }
  return new Date(String(val))
}

export async function GET() {
  if (!prisma) {
    console.error('[Bookings] Prisma client is null - DATABASE_URL may be missing')
    return NextResponse.json([])
  }
  try {
    const bookings = await prisma.booking.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(bookings)
  } catch (error) {
    console.error('[Bookings] GET error:', error)
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  if (!prisma) return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  try {
    const data = await request.json()
    data.checkIn = toISODateTime(data.checkIn)
    data.checkOut = toISODateTime(data.checkOut)
    const booking = await prisma.booking.create({ data })
    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error('[Bookings] POST error:', error)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
