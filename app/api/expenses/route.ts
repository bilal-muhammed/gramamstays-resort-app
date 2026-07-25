import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  if (!prisma) return NextResponse.json([])
  try {
    const expenses = await prisma.expense.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(expenses)
  } catch (error) {
    console.error('[Expenses] GET error:', error)
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  if (!prisma) return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  try {
    const data = await request.json()
    const { id: _, ...createData } = data
    const expense = await prisma.expense.create({ data: createData })
    return NextResponse.json(expense, { status: 201 })
  } catch (error) {
    console.error('[Expenses] POST error:', error)
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 })
  }
}
