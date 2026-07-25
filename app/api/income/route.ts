import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  if (!prisma) return NextResponse.json([])
  try {
    const income = await prisma.income.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(income)
  } catch (error) {
    console.error('[Income] GET error:', error)
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  if (!prisma) return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  try {
    const data = await request.json()
    const { id: _, ...createData } = data
    const income = await prisma.income.create({ data: createData })
    return NextResponse.json(income, { status: 201 })
  } catch (error) {
    console.error('[Income] POST error:', error)
    return NextResponse.json({ error: 'Failed to create income' }, { status: 500 })
  }
}
