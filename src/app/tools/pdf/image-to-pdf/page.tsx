'use client';
import { useState } from 'react';
import Link from 'next/link';
import { PDFDocument } from 'pdf-lib';
import { ArrowLeft, FileInput, Download, Cpu, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileUploader } from '@/components/FileUploader';
import { FileList } from '@/components/File-list';
import { toast } from 'sonner';

export default function ImageToPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesAdded = (newFiles: File[]) => {
    const imageFiles = newFiles.filter(file => file.type.startsWith('image/'));
    if(imageFiles.length !== newFiles.length) {
        toast.warning('Some files were not images and have been ignored.');
    }
    setFiles(prev => [...prev, ...imageFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      toast.error('Please upload at least one image file.');
      return;
    }

    setIsProcessing(true);
    toast.info('Converting images to PDF...');

    try {
      const pdfDoc = await PDFDocument.create();

      for (const file of files) {
        const imageBytes = await file.arrayBuffer();
        let image;
        if (file.type === 'image/png') {
            image = await pdfDoc.embedPng(imageBytes);
        } else if (file.type === 'image/jpeg') {
            image = await pdfDoc.embedJpg(imageBytes);
        } else {
            toast.warning(`Skipping unsupported image type: ${file.name}`);
            continue;
        }

        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'converted.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Images converted to PDF successfully!');
    } catch (error) {
      console.error(error);
      toast.error('An error occurred during conversion.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <FileInput className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Image to <span className="text-primary neon-text">PDF</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Convert JPG, PNG files to a single PDF document.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
        <Link href="/tools" className="inline-flex items-center justify-center gap-2 rounded-xl h-12 px-5 text-sm font-bold transition-all duration-200 bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-primary">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Tools</span>
        </Link>
        
        <div className="bg-secondary/50 border rounded-lg p-6 space-y-6">
            <FileUploader onFilesAdded={handleFilesAdded} accept="image/png, image/jpeg" maxSize={20 * 1024 * 1024} multiple={true} />
            
            {files.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Files to Convert</h3>
                    <FileList 
                        files={files} 
                        onRemove={handleRemoveFile} 
                        onDragStart={() => {}}
                        onDragEnter={() => {}}
                        onDragEnd={() => {}}
                    />
                    <Button onClick={handleConvert} disabled={isProcessing || files.length === 0} className="w-full" variant="gradient">
                        {isProcessing ? <Cpu className="mr-2 h-5 w-5 animate-spin" /> : <Download className="mr-2 h-5 w-5" />}
                        {isProcessing ? 'Converting...' : `Convert ${files.length} Images & Download`}
                    </Button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
