import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!prisma) return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  try {
    const { id } = await params
    const testimonial = await prisma.testimonial.findUnique({ where: { id } })
    if (!testimonial) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(testimonial)
  } catch (error) {
    console.error('[Testimonial] GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch testimonial' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!prisma) return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  try {
    const { id } = await params
    const data = await request.json()
    const { id: _, ...updateData } = data
    const testimonial = await prisma.testimonial.update({ where: { id }, data: updateData })
    return NextResponse.json(testimonial)
  } catch (error) {
    console.error('[Testimonial] PATCH error:', error)
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!prisma) return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  try {
    const { id } = await params
    await prisma.testimonial.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Testimonial] DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 })
  }
}
