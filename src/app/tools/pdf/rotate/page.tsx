'use client';
import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { PDFDocument, RotationTypes } from 'pdf-lib';
import { ArrowLeft, RotateCw, Download, Cpu, File, Trash2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileUploader } from '@/components/FileUploader';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function RotatePdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rotation, setRotation] = useState<string>('90');

  const handleFileAdded = async (newFiles: File[]) => {
    const newFile = newFiles[0];
    setFile(newFile);
    toast.success('PDF loaded successfully.');
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleRotate = async () => {
    if (!file) {
      toast.error('Please upload a PDF file first.');
      return;
    }

    setIsProcessing(true);
    toast.info('Rotating PDF...');

    try {
      const pdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      
      const rotationAngle = parseInt(rotation, 10);
      let rotationType: number;
      switch (rotationAngle) {
          case 90: rotationType = RotationTypes.Degrees90; break;
          case 180: rotationType = RotationTypes.Degrees180; break;
          case 270: rotationType = RotationTypes.Degrees270; break;
          default: toast.error('Invalid rotation angle'); return;
      }
      
      const pages = pdfDoc.getPages();
      pages.forEach(page => {
        const currentRotation = page.getRotation().angle;
        page.setRotation({ angle: (currentRotation + rotationAngle) % 360 });
      });

      const newPdfBytes = await pdfDoc.save();
      const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rotated_${file.name}`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success('PDF rotated and downloaded successfully!');
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while rotating the PDF.');
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
            <RotateCw className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Rotate <span className="text-primary neon-text">PDF</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Rotate all pages of a PDF file.
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

                    <div className="space-y-2">
                        <Label>Rotation Angle</Label>
                        <Select value={rotation} onValueChange={setRotation}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select rotation angle" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="90">90° clockwise</SelectItem>
                                <SelectItem value="180">180°</SelectItem>
                                <SelectItem value="270">270° clockwise (90° counter-clockwise)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button onClick={handleRotate} disabled={isProcessing} className="w-full" variant="gradient">
                        {isProcessing ? <Cpu className="mr-2 h-5 w-5 animate-spin" /> : <Download className="mr-2 h-5 w-5" />}
                        {isProcessing ? 'Rotating...' : 'Rotate PDF & Download'}
                    </Button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
