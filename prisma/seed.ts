import { PrismaClient } from '../lib/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.booking.deleteMany()
  await prisma.room.deleteMany()
  await prisma.guest.deleteMany()
  await prisma.income.deleteMany()
  await prisma.expense.deleteMany()
  await prisma.staff.deleteMany()
  await prisma.activity.deleteMany()

  await prisma.booking.createMany({
    data: [
      { id: 'BK-1042', guest: 'Eleanor Whitfield', email: 'eleanor@email.com', phone: '+1 555-0101', room: 'Presidential Suite', roomNo: '301', checkIn: new Date('2026-07-18'), checkOut: new Date('2026-07-22'), nights: 4, status: 'Checked In', amount: 2600, paidAmount: 2600, payment: 'Fully Paid' },
      { id: 'BK-1041', guest: 'James Chen', email: 'james@email.com', phone: '+1 555-0102', room: 'Villa Deluxe', roomNo: '205', checkIn: new Date('2026-07-17'), checkOut: new Date('2026-07-20'), nights: 3, status: 'Checked In', amount: 1350, paidAmount: 1350, payment: 'Fully Paid' },
      { id: 'BK-1040', guest: 'Sofia Martinez', email: 'sofia@email.com', phone: '+1 555-0103', room: 'Garden Suite', roomNo: '108', checkIn: new Date('2026-07-19'), checkOut: new Date('2026-07-21'), nights: 2, status: 'Confirmed', amount: 500, paidAmount: 250, payment: 'Partial' },
      { id: 'BK-1039', guest: 'Amara Okafor', email: 'amara@email.com', phone: '+1 555-0104', room: 'Presidential Suite', roomNo: '302', checkIn: new Date('2026-07-20'), checkOut: new Date('2026-07-25'), nights: 5, status: 'Pending', amount: 3250, paidAmount: 0, payment: 'Pending' },
      { id: 'BK-1038', guest: 'David Kim', email: 'david@email.com', phone: '+1 555-0105', room: 'Garden Suite', roomNo: '109', checkIn: new Date('2026-07-16'), checkOut: new Date('2026-07-18'), nights: 2, status: 'Checked Out', amount: 500, paidAmount: 500, payment: 'Fully Paid' },
    ],
  })

  await prisma.room.createMany({
    data: [
      { id: '301', type: 'Presidential Suite', floor: '3rd', status: 'Occupied', guest: 'EW', price: 650, amenities: 'King Bed, Ocean View, Private Pool, Butler', until: 'Jul 22' },
      { id: '302', type: 'Presidential Suite', floor: '3rd', status: 'Reserved', guest: '-', price: 650, amenities: 'King Bed, Ocean View, Private Pool, Butler', from: 'Jul 20' },
      { id: '303', type: 'Presidential Suite', floor: '3rd', status: 'Available', guest: '-', price: 650, amenities: 'King Bed, Ocean View, Private Pool, Butler' },
      { id: '205', type: 'Villa Deluxe', floor: '2nd', status: 'Occupied', guest: 'JC', price: 450, amenities: 'Queen Bed, Garden View, Balcony, Minibar', until: 'Jul 20' },
      { id: '206', type: 'Villa Deluxe', floor: '2nd', status: 'Available', guest: '-', price: 450, amenities: 'Queen Bed, Garden View, Balcony, Minibar' },
      { id: '207', type: 'Villa Deluxe', floor: '2nd', status: 'Maintenance', guest: '-', price: 450, amenities: 'Queen Bed, Garden View, Balcony, Minibar', note: 'AC Repair' },
      { id: '108', type: 'Garden Suite', floor: '1st', status: 'Occupied', guest: 'SM', price: 250, amenities: 'Double Bed, Courtyard, Kitchenette', until: 'Jul 21' },
      { id: '109', type: 'Garden Suite', floor: '1st', status: 'Available', guest: '-', price: 250, amenities: 'Double Bed, Courtyard, Kitchenette' },
      { id: '110', type: 'Garden Suite', floor: '1st', status: 'Available', guest: '-', price: 250, amenities: 'Double Bed, Courtyard, Kitchenette' },
    ],
  })

  await prisma.guest.createMany({
    data: [
      { id: 'G-001', name: 'Eleanor Whitfield', email: 'eleanor@email.com', phone: '+1 555-0101', location: 'New York, USA', stays: 5, totalSpent: 7800, rating: 5, lastStay: 'Jul 18, 2026', vip: true },
      { id: 'G-002', name: 'James Chen', email: 'james@email.com', phone: '+1 555-0102', location: 'San Francisco, USA', stays: 3, totalSpent: 4200, rating: 4, lastStay: 'Jul 17, 2026', vip: false },
      { id: 'G-003', name: 'Sofia Martinez', email: 'sofia@email.com', phone: '+1 555-0103', location: 'Madrid, Spain', stays: 2, totalSpent: 1800, rating: 5, lastStay: 'Jul 19, 2026', vip: false },
      { id: 'G-004', name: 'Amara Okafor', email: 'amara@email.com', phone: '+1 555-0104', location: 'Lagos, Nigeria', stays: 4, totalSpent: 6500, rating: 5, lastStay: 'Jul 20, 2026', vip: true },
      { id: 'G-005', name: 'David Kim', email: 'david@email.com', phone: '+1 555-0105', location: 'Seoul, South Korea', stays: 1, totalSpent: 500, rating: 4, lastStay: 'Jul 16, 2026', vip: false },
    ],
  })

  await prisma.income.createMany({
    data: [
      { id: 'IN-001', date: 'Jul 18', source: 'Room - Presidential Suite #301', amount: 650, type: 'Room Revenue' },
      { id: 'IN-002', date: 'Jul 18', source: 'Spa - Deep Tissue Massage', amount: 180, type: 'Spa' },
      { id: 'IN-003', date: 'Jul 17', source: 'Room - Villa Deluxe #205', amount: 450, type: 'Room Revenue' },
      { id: 'IN-004', date: 'Jul 17', source: 'Dining - Harvest & Hearth', amount: 320, type: 'F&B' },
      { id: 'IN-005', date: 'Jul 16', source: 'Room - Garden Suite #108', amount: 250, type: 'Room Revenue' },
      { id: 'IN-006', date: 'Jul 16', source: 'Wine Tasting Experience', amount: 120, type: 'Experience' },
      { id: 'IN-007', date: 'Jul 15', source: 'Room - Villa Deluxe #206', amount: 450, type: 'Room Revenue' },
      { id: 'IN-008', date: 'Jul 15', source: 'Pool Cabana Rental', amount: 75, type: 'Amenity' },
    ],
  })

  await prisma.expense.createMany({
    data: [
      { id: 'EX-001', date: 'Jul 18', label: 'Staff Payroll', description: 'Weekly payroll for all departments', amount: 4200, category: 'Payroll' },
      { id: 'EX-002', date: 'Jul 17', label: 'Kitchen Supplies', description: 'Fresh produce and cooking ingredients', amount: 850, category: 'Supplies' },
      { id: 'EX-003', date: 'Jul 17', label: 'Housekeeping Products', description: 'Cleaning supplies and linens', amount: 320, category: 'Supplies' },
      { id: 'EX-004', date: 'Jul 16', label: 'Spa Products', description: 'Essential oils and treatment supplies', amount: 480, category: 'Supplies' },
      { id: 'EX-005', date: 'Jul 16', label: 'Utilities', description: 'Electricity and water bill', amount: 1200, category: 'Utilities' },
      { id: 'EX-006', date: 'Jul 15', label: 'Marketing Campaign', description: 'Social media and Google ads', amount: 2500, category: 'Marketing' },
      { id: 'EX-007', date: 'Jul 15', label: 'AC Unit Maintenance', description: 'Repair of Presidential Suite AC', amount: 780, category: 'Maintenance' },
    ],
  })

  await prisma.staff.createMany({
    data: [
      { id: 'S-001', name: 'Robert Williams', email: 'robert@gramamstays.com', phone: '+1 555-1001', role: 'General Manager', department: 'Management', status: 'Active', lastActive: '2 min ago', permissions: 'all' },
      { id: 'S-002', name: 'Maria Santos', email: 'maria@gramamstays.com', phone: '+1 555-1002', role: 'Front Desk Lead', department: 'Front Desk', status: 'Active', lastActive: '5 min ago', permissions: 'bookings,guests,rooms' },
      { id: 'S-003', name: 'Dr. Priya Sharma', email: 'priya@gramamstays.com', phone: '+1 555-1003', role: 'Spa Manager', department: 'Spa & Wellness', status: 'Active', lastActive: '10 min ago', permissions: 'spa' },
      { id: 'S-004', name: 'Chef Antoine Dubois', email: 'antoine@gramamstays.com', phone: '+1 555-1004', role: 'Head Chef', department: 'F&B', status: 'Active', lastActive: '1 min ago', permissions: 'dining' },
      { id: 'S-005', name: 'Sarah Johnson', email: 'sarah@gramamstays.com', phone: '+1 555-1005', role: 'Housekeeping Lead', department: 'Housekeeping', status: 'Off Duty', lastActive: '3 hr ago', permissions: 'rooms' },
    ],
  })

  await prisma.activity.createMany({
    data: [
      { id: 'A-001', time: '2 min ago', text: 'New booking from E. Whitfield' },
      { id: 'A-002', time: '15 min ago', text: 'Check-in: James Chen' },
      { id: 'A-003', time: '1 hr ago', text: 'Room 207 marked for maintenance' },
      { id: 'A-004', time: '3 hr ago', text: 'Payment received: $2,600' },
    ],
  })

  console.log('Database seeded!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
