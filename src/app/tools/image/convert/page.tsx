'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Cpu, Trash2, CheckCircle, FlipHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileUploader } from '@/components/FileUploader';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

type ImageFormat = 'image/png' | 'image/jpeg' | 'image/webp';

export default function ImageConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputFormat, setOutputFormat] = useState<ImageFormat>('image/png');

  const handleFileAdded = (newFiles: File[]) => {
    const imageFile = newFiles[0];
    if (!imageFile.type.startsWith('image/')) {
        toast.error('Please upload a valid image file.');
        return;
    }
    setFile(imageFile);
    toast.success('Image loaded successfully.');
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleConvert = async () => {
    if (!file) {
      toast.error('Please upload an image file first.');
      return;
    }

    setIsProcessing(true);
    toast.info('Converting image...');

    try {
        const imageBitmap = await createImageBitmap(file);
        const canvas = document.createElement('canvas');
        canvas.width = imageBitmap.width;
        canvas.height = imageBitmap.height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
            throw new Error('Could not get canvas context');
        }

        ctx.drawImage(imageBitmap, 0, 0);

        canvas.toBlob((blob) => {
            if (!blob) {
                toast.error('Failed to convert image.');
                setIsProcessing(false);
                return;
            }
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const newExtension = outputFormat.split('/')[1];
            const originalName = file.name.substring(0, file.name.lastIndexOf('.'));
            a.download = `${originalName}.${newExtension}`;
            a.click();
            URL.revokeObjectURL(url);

            toast.success(`Image converted to ${newExtension.toUpperCase()} successfully!`);
            setIsProcessing(false);

        }, outputFormat, 0.95);

    } catch (error) {
      console.error(error);
      toast.error('An error occurred during conversion.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <FlipHorizontal className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Image <span className="text-primary neon-text">Converter</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Convert images to PNG, JPG, or WebP formats.
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
                <FileUploader onFilesAdded={handleFileAdded} accept="image/*" maxSize={20 * 1024 * 1024} multiple={false} />
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-secondary rounded-lg border">
                      <CheckCircle className="h-6 w-6 text-success" />
                      <div className="flex-1 truncate">
                        <p className="font-semibold text-sm">{file.name}</p>
                         <p className="text-xs text-muted-foreground">Type: {file.type}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={handleRemoveFile}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="format">Convert to</Label>
                       <Select value={outputFormat} onValueChange={(v) => setOutputFormat(v as ImageFormat)}>
                          <SelectTrigger id="format">
                              <SelectValue placeholder="Select output format" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="image/png">PNG</SelectItem>
                              <SelectItem value="image/jpeg">JPG</SelectItem>
                              <SelectItem value="image/webp">WebP</SelectItem>
                          </SelectContent>
                      </Select>
                    </div>

                    <Button onClick={handleConvert} disabled={isProcessing} className="w-full" variant="gradient">
                        {isProcessing ? <Cpu className="mr-2 h-5 w-5 animate-spin" /> : <Download className="mr-2 h-5 w-5" />}
                        {isProcessing ? 'Converting...' : 'Convert & Download'}
                    </Button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
