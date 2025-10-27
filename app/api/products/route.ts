import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth"; import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (session.user.role !== 'VENDOR' && session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
        });

        if (!vendor) {
            return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
        }

        const products = await prisma.product.findMany({
            where: {
                vendorId: vendor.id,
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
        if (session.user.role !== 'VENDOR' && session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
        });

        if (!vendor) {
            return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
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
            status = 'DRAFT',
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
        if (!name || !description || !price) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Generate SKU if not provided
        const productSku = sku || `VENDOR-${Date.now()}`;

        // Generate slug
        const slug = `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

        const product = await prisma.product.create({
            data: {
                vendorId: vendor.id,
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
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
