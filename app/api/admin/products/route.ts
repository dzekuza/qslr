import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const searchParams = request.nextUrl.searchParams;
        const status = searchParams.get('status');
        const search = searchParams.get('search');

        const where: any = {};

        if (status && status !== 'ALL') {
            where.status = status;
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { sku: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { vendor: { businessName: { contains: search, mode: 'insensitive' } } }
            ];
        }

        const products = await prisma.product.findMany({
            where,
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
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const { 
            name, 
            description, 
            shortDescription,
            price, 
            compareAtPrice,
            costPerItem,
            stock, 
            sku, 
            status = 'ACTIVE',
            vendorId,
            wattage,
            voltage,
            panelType,
            efficiency,
            warranty,
            dimensions,
            weight,
            certification = [],
            images = [],
            thumbnail,
            lowStockThreshold = 10
        } = body;

        // Validate required fields
        if (!name || !description || !price || !vendorId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if vendor exists
        const vendor = await prisma.vendor.findUnique({
            where: { id: vendorId }
        });

        if (!vendor) {
            return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
        }

        // Generate SKU if not provided
        const productSku = sku || `ADMIN-${Date.now()}`;
        
        // Generate slug
        const slug = `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

        const product = await prisma.product.create({
            data: {
                vendorId,
                name,
                description,
                shortDescription,
                price: parseFloat(price),
                compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
                costPerItem: costPerItem ? parseFloat(costPerItem) : null,
                stock: parseInt(stock) || 0,
                lowStockThreshold: parseInt(lowStockThreshold) || 10,
                sku: productSku,
                slug,
                status,
                wattage: wattage ? parseInt(wattage) : null,
                voltage: voltage ? parseInt(voltage) : null,
                panelType,
                efficiency: efficiency ? parseFloat(efficiency) : null,
                warranty: warranty ? parseInt(warranty) : null,
                dimensions,
                weight: weight ? parseFloat(weight) : null,
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
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
