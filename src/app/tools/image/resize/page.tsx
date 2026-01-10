'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Cpu, Trash2, CheckCircle, Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileUploader } from '@/components/FileUploader';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ImageResizerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [width, setWidth] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const originalDimensions = useRef<{w: number, h: number} | null>(null);

  const handleFileAdded = async (newFiles: File[]) => {
    const imageFile = newFiles[0];
    if (!imageFile.type.startsWith('image/')) {
        toast.error('Please upload a valid image file.');
        return;
    }
    setFile(imageFile);
    
    // Get original dimensions
    const img = new Image();
    img.onload = () => {
        originalDimensions.current = { w: img.width, h: img.height };
        setWidth(img.width);
        setHeight(img.height);
        URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(imageFile);
    
    toast.success('Image loaded successfully.');
  };

  const handleRemoveFile = () => {
    setFile(null);
    setWidth('');
    setHeight('');
    originalDimensions.current = null;
  };
  
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = e.target.value === '' ? '' : parseInt(e.target.value);
    setWidth(newWidth);
    if (newWidth !== '' && originalDimensions.current) {
        const ratio = originalDimensions.current.h / originalDimensions.current.w;
        setHeight(Math.round(newWidth * ratio));
    }
  };
  
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = e.target.value === '' ? '' : parseInt(e.target.value);
    setHeight(newHeight);
    if (newHeight !== '' && originalDimensions.current) {
        const ratio = originalDimensions.current.w / originalDimensions.current.h;
        setWidth(Math.round(newHeight * ratio));
    }
  };

  const handleResize = async () => {
    if (!file || width === '' || height === '' || width === 0 || height === 0) {
      toast.error('Please upload an image and specify valid dimensions.');
      return;
    }

    setIsProcessing(true);
    toast.info('Resizing image...');

    try {
        const imageBitmap = await createImageBitmap(file);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
            throw new Error('Could not get canvas context');
        }

        ctx.drawImage(imageBitmap, 0, 0, width, height);
        
        const originalExtension = file.name.split('.').pop() || 'png';
        const mimeType = `image/${originalExtension === 'jpg' ? 'jpeg' : originalExtension}`;

        canvas.toBlob((blob) => {
            if (!blob) {
                toast.error('Failed to resize image.');
                setIsProcessing(false);
                return;
            }
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const newName = file.name.replace(`.${originalExtension}`, `_resized.${originalExtension}`);
            a.download = newName;
            a.click();
            URL.revokeObjectURL(url);

            toast.success(`Image resized successfully!`);
            setIsProcessing(false);

        }, mimeType, 0.95);

    } catch (error) {
      console.error(error);
      toast.error('An error occurred during resizing.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <Scissors className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Image <span className="text-primary neon-text">Resizer</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Change the dimensions of your images while maintaining aspect ratio.
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
                <FileUploader onFilesAdded={handleFileAdded} accept="image/jpeg,image/png,image/webp" maxSize={20 * 1024 * 1024} multiple={false} />
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-secondary rounded-lg border">
                      <CheckCircle className="h-6 w-6 text-success" />
                      <div className="flex-1 truncate">
                        <p className="font-semibold text-sm">{file.name}</p>
                        <p className="text-xs text-muted-foreground">Original: {originalDimensions.current?.w} x {originalDimensions.current?.h}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={handleRemoveFile}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="width">Width (px)</Label>
                            <Input id="width" type="number" value={width} onChange={handleWidthChange} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="height">Height (px)</Label>
                            <Input id="height" type="number" value={height} onChange={handleHeightChange} />
                        </div>
                    </div>

                    <Button onClick={handleResize} disabled={isProcessing || width === '' || height === ''} className="w-full" variant="gradient">
                        {isProcessing ? <Cpu className="mr-2 h-5 w-5 animate-spin" /> : <Download className="mr-2 h-5 w-5" />}
                        {isProcessing ? 'Resizing...' : 'Resize & Download'}
                    </Button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
