import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  if (!prisma) return NextResponse.json([])
  try {
    const rooms = await prisma.room.findMany({ orderBy: { id: 'asc' } })
    return NextResponse.json(rooms)
  } catch (error) {
    console.error('[Rooms] GET error:', error)
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  if (!prisma) return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  try {
    const data = await request.json()
    const { id: _, ...createData } = data
    const room = await prisma.room.create({ data: createData })
    return NextResponse.json(room, { status: 201 })
  } catch (error) {
    console.error('[Rooms] POST error:', error)
    return NextResponse.json({ error: 'Failed to create room' }, { status: 500 })
  }
}
