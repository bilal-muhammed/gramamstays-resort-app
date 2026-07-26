import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { createAuditLog, getUserFromRequest } from '@/lib/audit'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!prisma) return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  try {
    const { id } = await params
    const room = await prisma.room.findUnique({ where: { id } })
    if (!room) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(room)
  } catch (error) {
    console.error('[Room] GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch room' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!prisma) return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  try {
    const { id } = await params
    const data = await request.json()
    const { id: _, ...updateData } = data
    const room = await prisma.room.update({ where: { id }, data: updateData })
    const user = getUserFromRequest(request)
    if (user && updateData.status) createAuditLog({ userId: user.userId, username: user.username, action: 'room.status_changed', entity: 'room', entityId: id, details: { newStatus: updateData.status } })
    return NextResponse.json(room)
  } catch (error) {
    console.error('[Room] PATCH error:', error)
    return NextResponse.json({ error: 'Failed to update room' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!prisma) return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  try {
    const { id } = await params
    await prisma.room.delete({ where: { id } })
    const user = getUserFromRequest(request)
    if (user) createAuditLog({ userId: user.userId, username: user.username, action: 'room.deleted', entity: 'room', entityId: id })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Room] DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete room' }, { status: 500 })
  }
}
