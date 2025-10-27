'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateVendorStatus(vendorId: string, status: string) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      throw new Error('Unauthorized')
    }
    
    if (session.user.role !== 'ADMIN') {
      throw new Error('Forbidden')
    }

    const vendor = await prisma.vendor.update({
      where: { id: vendorId },
      data: { 
        status: status as any,
        approvedAt: status === 'APPROVED' ? new Date() : null
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    revalidatePath('/admin/vendors')
    return { success: true, vendor }
  } catch (error) {
    console.error('Error updating vendor status:', error)
    throw new Error('Failed to update vendor status')
  }
}

export async function updateProductStatus(productId: string, status: string) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      throw new Error('Unauthorized')
    }
    
    if (session.user.role !== 'ADMIN') {
      throw new Error('Forbidden')
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: { 
        status: status as any,
        publishedAt: status === 'ACTIVE' ? new Date() : null
      },
      include: {
        vendor: {
          select: {
            id: true,
            businessName: true,
            businessEmail: true,
            status: true,
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        },
        categories: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    revalidatePath('/admin/products')
    return { success: true, product }
  } catch (error) {
    console.error('Error updating product status:', error)
    throw new Error('Failed to update product status')
  }
}

export async function createProduct(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      throw new Error('Unauthorized')
    }
    
    if (session.user.role !== 'ADMIN') {
      throw new Error('Forbidden')
    }

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const shortDescription = formData.get('shortDescription') as string
    const price = parseFloat(formData.get('price') as string)
    const compareAtPrice = formData.get('compareAtPrice') ? parseFloat(formData.get('compareAtPrice') as string) : null
    const costPerItem = formData.get('costPerItem') ? parseFloat(formData.get('costPerItem') as string) : null
    const stock = parseInt(formData.get('stock') as string) || 0
    const sku = formData.get('sku') as string
    const status = formData.get('status') as string || 'ACTIVE'
    const vendorId = formData.get('vendorId') as string
    const wattage = formData.get('wattage') ? parseInt(formData.get('wattage') as string) : null
    const voltage = formData.get('voltage') ? parseInt(formData.get('voltage') as string) : null
    const panelType = formData.get('panelType') as string
    const efficiency = formData.get('efficiency') ? parseFloat(formData.get('efficiency') as string) : null
    const warranty = formData.get('warranty') ? parseInt(formData.get('warranty') as string) : null
    const dimensions = formData.get('dimensions') as string
    const weight = formData.get('weight') ? parseFloat(formData.get('weight') as string) : null
    const certification = JSON.parse(formData.get('certification') as string || '[]')
    const images = JSON.parse(formData.get('images') as string || '[]')
    const thumbnail = formData.get('thumbnail') as string
    const lowStockThreshold = parseInt(formData.get('lowStockThreshold') as string) || 10

    // Validate required fields
    if (!name || !description || !price || !vendorId) {
      throw new Error('Missing required fields')
    }

    // Check if vendor exists
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId }
    })

    if (!vendor) {
      throw new Error('Vendor not found')
    }

    // Generate SKU if not provided
    const productSku = sku || `ADMIN-${Date.now()}`
    
    // Generate slug
    const slug = `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`

    const product = await prisma.product.create({
      data: {
        vendorId,
        name,
        description,
        shortDescription,
        price,
        compareAtPrice,
        costPerItem,
        stock,
        lowStockThreshold,
        sku: productSku,
        slug,
        status: status as any,
        wattage,
        voltage,
        panelType,
        efficiency,
        warranty,
        dimensions,
        weight,
        certification,
        images,
        thumbnail,
        publishedAt: status === 'ACTIVE' ? new Date() : null
      },
      include: {
        vendor: {
          select: {
            id: true,
            businessName: true,
            businessEmail: true,
            status: true,
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        },
        categories: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    revalidatePath('/admin/products')
    return { success: true, product }
  } catch (error) {
    console.error('Error creating product:', error)
    throw new Error('Failed to create product')
  }
}
