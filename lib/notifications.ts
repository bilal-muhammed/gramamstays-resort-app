import { Resend } from 'resend'
import { getBookingEmail } from './email-templates'
import { sendBookingStatusWhatsApp } from './whatsapp'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

interface BookingData {
  guest: string
  email: string
  phone: string
  room: string
  roomNo: string
  checkIn: string
  checkOut: string
  nights: number
  amount: number
  paidAmount: number
  payment: string
  status: string
  addons?: string[]
  addonNote?: string
}

export async function sendBookingStatusEmail(
  booking: BookingData,
  sendEmail: boolean = true
): Promise<{ success: boolean; error?: string }> {
  if (!sendEmail) {
    return { success: false, error: 'Email sending disabled by user' }
  }

  if (!resend) {
    console.warn('[Notifications] Resend not configured - RESEND_API_KEY missing')
    return { success: false, error: 'Email service not configured' }
  }

  if (!booking.email || booking.email.trim() === '') {
    return { success: false, error: 'No email address provided' }
  }

  try {
    const { subject, html } = getBookingEmail(booking)

    const fromEmail = 'noreply@gramamstay.com'

    await resend.emails.send({
      from: `Gramamstays Resort <${fromEmail}>`,
      to: booking.email,
      subject,
      html,
    })

    return { success: true }
  } catch (error) {
    console.error('[Notifications] Failed to send email:', error)
    return { success: false, error: String(error) }
  }
}

export async function sendBookingStatusWhatsAppNotification(
  booking: BookingData,
  sendWhatsApp: boolean = true
): Promise<{ success: boolean; error?: string }> {
  return sendBookingStatusWhatsApp({
    guest: booking.guest,
    phone: booking.phone,
    room: booking.room,
    roomNo: booking.roomNo,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    nights: booking.nights,
    amount: booking.amount,
    paidAmount: booking.paidAmount,
    status: booking.status,
    addons: booking.addons,
  }, sendWhatsApp)
}
