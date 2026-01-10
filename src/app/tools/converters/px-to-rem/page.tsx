'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, BringToFront, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function PxToRemConverterPage() {
  const [baseSize, setBaseSize] = useState(16);
  const [pixels, setPixels] = useState('16');
  const [rems, setRems] = useState('1');

  const handleBaseSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBase = parseInt(e.target.value) || 16;
    setBaseSize(newBase);
    // Recalculate rems based on new base size
    const pxValue = parseFloat(pixels);
    if (!isNaN(pxValue)) {
      setRems((pxValue / newBase).toString());
    }
  };
  
  const handlePixelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pxValue = e.target.value;
    setPixels(pxValue);
    const numPx = parseFloat(pxValue);
    if (!isNaN(numPx)) {
        setRems((numPx / baseSize).toString());
    } else if (pxValue === '') {
        setRems('');
    }
  };

  const handleRemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const remValue = e.target.value;
    setRems(remValue);
    const numRem = parseFloat(remValue);
    if (!isNaN(numRem)) {
        setPixels((numRem * baseSize).toString());
    } else if (remValue === '') {
        setPixels('');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <BringToFront className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              PX to REM <span className="text-primary neon-text">Converter</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Easily convert pixel values to REM units.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
        <Link href="/tools" className="inline-flex items-center justify-center gap-2 rounded-xl h-12 px-5 text-sm font-bold transition-all duration-200 bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-primary">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Tools</span>
        </Link>
        
        <div className="bg-secondary/50 border rounded-lg p-6 space-y-6 max-w-2xl mx-auto">
            <div className="space-y-2 text-center">
                <Label htmlFor="base-size">Base Font Size (in pixels)</Label>
                <Input 
                    id="base-size"
                    type="number"
                    value={baseSize}
                    onChange={handleBaseSizeChange}
                    className="w-32 mx-auto text-center font-bold text-lg"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div className="space-y-2">
                    <Label htmlFor="pixels" className="text-lg">Pixels (px)</Label>
                    <Input
                        id="pixels"
                        value={pixels}
                        onChange={handlePixelChange}
                        className="h-16 text-3xl font-bold font-mono"
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="rems" className="text-lg">REM</Label>
                    <Input
                        id="rems"
                        value={rems}
                        onChange={handleRemChange}
                        className="h-16 text-3xl font-bold font-mono"
                    />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
