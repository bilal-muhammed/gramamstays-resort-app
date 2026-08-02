import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { createAuditLog, getUserFromRequest } from '@/lib/audit'
import { sendBookingStatusEmail, sendBookingStatusWhatsAppNotification } from '@/lib/notifications'

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
    const { id: _, sendEmail: sendEmailFlag, sendWhatsApp: sendWhatsAppFlag, ...updateData } = data
    if (updateData.checkIn) updateData.checkIn = toISODateTime(updateData.checkIn)
    if (updateData.checkOut) updateData.checkOut = toISODateTime(updateData.checkOut)
    serializeBooking(updateData)

    const current = await prisma.booking.findUnique({ where: { id } })
    if (!current) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    if (updateData.status === 'Checked Out') {
      const amount = updateData.amount ?? current.amount
      const paidAmount = updateData.paidAmount ?? current.paidAmount
      if (amount > paidAmount) {
        return NextResponse.json({ error: `Cannot check out — ₹${amount - paidAmount} balance pending` }, { status: 400 })
      }
    }

    const oldStatus = current.status
    const booking = await prisma.booking.update({ where: { id }, data: updateData })
    const deserialized = deserializeBooking(booking as Record<string, unknown>)

    const user = getUserFromRequest(request)
    if (user) {
      const action = updateData.status === 'Checked In' ? 'booking.checked_in'
        : updateData.status === 'Checked Out' ? 'booking.checked_out'
        : 'booking.updated'
      createAuditLog({
        userId: user.userId,
        username: user.username,
        action,
        entity: 'booking',
        entityId: id,
        details: updateData.status ? { status: updateData.status } : undefined,
      })
    }

    let emailStatus: { sent: boolean; error?: string } = { sent: false }
    let whatsappStatus: { sent: boolean; error?: string } = { sent: false }
    if (updateData.status && updateData.status !== oldStatus) {
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
        status: updateData.status,
        addons,
        addonNote: booking.addonNote || undefined,
      }

      const [emailResult, whatsappResult] = await Promise.all([
        sendBookingStatusEmail(bookingData, sendEmailFlag !== false),
        sendBookingStatusWhatsAppNotification(bookingData, sendWhatsAppFlag !== false),
      ])
      emailStatus = { sent: emailResult.success, error: emailResult.error }
      whatsappStatus = { sent: whatsappResult.success, error: whatsappResult.error }
    }

    return NextResponse.json({ ...deserialized, emailStatus, whatsappStatus })
  } catch (error) {
    console.error('[Booking] PATCH error:', error)
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!prisma) return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  try {
    const { id } = await params
    await prisma.booking.delete({ where: { id } })
    const user = getUserFromRequest(request)
    if (user) createAuditLog({ userId: user.userId, username: user.username, action: 'booking.deleted', entity: 'booking', entityId: id })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Booking] DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 })
  }
}
