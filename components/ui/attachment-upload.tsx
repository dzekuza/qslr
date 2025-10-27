"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, X, Download } from "lucide-react";

interface Attachment {
  id?: string;
  fileName: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  fileType: string;
  description?: string;
}

interface AttachmentUploadProps {
  attachments: Attachment[];
  onAttachmentsChange: (attachments: Attachment[]) => void;
  productId?: string;
  maxFiles?: number;
}

export function AttachmentUpload({
  attachments,
  onAttachmentsChange,
  productId,
  maxFiles = 5,
}: AttachmentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (attachments.length + files.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setIsUploading(true);

    try {
      for (const file of Array.from(files)) {
        // Validate file type
        const allowedTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'image/jpeg',
          'image/png',
          'image/gif',
          'text/plain',
        ];

        if (!allowedTypes.includes(file.type)) {
          alert(`File ${file.name} has an invalid type. Allowed types: PDF, DOC, DOCX, JPG, PNG, GIF, TXT`);
          continue;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert(`File ${file.name} is too large. Maximum size is 10MB`);
          continue;
        }

        // Create a temporary attachment object for preview
        const tempAttachment: Attachment = {
          fileName: file.name,
          originalName: file.name,
          filePath: URL.createObjectURL(file),
          fileSize: file.size,
          mimeType: file.type,
          fileType: getFileTypeFromMime(file.type),
          description: "",
        };

        onAttachmentsChange([...attachments, tempAttachment]);
      }
    } catch (error) {
      console.error("Error handling file selection:", error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const getFileTypeFromMime = (mimeType: string): string => {
    if (mimeType.includes('pdf')) return 'PDF';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'DOCUMENT';
    if (mimeType.includes('image')) return 'IMAGE';
    if (mimeType.includes('text')) return 'SPECIFICATION';
    return 'MANUAL';
  };

  const removeAttachment = (index: number) => {
    const newAttachments = attachments.filter((_, i) => i !== index);
    onAttachmentsChange(newAttachments);
  };

  const updateAttachmentDescription = (index: number, description: string) => {
    const newAttachments = [...attachments];
    newAttachments[index].description = description;
    onAttachmentsChange(newAttachments);
  };

  const updateAttachmentType = (index: number, fileType: string) => {
    const newAttachments = [...attachments];
    newAttachments[index].fileType = fileType;
    onAttachmentsChange(newAttachments);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Product Attachments</Label>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || attachments.length >= maxFiles}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {isUploading ? "Uploading..." : "Upload Files"}
          </Button>
          <span className="text-sm text-gray-500">
            {attachments.length}/{maxFiles} files
          </span>
        </div>
        <p className="text-xs text-gray-500">
          Supported formats: PDF, DOC, DOCX, JPG, PNG, GIF, TXT (max 10MB each)
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt"
        onChange={handleFileSelect}
        className="hidden"
      />

      {attachments.length > 0 && (
        <div className="space-y-3">
          {attachments.map((attachment, index) => (
            <Card key={index} className="p-4">
              <CardContent className="p-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <FileText className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div className="flex-1 space-y-3">
                      <div>
                        <p className="font-medium text-sm">{attachment.originalName}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(attachment.fileSize)}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <Label htmlFor={`fileType-${index}`} className="text-xs">
                            File Type
                          </Label>
                          <Select
                            value={attachment.fileType}
                            onValueChange={(value) => updateAttachmentType(index, value)}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PDF">PDF Document</SelectItem>
                              <SelectItem value="DOCUMENT">Word Document</SelectItem>
                              <SelectItem value="IMAGE">Image</SelectItem>
                              <SelectItem value="SPECIFICATION">Specification</SelectItem>
                              <SelectItem value="MANUAL">Manual</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor={`description-${index}`} className="text-xs">
                            Description (optional)
                          </Label>
                          <Textarea
                            id={`description-${index}`}
                            value={attachment.description || ""}
                            onChange={(e) => updateAttachmentDescription(index, e.target.value)}
                            placeholder="Brief description of this file..."
                            className="h-16 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttachment(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
