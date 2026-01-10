'use client';
import { useState, useRef, MouseEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, Droplet, Check, Clipboard, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileUploader } from '@/components/FileUploader';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';

function rgbToHex(r: number, g: number, b: number) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}


export default function ImageColorPickerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [pickedColor, setPickedColor] = useState<{hex: string, rgb: string, hsl: string} | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copiedValue, setCopiedValue] = useState('');

  const handleFileAdded = (newFiles: File[]) => {
    const imageFile = newFiles[0];
    if (!imageFile.type.startsWith('image/')) {
        toast.error('Please upload a valid image file.');
        return;
    }
    setFile(imageFile);
    
    const url = URL.createObjectURL(imageFile);
    setImageUrl(url);

    const img = new Image();
    img.onload = () => {
        const canvas = canvasRef.current;
        if(canvas) {
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0);
        }
    }
    img.src = url;

    toast.success('Image loaded. Click on it to pick a color.');
  };

  const handleCanvasClick = (e: MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = Math.floor(e.clientX - rect.left);
      const y = Math.floor(e.clientY - rect.top);
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const r = pixel[0];
      const g = pixel[1];
      const b = pixel[2];

      setPickedColor({
          hex: rgbToHex(r, g, b),
          rgb: `rgb(${r}, ${g}, ${b})`,
          hsl: rgbToHsl(r, g, b)
      });
  }
  
  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedValue(value);
    toast.success(`Copied ${value} to clipboard!`);
    setTimeout(() => setCopiedValue(''), 2000);
  };


  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <Droplet className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Image Color <span className="text-primary neon-text">Picker</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Upload an image and pick colors to get their values.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
        <Link href="/tools" className="inline-flex items-center justify-center gap-2 rounded-xl h-12 px-5 text-sm font-bold transition-all duration-200 bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-primary">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Tools</span>
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-secondary/50 border rounded-lg p-6 flex items-center justify-center">
                {!imageUrl ? (
                    <FileUploader onFilesAdded={handleFileAdded} accept="image/*" maxSize={10 * 1024 * 1024} multiple={false} />
                ) : (
                    <canvas ref={canvasRef} onClick={handleCanvasClick} className="max-w-full max-h-[60vh] object-contain cursor-crosshair rounded-md shadow-lg" />
                )}
            </div>
            <div className="md:col-span-1 space-y-4">
                <Card>
                    <div className="p-6 text-center">
                        <div className="w-full h-24 rounded-md border mb-4" style={{backgroundColor: pickedColor?.hex || 'transparent'}}></div>
                        <h3 className="text-lg font-bold">{pickedColor?.hex || 'Pick a color'}</h3>
                        <p className="text-sm text-muted-foreground">Click on the image</p>
                    </div>
                </Card>
                {pickedColor && (
                     <Card className="p-4 space-y-3">
                        {Object.entries(pickedColor).map(([key, value]) => (
                             <div key={key} className="relative">
                                <p className="text-xs font-semibold uppercase text-muted-foreground">{key}</p>
                                <div className="font-mono bg-muted rounded-md px-3 py-2 text-sm pr-10">{value}</div>
                                <Button variant="ghost" size="icon" className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-8 text-muted-foreground" onClick={() => handleCopy(value)}>
                                    {copiedValue === value ? <Check className="h-4 w-4 text-success" /> : <Clipboard className="h-4 w-4" />}
                                </Button>
                            </div>
                        ))}
                    </Card>
                )}
                 {imageUrl && (
                    <Button variant="outline" className="w-full" onClick={() => { setFile(null); setImageUrl(null); setPickedColor(null) }}>
                        <Upload className="mr-2 h-4 w-4"/>
                        Upload Another Image
                    </Button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
