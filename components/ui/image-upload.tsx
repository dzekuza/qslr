"use client";

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface ImageUploadProps {
    images: string[];
    onImagesChange: (images: string[]) => void;
    maxImages?: number;
    className?: string;
}

export function ImageUpload({ 
    images, 
    onImagesChange, 
    maxImages = 10, 
    className = "" 
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (images.length + acceptedFiles.length > maxImages) {
            alert(`Maximum ${maxImages} images allowed`);
            return;
        }

        setUploading(true);
        
        try {
            const uploadPromises = acceptedFiles.map(async (file) => {
                // For now, we'll create a data URL for preview
                // In production, you'd upload to a cloud service like AWS S3, Cloudinary, etc.
                return new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.readAsDataURL(file);
                });
            });

            const newImageUrls = await Promise.all(uploadPromises);
            onImagesChange([...images, ...newImageUrls]);
        } catch (error) {
            console.error('Error uploading images:', error);
        } finally {
            setUploading(false);
        }
    }, [images, onImagesChange, maxImages]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
        },
        multiple: true,
        disabled: uploading || images.length >= maxImages
    });

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        onImagesChange(newImages);
    };

    const setThumbnail = (index: number) => {
        // Move the selected image to the first position (thumbnail)
        const newImages = [...images];
        const [selectedImage] = newImages.splice(index, 1);
        newImages.unshift(selectedImage);
        onImagesChange(newImages);
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Upload Area */}
            <div
                {...getRootProps()}
                className={`
                    border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                    ${isDragActive 
                        ? 'border-primary bg-primary/5' 
                        : 'border-muted-foreground/25 hover:border-primary/50'
                    }
                    ${uploading || images.length >= maxImages 
                        ? 'opacity-50 cursor-not-allowed' 
                        : ''
                    }
                `}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-4">
                    {uploading ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    ) : (
                        <Upload className="h-8 w-8 text-muted-foreground" />
                    )}
                    <div>
                        <p className="text-sm font-medium">
                            {isDragActive 
                                ? 'Drop images here...' 
                                : uploading 
                                    ? 'Uploading...' 
                                    : 'Drag & drop images here, or click to select'
                            }
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            PNG, JPG, GIF, WebP up to 10MB each
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {images.length}/{maxImages} images
                        </p>
                    </div>
                </div>
            </div>

            {/* Image Gallery */}
            {images.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-sm font-medium">Product Images</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((image, index) => (
                            <div key={index} className="relative group">
                                <div className="aspect-square rounded-lg overflow-hidden border-2 border-muted">
                                    <Image
                                        src={image}
                                        alt={`Product image ${index + 1}`}
                                        width={200}
                                        height={200}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                
                                {/* Overlay with actions */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                                    {index === 0 && (
                                        <div className="absolute top-2 left-2">
                                            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                                                Thumbnail
                                            </span>
                                        </div>
                                    )}
                                    
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => setThumbnail(index)}
                                        className="h-8 w-8 p-0"
                                        disabled={index === 0}
                                    >
                                        <ImageIcon className="h-4 w-4" />
                                    </Button>
                                    
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => removeImage(index)}
                                        className="h-8 w-8 p-0"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                        First image will be used as thumbnail. Drag to reorder or use the buttons to set thumbnail.
                    </p>
                </div>
            )}
        </div>
    );
}

