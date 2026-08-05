import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!prisma) return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  try {
    const { id } = await params
    const data = await request.json()
    const { id: _, ...updateData } = data
    const inquiry = await prisma.inquiry.update({ where: { id }, data: updateData })
    return NextResponse.json(inquiry)
  } catch (error) {
    console.error('[Inquiries] PATCH error:', error)
    return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!prisma) return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  try {
    const { id } = await params
    await prisma.inquiry.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Inquiries] DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete inquiry' }, { status: 500 })
  }
}
