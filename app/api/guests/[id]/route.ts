import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { createAuditLog, getUserFromRequest } from '@/lib/audit'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!prisma) return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  try {
    const { id } = await params
    const guest = await prisma.guest.findUnique({ where: { id } })
    if (!guest) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(guest)
  } catch (error) {
    console.error('[Guests] GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch guest' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!prisma) return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  try {
    const { id } = await params
    const data = await request.json()
    const { id: _, ...updateData } = data
    const guest = await prisma.guest.update({ where: { id }, data: updateData })
    const user = getUserFromRequest(request)
    if (user) createAuditLog({ userId: user.userId, username: user.username, action: 'guest.updated', entity: 'guest', entityId: id })
    return NextResponse.json(guest)
  } catch (error) {
    console.error('[Guests] PATCH error:', error)
    return NextResponse.json({ error: 'Failed to update guest' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!prisma) return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  try {
    const { id } = await params
    await prisma.guest.delete({ where: { id } })
    const user = getUserFromRequest(request)
    if (user) createAuditLog({ userId: user.userId, username: user.username, action: 'guest.deleted', entity: 'guest', entityId: id })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Guests] DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete guest' }, { status: 500 })
  }
}
