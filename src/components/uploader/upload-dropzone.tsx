'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';

interface UploadDropzoneProps {
  onUploadComplete: (file: File) => void;
  className?: string;
}

export function UploadDropzone({ onUploadComplete, className }: UploadDropzoneProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    setIsUploading(true);
    setError(null);

    try {
      onUploadComplete(file);
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1,
    disabled: isUploading
  });

  return (
    <div 
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
        isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25',
        isUploading && 'opacity-70 cursor-not-allowed',
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-4">
        {isUploading ? (
          <>
            <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Uploading file...</p>
          </>
        ) : (
          <>
            <div className="rounded-full bg-primary/10 p-3">
              <Icons.upload className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium">
                {isDragActive ? 'Drop the file here' : 'Drag and drop your file here'}
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse (CSV, XLS, XLSX)
              </p>
            </div>
            <Button type="button" variant="outline" size="sm" className="mt-2">
              Select File
            </Button>
          </>
        )}
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    </div>
  );
}
