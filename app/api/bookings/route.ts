import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { createAuditLog, getUserFromRequest } from '@/lib/audit'
import { sendBookingStatusEmail, sendBookingStatusWhatsAppNotification } from '@/lib/notifications'

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

async function generateBookingId(): Promise<string> {
  const last = await prisma.booking.findFirst({ orderBy: { createdAt: 'desc' }, select: { id: true } })
  let nextNum = 1001
  if (last && last.id && last.id.startsWith('BK-')) {
    nextNum = parseInt(last.id.replace('BK-', ''), 10) + 1
  }
  return `BK-${nextNum}`
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
    const { id: _, sendEmail: sendEmailFlag, sendWhatsApp: sendWhatsAppFlag, ...createData } = data
    if (createData.checkIn) createData.checkIn = toISODateTime(createData.checkIn)
    if (createData.checkOut) createData.checkOut = toISODateTime(createData.checkOut)
    serializeBooking(createData)
    const bookingId = await generateBookingId()
    const booking = await prisma.booking.create({ data: { id: bookingId, ...createData } })

    const user = getUserFromRequest(request)
    if (user) {
      createAuditLog({
        userId: user.userId,
        username: user.username,
        action: 'booking.created',
        entity: 'booking',
        entityId: booking.id,
        details: { guest: createData.guest, room: createData.room },
      })
    }

    let emailStatus: { sent: boolean; error?: string } = { sent: false }
    let whatsappStatus: { sent: boolean; error?: string } = { sent: false }

    const checkInDate = booking.checkIn instanceof Date
      ? booking.checkIn.toISOString().split('T')[0]
      : String(booking.checkIn)
    const checkOutDate = booking.checkOut instanceof Date
      ? booking.checkOut.toISOString().split('T')[0]
      : String(booking.checkOut)

    let addons: string[] = []
    if (booking.addons) {
      if (typeof booking.addons === 'string') {
        try { addons = JSON.parse(booking.addons) } catch { addons = [] }
      } else if (Array.isArray(booking.addons)) {
        addons = booking.addons
      }
    }

    const bookingData = {
      guest: booking.guest,
      email: booking.email,
      phone: booking.phone,
      room: booking.room,
      roomNo: booking.roomNo,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      nights: booking.nights,
      amount: booking.amount,
      paidAmount: booking.paidAmount,
      payment: booking.payment,
      status: booking.status,
      addons,
      addonNote: booking.addonNote || undefined,
    }

    if (sendEmailFlag !== false && booking.email) {
      const result = await sendBookingStatusEmail(bookingData, true)
      emailStatus = { sent: result.success, error: result.error }
    }

    if (sendWhatsAppFlag !== false && booking.phone) {
      const result = await sendBookingStatusWhatsAppNotification(bookingData, true)
      whatsappStatus = { sent: result.success, error: result.error }
    }

    return NextResponse.json({ ...deserializeBooking(booking as Record<string, unknown>), emailStatus, whatsappStatus }, { status: 201 })
  } catch (error) {
    console.error('[Bookings] POST error:', error)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
