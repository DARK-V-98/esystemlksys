'use client';
import { UploadCloud, File as FileIcon } from 'lucide-react';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface FileUploaderProps {
  onFilesAdded: (files: File[]) => void;
  accept: string;
  maxSize: number; // in bytes
  multiple?: boolean;
}

export function FileUploader({ onFilesAdded, accept, maxSize, multiple = true }: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    if (fileRejections.length > 0) {
      fileRejections.forEach(({ file, errors }: any) => {
        errors.forEach((error: any) => {
          if (error.code === 'file-too-large') {
            toast.error(`File is too large: ${file.name}`);
          }
          if (error.code === 'file-invalid-type') {
            toast.error(`Invalid file type: ${file.name}`);
          }
        });
      });
      return;
    }
    onFilesAdded(acceptedFiles);
  }, [onFilesAdded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { [accept]: accept.split(',').map(ext => ext.trim()) },
    maxSize,
    multiple,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors',
        'border-border hover:border-primary/50 hover:bg-secondary',
        isDragActive && 'border-primary bg-primary/10'
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4 text-muted-foreground">
        <UploadCloud className={cn("h-12 w-12", isDragActive && 'text-primary animate-bounce')} />
        {isDragActive ? (
          <p className="font-semibold text-primary">Drop the files here ...</p>
        ) : (
          <div>
            <p className="font-semibold text-foreground">Drag & drop files here, or click to select</p>
            <p className="text-sm">Accepted files: {accept}. Max size: {maxSize / 1024 / 1024}MB</p>
          </div>
        )}
      </div>
    </div>
  );
}
