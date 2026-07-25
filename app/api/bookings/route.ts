import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

function toISODateTime(val: unknown): Date | undefined {
  if (val === undefined || val === null) return undefined
  if (val instanceof Date) return val
  if (typeof val === 'string') {
    if (val.includes('T')) return new Date(val)
    return new Date(val + 'T00:00:00.000Z')
  }
  return new Date(String(val))
}

function serializeBooking(data: Record<string, unknown>) {
  if (data.addons && Array.isArray(data.addons)) {
    data.addons = JSON.stringify(data.addons)
  }
  return data
}

function deserializeBooking(booking: Record<string, unknown>) {
  if (typeof booking.addons === 'string') {
    try {
      booking.addons = JSON.parse(booking.addons)
    } catch {
      booking.addons = []
    }
  }
  return booking
}

export async function GET() {
  if (!prisma) {
    console.error('[Bookings] Prisma client is null - DATABASE_URL may be missing')
    return NextResponse.json([])
  }
  try {
    const bookings = await prisma.booking.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(bookings.map(deserializeBooking))
  } catch (error) {
    console.error('[Bookings] GET error:', error)
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  if (!prisma) return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  try {
    const data = await request.json()
    const { id: _, ...createData } = data
    if (createData.checkIn) createData.checkIn = toISODateTime(createData.checkIn)
    if (createData.checkOut) createData.checkOut = toISODateTime(createData.checkOut)
    serializeBooking(createData)
    const booking = await prisma.booking.create({ data: createData })
    return NextResponse.json(deserializeBooking(booking as Record<string, unknown>), { status: 201 })
  } catch (error) {
    console.error('[Bookings] POST error:', error)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
