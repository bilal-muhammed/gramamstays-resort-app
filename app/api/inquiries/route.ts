import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/audit'

export async function GET() {
  if (!prisma) return NextResponse.json([])
  try {
    const inquiries = await prisma.inquiry.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(inquiries)
  } catch (error) {
    console.error('[Inquiries] GET error:', error)
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  if (!prisma) return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  try {
    const data = await request.json()
    const { id: _, ...createData } = data
    if (!createData.name || !createData.email || !createData.message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 })
    }
    const inquiry = await prisma.inquiry.create({ data: createData })
    return NextResponse.json(inquiry, { status: 201 })
  } catch (error) {
    console.error('[Inquiries] POST error:', error)
    return NextResponse.json({ error: 'Failed to create inquiry' }, { status: 500 })
  }
}
