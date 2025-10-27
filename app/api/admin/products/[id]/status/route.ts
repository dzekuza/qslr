import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { status } = await request.json();

        if (!status || !['DRAFT', 'PENDING', 'ACTIVE', 'REJECTED', 'OUT_OF_STOCK'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const product = await prisma.product.update({
            where: { id: params.id },
            data: { 
                status,
                ...(status === 'ACTIVE' && { publishedAt: new Date() })
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

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error updating product status:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
