import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/audit'

export async function GET() {
  if (!prisma) return NextResponse.json([])
  try {
    const testimonials = await prisma.testimonial.findMany({ orderBy: { order: 'asc' } })
    return NextResponse.json(testimonials)
  } catch (error) {
    console.error('[Testimonials] GET error:', error)
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  if (!prisma) return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  try {
    const data = await request.json()
    const { id: _, ...createData } = data
    const testimonial = await prisma.testimonial.create({ data: createData })
    return NextResponse.json(testimonial, { status: 201 })
  } catch (error) {
    console.error('[Testimonials] POST error:', error)
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 })
  }
}
