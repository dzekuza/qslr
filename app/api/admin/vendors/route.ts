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

        const vendors = await prisma.vendor.findMany({
            where: {
                status: 'APPROVED' // Only show approved vendors
            },
            select: {
                id: true,
                businessName: true,
                businessEmail: true,
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                businessName: 'asc'
            }
        });

        return NextResponse.json(vendors);
    } catch (error) {
        console.error('Error fetching vendors:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}