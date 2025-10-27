import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth"; import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateStatusSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'SUSPENDED', 'REJECTED']),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = updateStatusSchema.parse(body)

    const vendor = await prisma.vendor.findUnique({
      where: { id },
    })

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    const updateData: any = {
      status: validatedData.status,
    }

    // Set approvedAt timestamp when approving
    if (validatedData.status === 'APPROVED' && vendor.status !== 'APPROVED') {
      updateData.approvedAt = new Date()
    }

    const updatedVendor = await prisma.vendor.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(updatedVendor)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    console.error('Error updating vendor status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
