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

export async function GET() {
  if (!prisma) return NextResponse.json([])
  try {
    const staff = await prisma.staff.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(staff.map(deserializeStaff))
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  if (!prisma) return NextResponse.json({ error: 'Database not connected' }, { status: 503 })
  try {
    const data = await request.json()
    serializePermissions(data)
    const member = await prisma.staff.create({ data })
    return NextResponse.json(deserializeStaff(member as Record<string, unknown>), { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
