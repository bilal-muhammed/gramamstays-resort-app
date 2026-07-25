import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

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

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!prisma) return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  try {
    const { id } = await params
    const booking = await prisma.booking.findUnique({ where: { id } })
    if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(deserializeBooking(booking as Record<string, unknown>))
  } catch (error) {
    console.error('[Booking] GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 })
  }
}

function toISODateTime(val: unknown): Date | undefined {
  if (val === undefined || val === null) return undefined
  if (val instanceof Date) return val
  if (typeof val === 'string') {
    if (val.includes('T')) return new Date(val)
    return new Date(val + 'T00:00:00.000Z')
  }
  return new Date(String(val))
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!prisma) return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  try {
    const { id } = await params
    const data = await request.json()
    const { id: _, ...updateData } = data
    if (updateData.checkIn) updateData.checkIn = toISODateTime(updateData.checkIn)
    if (updateData.checkOut) updateData.checkOut = toISODateTime(updateData.checkOut)
    serializeBooking(updateData)
    const booking = await prisma.booking.update({ where: { id }, data: updateData })
    return NextResponse.json(deserializeBooking(booking as Record<string, unknown>))
  } catch (error) {
    console.error('[Booking] PATCH error:', error)
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!prisma) return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  try {
    const { id } = await params
    await prisma.booking.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Booking] DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 })
  }
}
