import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  if (!prisma) return NextResponse.json([])
  try {
    const properties = await prisma.property.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(properties)
  } catch (error) {
    console.error('[Properties] GET error:', error)
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  if (!prisma) return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  try {
    const data = await request.json()
    const { id: _, ...createData } = data
    const property = await prisma.property.create({ data: createData })
    return NextResponse.json(property, { status: 201 })
  } catch (error) {
    console.error('[Properties] POST error:', error)
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 })
  }
}
