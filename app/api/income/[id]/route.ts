import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!prisma) return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  try {
    const { id } = await params
    const income = await prisma.income.findUnique({ where: { id } })
    if (!income) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(income)
  } catch (error) {
    console.error('[Income] GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch income' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!prisma) return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  try {
    const { id } = await params
    const data = await request.json()
    const { id: _, ...updateData } = data
    const income = await prisma.income.update({ where: { id }, data: updateData })
    return NextResponse.json(income)
  } catch (error) {
    console.error('[Income] PATCH error:', error)
    return NextResponse.json({ error: 'Failed to update income' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!prisma) return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  try {
    const { id } = await params
    await prisma.income.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Income] DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete income' }, { status: 500 })
  }
}
