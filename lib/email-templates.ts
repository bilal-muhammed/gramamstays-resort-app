interface BookingEmailData {
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

function fmtDate(d: string) {
  if (!d) return ''
  const date = d.includes('T') ? new Date(d) : new Date(d + 'T00:00:00')
  return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

function fmtDateShort(d: string) {
  if (!d) return ''
  const date = d.includes('T') ? new Date(d) : new Date(d + 'T00:00:00')
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const addonLabels: Record<string, string> = {
  trekking: 'Trekking',
  campfire: 'Campfire Night',
  food: 'Special Food',
  'extra-bed': 'Extra Bed',
  spa: 'Spa Session',
  'nature-walk': 'Nature Walk',
  picnic: 'Picnic',
  tour: 'Guided Tour',
  yoga: 'Yoga Class',
  birdwatching: 'Bird Watching',
  boating: 'Boating',
  fishing: 'Fishing',
}

const baseStyles = `
  body { margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
  .header { background: linear-gradient(135deg, #1a3a0a 0%, #2d5016 50%, #4a7c28 100%); padding: 36px 24px; text-align: center; }
  .header h1 { color: #ffffff; font-size: 26px; margin: 0 0 6px; font-weight: 700; letter-spacing: 0.5px; }
  .header p { color: #b8d4a0; font-size: 12px; margin: 0; text-transform: uppercase; letter-spacing: 2px; }
  .content { padding: 32px 24px; }
  .greeting { font-size: 16px; color: #1f2937; margin: 0 0 12px; font-weight: 600; }
  .body-text { color: #4b5563; font-size: 14px; line-height: 1.7; margin: 0 0 20px; }
  .status-badge { display: inline-block; padding: 10px 24px; border-radius: 24px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 20px 0; }
  .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #9ca3af; margin: 28px 0 12px; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb; }
  .kv-table { width: 100%; border-collapse: collapse; margin: 0 0 20px; }
  .kv-table td { padding: 10px 0; border-bottom: 1px solid #f0f0f0; vertical-align: top; }
  .kv-table tr:last-child td { border-bottom: none; }
  .kv-label { color: #6b7280; font-size: 13px; width: 40%; white-space: nowrap; }
  .kv-value { color: #1f2937; font-size: 13px; font-weight: 600; text-align: right; }
  .kv-divider { border: none; border-top: 1px solid #f0f0f0; margin: 0; }
  .payment-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin: 0 0 20px; }
  .payment-total { text-align: center; padding: 16px 0; border-bottom: 1px solid #e5e7eb; margin-bottom: 16px; }
  .payment-total-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; font-weight: 600; }
  .payment-total-value { font-size: 32px; font-weight: 800; color: #15803d; margin: 4px 0; }
  .payment-status { font-size: 12px; color: #16a34a; font-weight: 600; }
  .payment-row { display: flex; justify-content: space-between; padding: 8px 0; }
  .payment-row-label { color: #6b7280; font-size: 13px; }
  .payment-row-value { color: #1f2937; font-size: 13px; font-weight: 600; }
  .addons-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 16px 20px; margin: 20px 0; }
  .addons-title { font-size: 12px; font-weight: 700; color: #1e40af; margin-bottom: 10px; }
  .addon-item { display: flex; align-items: center; gap: 8px; padding: 6px 0; }
  .addon-dot { width: 6px; height: 6px; border-radius: 50%; background: #3b82f6; flex-shrink: 0; }
  .addon-name { font-size: 13px; color: #1e3a5f; font-weight: 500; }
  .note-box { background: #fefce8; border: 1px solid #fde68a; border-radius: 8px; padding: 12px 16px; margin: 12px 0; }
  .note-label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #a16207; margin-bottom: 4px; }
  .note-text { font-size: 13px; color: #713f12; line-height: 1.5; }
  .divider { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
  .footer { background: #f9fafb; padding: 28px 24px; text-align: center; border-top: 1px solid #e5e7eb; }
  .footer p { color: #9ca3af; font-size: 12px; margin: 0 0 4px; }
  .footer a { color: #4a7c28; text-decoration: none; font-weight: 600; }
  .footer .brand { color: #6b7280; font-size: 13px; font-weight: 600; margin-bottom: 8px; }
`

function wrapHtml(title: string, headerSubtitle: string, bodyContent: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body>
  <div class="container">
    <div class="header">
      <h1>Gramamstays </h1>
      <p>${headerSubtitle}</p>
    </div>
    <div class="content">
      ${bodyContent}
    </div>
    <div class="footer">
      <p class="brand">Gramamstays </p>
      <p>Your Nature Escape in Kerala</p>
      <p>For inquiries: <a href="mailto:admin@gramamstays.com">admin@gramamstays.com</a></p>
    </div>
  </div>
  <style>${baseStyles}</style>
</body>
</html>`
}

function kvRow(label: string, value: string, valueStyle?: string): string {
  return `
    <tr>
      <td class="kv-label">${label}</td>
      <td class="kv-value" ${valueStyle ? `style="${valueStyle}"` : ''}>${value}</td>
    </tr>`
}

function bookingDetailsBlock(data: BookingEmailData): string {
  const balance = data.amount - data.paidAmount
  const isFullyPaid = balance <= 0

  let html = `
  <p class="section-title">Guest Information</p>
  <table class="kv-table">
    ${kvRow('Name', data.guest)}
    ${kvRow('Phone', data.phone || 'N/A')}
    ${kvRow('Email', data.email || 'N/A')}
  </table>

  <p class="section-title">Reservation Details</p>
  <table class="kv-table">
    ${kvRow('Room Type', data.room)}
    ${kvRow('Room Number', data.roomNo || 'TBD')}
    ${kvRow('Check-in', fmtDateShort(data.checkIn))}
    ${kvRow('Check-out', fmtDateShort(data.checkOut))}
    ${kvRow('Duration', `${data.nights} night${data.nights > 1 ? 's' : ''}`)}
  </table>`

  html += `
  <p class="section-title">Payment Summary</p>
  <div class="payment-box">
    <div class="payment-total">
      <div class="payment-total-label">Total Amount</div>
      <div class="payment-total-value">₹${data.amount.toLocaleString()}</div>
      <div class="payment-status">${isFullyPaid ? '✓ Fully Paid' : balance > 0 ? `Partial — ₹${balance.toLocaleString()} pending` : 'Pending'}</div>
    </div>
    <div class="payment-row">
      <span class="payment-row-label">Amount Paid</span>
      <span class="payment-row-value" style="color:#16a34a;">₹${data.paidAmount.toLocaleString()}</span>
    </div>
    <div class="payment-row">
      <span class="payment-row-label">Balance Due</span>
      <span class="payment-row-value" style="${balance > 0 ? 'color:#dc2626;' : 'color:#16a34a;'}">₹${balance.toLocaleString()}</span>
    </div>
  </div>`

  if (data.addons && data.addons.length > 0) {
    html += `
    <p class="section-title">Add-ons & Extras</p>
    <div class="addons-box">
      <div class="addons-title">${data.addons.length} add-on${data.addons.length > 1 ? 's' : ''} selected</div>
      ${data.addons.map(a => `
        <div class="addon-item">
          <span class="addon-dot"></span>
          <span class="addon-name">${addonLabels[a] || a}</span>
        </div>`).join('')}
    </div>`
  }

  if (data.addonNote) {
    html += `
    <div class="note-box">
      <div class="note-label">Special Request</div>
      <div class="note-text">${data.addonNote}</div>
    </div>`
  }

  return html
}

export function getBookingEmail(data: BookingEmailData): { subject: string; html: string } {
  switch (data.status) {
    case 'Pending':
      return {
        subject: `Booking Request Received - Gramamstays `,
        html: wrapHtml('Booking Request Received', 'Booking Confirmation', `
          <p class="greeting">Dear ${data.guest},</p>
          <p class="body-text">
            Thank you for choosing Gramamstays ! We have received your booking request and our team is reviewing it. You will receive a confirmation shortly.
          </p>
          <div style="text-align:center;">
            <span class="status-badge" style="background:#fef3c7;color:#92400e;border:2px solid #f59e0b;">⏳ Pending Review</span>
          </div>
          ${bookingDetailsBlock(data)}
          <hr class="divider">
          <p class="body-text">
            We will send you a confirmation email once your booking is approved. If you have any questions, feel free to reach out to us.
          </p>
        `)
      }

    case 'Confirmed':
      return {
        subject: `Booking Confirmed! - Gramamstays `,
        html: wrapHtml('Booking Confirmed', 'Reservation Confirmed', `
          <p class="greeting">Dear ${data.guest},</p>
          <p class="body-text">
            Great news! Your booking has been confirmed. We look forward to welcoming you to Gramamstays  for a wonderful stay.
          </p>
          <div style="text-align:center;">
            <span class="status-badge" style="background:#dcfce7;color:#166534;border:2px solid #22c55e;">✓ Confirmed</span>
          </div>
          ${bookingDetailsBlock(data)}
          <hr class="divider">
          <p class="body-text">
            <strong>Check-in Time:</strong> 2:00 PM onwards<br>
            <strong>Check-out Time:</strong> 11:00 AM<br><br>
            Please carry a valid ID proof during check-in. If you need to make any changes to your reservation, feel free to contact us.
          </p>
        `)
      }

    case 'Checked In':
      return {
        subject: `Welcome to Gramamstays !`,
        html: wrapHtml('Welcome!', 'Check-in Complete', `
          <p class="greeting">Dear ${data.guest},</p>
          <p class="body-text">
            Welcome to Gramamstays ! We are delighted to have you with us. We hope you have a comfortable and memorable stay.
          </p>
          <div style="text-align:center;">
            <span class="status-badge" style="background:#dcfce7;color:#166534;border:2px solid #22c55e;">✓ Checked In</span>
          </div>
          ${bookingDetailsBlock(data)}
          <hr class="divider">
          <p class="body-text">
            <strong>Important Information:</strong><br>
            • Reception is available 24/7 for any assistance<br>
            • Breakfast is served from 7:30 AM to 10:00 AM<br>
            • Wi-Fi password available at the front desk<br>
            • Emergency contact: +91 XXXXX XXXXX<br><br>
            Enjoy your stay and explore everything our  has to offer!
          </p>
        `)
      }

    case 'Checked Out':
      return {
        subject: `Thank You for Staying with Us - Gramamstays `,
        html: wrapHtml('Thank You!', 'Check-out Complete', `
          <p class="greeting">Dear ${data.guest},</p>
          <p class="body-text">
            Thank you for choosing Gramamstays . It was a pleasure hosting you. We hope you had a wonderful experience and look forward to welcoming you again.
          </p>
          <div style="text-align:center;">
            <span class="status-badge" style="background:#f3f4f6;color:#374151;border:2px solid #9ca3af;">✓ Checked Out</span>
          </div>
          ${bookingDetailsBlock(data)}
          <hr class="divider">
          <p class="body-text">
            We would love to hear about your experience! Your feedback helps us serve you and future guests better.<br><br>
            Thank you for staying with us. We hope to see you again soon at Gramamstays !
          </p>
        `)
      }

    default:
      return {
        subject: `Booking Status Updated - Gramamstays `,
        html: wrapHtml('Booking Update', 'Status Updated', `
          <p class="greeting">Dear ${data.guest},</p>
          <p class="body-text">
            Your booking status has been updated. Please find the latest details below.
          </p>
          <div style="text-align:center;">
            <span class="status-badge" style="background:#e5e7eb;color:#374151;border:2px solid #9ca3af;">${data.status}</span>
          </div>
          ${bookingDetailsBlock(data)}
        `)
      }
  }
}
