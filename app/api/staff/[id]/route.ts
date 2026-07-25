import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

function serializePermissions(data: Record<string, unknown>) {
  if (data && Array.isArray(data.permissions)) {
    data.permissions = JSON.stringify(data.permissions)
  }
  return data
}

function deserializeStaff(staff: Record<string, unknown>) {
  if (typeof staff.permissions === 'string') {
    try {
      staff.permissions = JSON.parse(staff.permissions)
    } catch {
      staff.permissions = []
    }
  }
  return staff
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!prisma) return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  try {
    const { id } = await params
    const member = await prisma.staff.findUnique({ where: { id } })
    if (!member) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(deserializeStaff(member as Record<string, unknown>))
  } catch (error) {
    console.error('[Staff] GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!prisma) return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  try {
    const { id } = await params
    const data = await request.json()
    const { id: _, ...updateData } = data
    serializePermissions(updateData as Record<string, unknown>)
    const member = await prisma.staff.update({ where: { id }, data: updateData })
    return NextResponse.json(deserializeStaff(member as Record<string, unknown>))
  } catch (error) {
    console.error('[Staff] PATCH error:', error)
    return NextResponse.json({ error: 'Failed to update staff' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!prisma) return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  try {
    const { id } = await params
    await prisma.staff.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Staff] DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete staff' }, { status: 500 })
  }
}
