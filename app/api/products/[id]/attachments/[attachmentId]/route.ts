import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { unlink } from 'fs/promises';
import { join } from 'path';

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string; attachmentId: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id, attachmentId } = params;
        
        // Check if attachment exists and user has permission
        const attachment = await prisma.productAttachment.findUnique({
            where: { id: attachmentId },
            include: { 
                product: { 
                    include: { vendor: true } 
                } 
            }
        });

        if (!attachment) {
            return NextResponse.json({ error: 'Attachment not found' }, { status: 404 });
        }

        // Check if user is the vendor or admin
        if (attachment.product.vendor.userId !== session.user.id && session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Delete file from filesystem
        try {
            const filePath = join(process.cwd(), 'public', attachment.filePath);
            await unlink(filePath);
        } catch (error) {
            console.warn('Could not delete file from filesystem:', error);
        }

        // Delete attachment record from database
        await prisma.productAttachment.delete({
            where: { id: attachmentId },
        });

        return NextResponse.json({ message: 'Attachment deleted successfully' });
    } catch (error) {
        console.error('Error deleting attachment:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
