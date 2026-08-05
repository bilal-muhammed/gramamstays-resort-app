const WHATSAPP_API_URL = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`

interface WhatsAppMessage {
  to: string
  template?: string
  parameters?: string[]
  text?: string
}

function formatPhone(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '')
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned
  }
  if (!cleaned.startsWith('91') && cleaned.length === 12) {
    cleaned = '91' + cleaned.slice(-10)
  }
  return cleaned
}

async function sendWhatsAppMessage(message: WhatsAppMessage): Promise<{ success: boolean; error?: string }> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN
  if (!token) {
    console.warn('[WhatsApp] ACCESS_TOKEN not configured')
    return { success: false, error: 'WhatsApp not configured' }
  }

  const to = formatPhone(message.to)

  let body: Record<string, unknown>

  if (message.template && message.parameters) {
    body = {
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: message.template,
        language: { code: 'en' },
        components: [
          {
            type: 'body',
            parameters: message.parameters.map(p => ({ type: 'text', text: p })),
          },
        ],
      },
    }
  } else if (message.text) {
    body = {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: message.text },
    }
  } else {
    return { success: false, error: 'No message content provided' }
  }

  try {
    const res = await fetch(WHATSAPP_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('[WhatsApp] API error:', data)
      return { success: false, error: data.error?.message || 'Failed to send' }
    }

    return { success: true }
  } catch (error) {
    console.error('[WhatsApp] Send failed:', error)
    return { success: false, error: String(error) }
  }
}

function fmtDate(d: string) {
  if (!d) return ''
  const date = d.includes('T') ? new Date(d) : new Date(d + 'T00:00:00')
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

interface BookingWhatsAppData {
  guest: string
  phone: string
  room: string
  roomNo: string
  checkIn: string
  checkOut: string
  nights: number
  amount: number
  paidAmount: number
  status: string
  addons?: string[]
}

const addonLabels: Record<string, string> = {
  trekking: 'Trekking', campfire: 'Campfire Night', food: 'Special Food',
  'extra-bed': 'Extra Bed', spa: 'Spa Session', 'nature-walk': 'Nature Walk',
  picnic: 'Picnic', tour: 'Guided Tour', yoga: 'Yoga Class',
  birdwatching: 'Bird Watching', boating: 'Boating', fishing: 'Fishing',
}

function buildWhatsAppMessage(data: BookingWhatsAppData): string {
  const balance = data.amount - data.paidAmount
  const addonList = data.addons?.length
    ? data.addons.map(a => addonLabels[a] || a).join(', ')
    : null

  let msg = ''

  switch (data.status) {
    case 'Pending':
      msg = `Hi ${data.guest}, your booking request at *Gramamstays Resort* has been received!

*Room:* ${data.room} #${data.roomNo}
*Check-in:* ${fmtDate(data.checkIn)}
*Check-out:* ${fmtDate(data.checkOut)}
*Duration:* ${data.nights} night${data.nights > 1 ? 's' : ''}
*Amount:* ₹${data.amount.toLocaleString()}

We'll confirm your booking shortly. Thank you for choosing Gramamstays!`
      break

    case 'Confirmed':
      msg = `Hi ${data.guest}, your booking at *Gramamstays Resort* is confirmed!

*Room:* ${data.room} #${data.roomNo}
*Check-in:* ${fmtDate(data.checkIn)}
*Check-out:* ${fmtDate(data.checkOut)}
*Duration:* ${data.nights} night${data.nights > 1 ? 's' : ''}
*Amount:* ₹${data.amount.toLocaleString()}
*Paid:* ₹${data.paidAmount.toLocaleString()}
${balance > 0 ? `*Balance:* ₹${balance.toLocaleString()}` : '*Status:* ✓ Fully Paid'}${addonList ? `\n\n*Add-ons:* ${addonList}` : ''}

Check-in Time: 2:00 PM onwards
Please carry a valid ID proof.

See you soon!`
      break

    case 'Checked In':
      msg = `Welcome to *Gramamstays Resort*, ${data.guest}!

✓ Checked In — Enjoy your stay!

*Room:* ${data.room} #${data.roomNo}
*Check-out:* ${fmtDate(data.checkOut)}${addonList ? `\n\n*Your Add-ons:* ${addonList}` : ''}

Reception is available 24/7 for any assistance.
Breakfast: 7:30 AM - 10:00 AM

Have a wonderful time!`
      break

    case 'Checked Out':
      msg = `Thank you for staying with us, ${data.guest}!

*Gramamstays Resort* hopes you had a wonderful experience.

*Room:* ${data.room} #${data.roomNo}
*Total:* ₹${data.amount.toLocaleString()}
*Paid:* ₹${data.paidAmount.toLocaleString()}

We'd love to hear your feedback. See you again soon!`
      break

    default:
      msg = `Hi ${data.guest}, your booking status at Gramamstays Resort has been updated to: *${data.status}*.`
  }

  return msg
}

export async function sendBookingStatusWhatsApp(
  data: BookingWhatsAppData,
  sendWhatsApp: boolean = true
): Promise<{ success: boolean; error?: string }> {
  if (!sendWhatsApp) {
    return { success: false, error: 'WhatsApp sending disabled by user' }
  }

  if (!data.phone || data.phone.trim() === '') {
    return { success: false, error: 'No phone number provided' }
  }

  const text = buildWhatsAppMessage(data)

  return sendWhatsAppMessage({
    to: data.phone,
    text,
  })
}
