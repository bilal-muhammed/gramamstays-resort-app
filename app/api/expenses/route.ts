import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  if (!prisma) return NextResponse.json([])
  try {
    const expenses = await prisma.expense.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(expenses)
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  if (!prisma) return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  try {
    const data = await request.json()
    const expense = await prisma.expense.create({ data })
    return NextResponse.json(expense, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
