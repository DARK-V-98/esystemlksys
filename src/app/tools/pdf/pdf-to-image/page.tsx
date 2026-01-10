'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import { ArrowLeft, FileImage, Download, Cpu, CheckCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileUploader } from '@/components/FileUploader';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';

// Set worker path
if (typeof window !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

export default function PdfToImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileAdded = (newFiles: File[]) => {
    setFile(newFiles[0]);
    toast.success('PDF loaded successfully.');
  };

  const handleRemoveFile = () => {
    setFile(null);
    setProgress(0);
  };

  const handleConvert = async () => {
    if (!file) {
      toast.error('Please upload a PDF file first.');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    toast.info('Starting conversion...');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const zip = new JSZip();

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // High resolution
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          await page.render({ canvasContext: context, viewport: viewport }).promise;
          const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
          if (blob) {
            zip.file(`page_${i}.png`, blob);
          }
        }
        setProgress(Math.round((i / pdf.numPages) * 100));
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${file.name.replace('.pdf', '')}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success('Conversion successful! ZIP file downloaded.');

    } catch (error: any) {
      console.error(error);
      let errorMessage = 'An error occurred during conversion.';
      if (error.name === 'PasswordException') {
          errorMessage = 'The PDF is password protected. Please unlock it first.';
      }
      toast.error(errorMessage);
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
            <FileImage className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              PDF to <span className="text-primary neon-text">Image</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Convert each page of a PDF into a PNG image.
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
            {!file ? (
                <FileUploader onFilesAdded={handleFileAdded} accept="application/pdf" maxSize={50 * 1024 * 1024} multiple={false} />
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-secondary rounded-lg border">
                      <CheckCircle className="h-6 w-6 text-success" />
                      <div className="flex-1 truncate">
                        <p className="font-semibold text-sm">{file.name}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={handleRemoveFile}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {isProcessing && (
                      <div className="space-y-2">
                        <Label>Conversion Progress</Label>
                        <Progress value={progress} className="w-full" />
                        <p className="text-sm text-center text-muted-foreground">{progress}% complete</p>
                      </div>
                    )}

                    <Button onClick={handleConvert} disabled={isProcessing} className="w-full" variant="gradient">
                        {isProcessing ? <Cpu className="mr-2 h-5 w-5 animate-spin" /> : <Download className="mr-2 h-5 w-5" />}
                        {isProcessing ? 'Converting...' : 'Convert to Images & Download ZIP'}
                    </Button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
