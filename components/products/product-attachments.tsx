'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X, FileText, Download } from 'lucide-react';
import { toast } from 'sonner';

interface Attachment {
    id: string;
    fileName: string;
    originalName: string;
    filePath: string;
    fileSize: number;
    mimeType: string;
    fileType: string;
    description?: string;
    createdAt: string;
}

interface ProductAttachmentsProps {
    productId: string;
    initialAttachments?: Attachment[];
}

export function ProductAttachments({ productId, initialAttachments = [] }: ProductAttachmentsProps) {
    const [attachments, setAttachments] = useState<Attachment[]>(initialAttachments);
    const [isUploading, setIsUploading] = useState(false);
    const [fileType, setFileType] = useState<string>('');

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!fileType) {
            toast.error('Please select a file type');
            return;
        }

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('fileType', fileType);
            formData.append('description', '');

            const response = await fetch(`/api/products/${productId}/attachments`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload file');
            }

            const newAttachment = await response.json();
            setAttachments(prev => [newAttachment, ...prev]);
            toast.success('File uploaded successfully');
            
            // Reset form
            event.target.value = '';
            setFileType('');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload file');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteAttachment = async (attachmentId: string) => {
        try {
            const response = await fetch(`/api/products/${productId}/attachments/${attachmentId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete attachment');
            }

            setAttachments(prev => prev.filter(att => att.id !== attachmentId));
            toast.success('Attachment deleted successfully');
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Failed to delete attachment');
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Product Attachments
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Upload Section */}
                <div className="space-y-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="space-y-2">
                        <Label htmlFor="fileType">File Type</Label>
                        <Select value={fileType} onValueChange={setFileType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select file type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PDF">PDF Document</SelectItem>
                                <SelectItem value="DOCUMENT">Word Document</SelectItem>
                                <SelectItem value="SPECIFICATION">Technical Specification</SelectItem>
                                <SelectItem value="MANUAL">User Manual</SelectItem>
                                <SelectItem value="CERTIFICATE">Certificate</SelectItem>
                                <SelectItem value="OTHER">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="file">Choose File</Label>
                        <Input
                            id="file"
                            type="file"
                            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                            onChange={handleFileUpload}
                            disabled={isUploading || !fileType}
                        />
                    </div>
                    
                    {isUploading && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Upload className="w-4 h-4 animate-spin" />
                            Uploading...
                        </div>
                    )}
                </div>

                {/* Attachments List */}
                {attachments.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="font-medium text-sm text-gray-700">Uploaded Files</h4>
                        {attachments.map((attachment) => (
                            <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-4 h-4 text-gray-600" />
                                    <div>
                                        <p className="text-sm font-medium">{attachment.originalName}</p>
                                        <p className="text-xs text-gray-500">
                                            {formatFileSize(attachment.fileSize)} • {attachment.fileType}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <a
                                        href={attachment.filePath}
                                        download={attachment.originalName}
                                        className="p-1 text-gray-600 hover:text-gray-800"
                                    >
                                        <Download className="w-4 h-4" />
                                    </a>
                                    <button
                                        onClick={() => handleDeleteAttachment(attachment.id)}
                                        className="p-1 text-red-600 hover:text-red-800"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {attachments.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>No attachments uploaded yet</p>
                        <p className="text-sm">Upload PDFs, documents, or specifications</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
