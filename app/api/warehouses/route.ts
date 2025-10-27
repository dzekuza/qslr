import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'VENDOR' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const warehouses = await prisma.warehouse.findMany({
      where: {
        vendor: {
          userId: session.user.id,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(warehouses)
  } catch (error) {
    console.error('Error fetching warehouses:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'VENDOR' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Get vendor
    const vendor = await prisma.vendor.findUnique({
      where: { userId: session.user.id },
    })

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { 
      name, 
      address, 
      city, 
      state, 
      postalCode, 
      country, 
      isActive,
      street,
      zipCode,
      contactName,
      email,
      phone,
      apartment
    } = body

    const warehouse = await prisma.warehouse.create({
      data: {
        vendorId: vendor.id,
        name,
        street: street || '',
        city,
        zipCode: zipCode || postalCode || '',
        country: country || 'US',
        contactName: contactName || '',
        email: email || '',
        phone: phone || '',
        apartment: apartment || null,
        address: address || null,
        state: state || null,
        postalCode: postalCode || null,
        isActive: isActive !== undefined ? isActive : true,
      },
    })

    return NextResponse.json(warehouse, { status: 201 })
  } catch (error) {
    console.error('Error creating warehouse:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
