import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  if (!prisma) return NextResponse.json([])
  try {
    const guests = await prisma.guest.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(guests)
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  if (!prisma) return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  try {
    const data = await request.json()
    const guest = await prisma.guest.create({ data })
    return NextResponse.json(guest, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
