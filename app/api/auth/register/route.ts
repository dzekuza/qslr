import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { customerRegistrationSchema, vendorRegistrationSchema } from '@/lib/validations/auth'
import { UserRole } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { role, ...formData } = body

    // Validate the form data based on role
    let validatedData
    if (role === 'CUSTOMER') {
      validatedData = customerRegistrationSchema.parse(formData)
    } else if (role === 'VENDOR') {
      validatedData = vendorRegistrationSchema.parse(formData)
    } else {
      return NextResponse.json(
        { error: 'Invalid role specified' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Create user data
    const userData = {
      name: role === 'CUSTOMER' ? validatedData.name : validatedData.contactName,
      email: validatedData.email,
      password: hashedPassword,
      role: role as UserRole,
    }

    // Create user and related data based on role
    if (role === 'CUSTOMER') {
      const user = await prisma.user.create({
        data: userData,
      })

      return NextResponse.json(
        { 
          message: 'Customer account created successfully',
          userId: user.id 
        },
        { status: 201 }
      )
    } else if (role === 'VENDOR') {
      // Create vendor with user
      const user = await prisma.user.create({
        data: {
          ...userData,
          vendor: {
            create: {
              businessName: validatedData.businessName,
              businessEmail: validatedData.email,
              businessPhone: validatedData.phone,
              taxId: validatedData.taxId,
              description: validatedData.businessDescription,
              status: 'PENDING', // Vendor needs approval
            }
          }
        },
        include: {
          vendor: true
        }
      })

      return NextResponse.json(
        { 
          message: 'Vendor application submitted successfully',
          userId: user.id,
          vendorId: user.vendor?.id
        },
        { status: 201 }
      )
    }

  } catch (error) {
    console.error('Registration error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid form data', details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
