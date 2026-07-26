import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { createAuditLog, getUserFromRequest } from '@/lib/audit'

export async function GET() {
  if (!prisma) return NextResponse.json([])
  try {
    const guests = await prisma.guest.findMany({ orderBy: { name: 'asc' } })
    return NextResponse.json(guests)
  } catch (error) {
    console.error('[Guests] GET error:', error)
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  if (!prisma) return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  try {
    const data = await request.json()
    const { id: _, ...createData } = data
    const guest = await prisma.guest.create({ data: createData })
    const user = getUserFromRequest(request)
    if (user) createAuditLog({ userId: user.userId, username: user.username, action: 'guest.created', entity: 'guest', entityId: guest.id, details: { name: createData.name } })
    return NextResponse.json(guest, { status: 201 })
  } catch (error) {
    console.error('[Guests] POST error:', error)
    return NextResponse.json({ error: 'Failed to create guest' }, { status: 500 })
  }
}
