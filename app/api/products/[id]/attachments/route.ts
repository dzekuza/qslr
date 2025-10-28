import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { uploadFile, getPublicUrl } from '@/lib/supabase-storage';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;
        
        // Check if product exists and user has permission
        const product = await prisma.product.findUnique({
            where: { id },
            include: { vendor: true }
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // Check if user is the vendor or admin
        if (product.vendor.userId !== session.user.id && session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const fileType = formData.get('fileType') as string;
        const description = formData.get('description') as string;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: 'File too large' }, { status: 400 });
        }

        // Generate unique filename
        const timestamp = Date.now();
        const fileExtension = file.name.split('.').pop();
        const fileName = `${timestamp}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
        const filePath = `${id}/${fileName}`;

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Supabase Storage
        const uploadResult = await uploadFile(
            'product-attachments',
            filePath,
            buffer,
            {
                contentType: file.type,
                upsert: false
            }
        );

        if (uploadResult.error) {
            console.error('Error uploading to Supabase Storage:', uploadResult.error);
            return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
        }

        // Get public URL
        const { data: { publicUrl } } = getPublicUrl('product-attachments', filePath);

        // Save attachment record to database
        const attachment = await prisma.productAttachment.create({
            data: {
                productId: id,
                fileName: fileName,
                originalName: file.name,
                filePath: publicUrl,
                fileSize: file.size,
                mimeType: file.type,
                fileType: fileType as any,
                description: description || null,
                uploadedBy: session.user.id,
            },
        });

        return NextResponse.json(attachment);
    } catch (error) {
        console.error('Error uploading attachment:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        const attachments = await prisma.productAttachment.findMany({
            where: { productId: id },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(attachments);
    } catch (error) {
        console.error('Error fetching attachments:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
