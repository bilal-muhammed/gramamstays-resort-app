import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  if (!prisma) return NextResponse.json([])
  try {
    const activities = await prisma.activity.findMany({ orderBy: { createdAt: 'desc' }, take: 20 })
    return NextResponse.json(activities)
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  if (!prisma) return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  try {
    const data = await request.json()
    const activity = await prisma.activity.create({ data })
    return NextResponse.json(activity, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
