import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
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
        const { name, address, city, state, postalCode, country, isActive } = body;

        const warehouse = await prisma.warehouse.update({
            where: {
                id: params.id,
                vendorId: vendor.id,
            },
            data: {
                name,
                address,
                city,
                state,
                postalCode,
                country,
                isActive,
            },
        });

        return NextResponse.json(warehouse);
    } catch (error) {
        console.error('Error updating warehouse:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
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

        await prisma.warehouse.delete({
            where: {
                id: params.id,
                vendorId: vendor.id,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting warehouse:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
