'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Palette, Clipboard, Check } from 'lucide-react';
import { toast } from 'sonner';

// --- Conversion Functions ---
function hexToRgb(hex: string) {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }
  return { r, g, b };
}

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
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number) {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

export default function ColorConverterPage() {
  const [hex, setHex] = useState('#E60023');
  const [rgb, setRgb] = useState({ r: 230, g: 0, b: 35 });
  const [hsl, setHsl] = useState({ h: 352, s: 100, l: 45 });
  const [copiedValue, setCopiedValue] = useState('');

  const handleCopy = (value: string, type: string) => {
    navigator.clipboard.writeText(value);
    setCopiedValue(type);
    toast.success(`Copied ${type} to clipboard!`);
    setTimeout(() => setCopiedValue(''), 2000);
  };
  
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newHex = e.target.value;
    if (!newHex.startsWith('#')) {
        newHex = '#' + newHex;
    }
    setHex(newHex);
    if (/^#([0-9A-F]{3}){1,2}$/i.test(newHex)) {
      const newRgb = hexToRgb(newHex);
      setRgb(newRgb);
      setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
    }
  };
  
  const handleRgbChange = (part: 'r'|'g'|'b', value: string) => {
    const numValue = Math.max(0, Math.min(255, parseInt(value) || 0));
    const newRgb = { ...rgb, [part]: numValue };
    setRgb(newRgb);
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
  };

  const handleHslChange = (part: 'h'|'s'|'l', value: string) => {
    const max = part === 'h' ? 360 : 100;
    const numValue = Math.max(0, Math.min(max, parseInt(value) || 0));
    const newHsl = { ...hsl, [part]: numValue };
    setHsl(newHsl);
    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    setRgb(newRgb);
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };


  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <Palette className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Color <span className="text-primary neon-text">Converter</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Convert colors between HEX, RGB, and HSL formats.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
        <Link href="/tools" className="inline-flex items-center justify-center gap-2 rounded-xl h-12 px-5 text-sm font-bold transition-all duration-200 bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-primary">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Tools</span>
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="bg-secondary/50 border rounded-lg p-6 space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="hex">HEX</Label>
                    <div className="relative">
                        <Input id="hex" value={hex} onChange={handleHexChange} className="font-mono"/>
                        <Button variant="ghost" size="icon" className="absolute top-1/2 right-2 -translate-y-1/2 h-8 w-8" onClick={() => handleCopy(hex, 'hex')}>
                           {copiedValue === 'hex' ? <Check className="h-4 w-4 text-success" /> : <Clipboard className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label>RGB</Label>
                    <div className="grid grid-cols-3 gap-2">
                        <Input type="number" value={rgb.r} onChange={(e) => handleRgbChange('r', e.target.value)} />
                        <Input type="number" value={rgb.g} onChange={(e) => handleRgbChange('g', e.target.value)} />
                        <Input type="number" value={rgb.b} onChange={(e) => handleRgbChange('b', e.target.value)} />
                    </div>
                     <div className="relative">
                        <Input readOnly value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} className="font-mono bg-muted"/>
                        <Button variant="ghost" size="icon" className="absolute top-1/2 right-2 -translate-y-1/2 h-8 w-8" onClick={() => handleCopy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'rgb')}>
                            {copiedValue === 'rgb' ? <Check className="h-4 w-4 text-success" /> : <Clipboard className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label>HSL</Label>
                    <div className="grid grid-cols-3 gap-2">
                        <Input type="number" value={hsl.h} onChange={(e) => handleHslChange('h', e.target.value)} />
                        <Input type="number" value={hsl.s} onChange={(e) => handleHslChange('s', e.target.value)} />
                        <Input type="number" value={hsl.l} onChange={(e) => handleHslChange('l', e.target.value)} />
                    </div>
                     <div className="relative">
                        <Input readOnly value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} className="font-mono bg-muted"/>
                        <Button variant="ghost" size="icon" className="absolute top-1/2 right-2 -translate-y-1/2 h-8 w-8" onClick={() => handleCopy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'hsl')}>
                            {copiedValue === 'hsl' ? <Check className="h-4 w-4 text-success" /> : <Clipboard className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
            </div>
            <Card>
                <CardContent className="p-0">
                    <div className="w-full h-80 rounded-lg" style={{ backgroundColor: hex }}></div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
