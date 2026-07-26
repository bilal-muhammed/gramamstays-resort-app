import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { createAuditLog, getUserFromRequest } from '@/lib/audit'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!prisma) return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  try {
    const { id } = await params
    const expense = await prisma.expense.findUnique({ where: { id } })
    if (!expense) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(expense)
  } catch (error) {
    console.error('[Expense] GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch expense' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!prisma) return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  try {
    const { id } = await params
    const data = await request.json()
    const { id: _, ...updateData } = data
    const expense = await prisma.expense.update({ where: { id }, data: updateData })
    const user = getUserFromRequest(request)
    if (user) createAuditLog({ userId: user.userId, username: user.username, action: 'expense.updated', entity: 'expense', entityId: id })
    return NextResponse.json(expense)
  } catch (error) {
    console.error('[Expense] PATCH error:', error)
    return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!prisma) return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  try {
    const { id } = await params
    await prisma.expense.delete({ where: { id } })
    const user = getUserFromRequest(request)
    if (user) createAuditLog({ userId: user.userId, username: user.username, action: 'expense.deleted', entity: 'expense', entityId: id })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Expense] DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 })
  }
}
