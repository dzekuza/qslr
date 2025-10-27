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
        const search = searchParams.get('search');
        const isActive = searchParams.get('isActive');

        const where: any = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { city: { contains: search, mode: 'insensitive' } },
                { country: { contains: search, mode: 'insensitive' } },
                { contactName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { vendor: { businessName: { contains: search, mode: 'insensitive' } } }
            ];
        }

        if (isActive !== null && isActive !== undefined) {
            where.isActive = isActive === 'true';
        }

        const warehouses = await prisma.warehouse.findMany({
            where,
            include: {
                vendor: {
                    select: {
                        id: true,
                        businessName: true,
                        businessEmail: true,
                        businessPhone: true,
                        status: true,
                        user: {
                            select: {
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(warehouses);
    } catch (error) {
        console.error('Error fetching warehouses:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
