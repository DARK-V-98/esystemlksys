'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Palette, RefreshCw, Clipboard, Check, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

interface ColorStop {
  id: number;
  color: string;
  position: number;
}

export default function CssGradientGeneratorPage() {
  const [colors, setColors] = useState<ColorStop[]>([
    { id: 1, color: '#E60023', position: 0 },
    { id: 2, color: '#007BFF', position: 100 },
  ]);
  const [angle, setAngle] = useState(90);
  const [copied, setCopied] = useState(false);
  
  const gradient = `linear-gradient(${angle}deg, ${colors.map(c => `${c.color} ${c.position}%`).join(', ')})`;

  const handleColorChange = (id: number, newColor: string) => {
    setColors(colors.map(c => c.id === id ? { ...c, color: newColor } : c));
  };
  
  const handlePositionChange = (id: number, newPosition: number) => {
    setColors(colors.map(c => c.id === id ? { ...c, position: newPosition } : c));
  };

  const addColor = () => {
    const newColor: ColorStop = {
      id: Date.now(),
      color: '#ffffff',
      position: 50,
    };
    setColors([...colors, newColor].sort((a,b) => a.position - b.position));
  };

  const removeColor = (id: number) => {
    if (colors.length > 2) {
      setColors(colors.filter(c => c.id !== id));
    } else {
      toast.error("You must have at least two colors.");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`background: ${gradient};`);
    setCopied(true);
    toast.success("CSS Gradient copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
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
              CSS Gradient <span className="text-primary neon-text">Generator</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Visually create linear gradients and copy the CSS.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
        <Link href="/tools" className="inline-flex items-center justify-center gap-2 rounded-xl h-12 px-5 text-sm font-bold transition-all duration-200 bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-primary">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Tools</span>
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-secondary/50 border rounded-lg p-6 space-y-6">
            <div className="space-y-2">
                <Label htmlFor="angle">Angle ({angle}°)</Label>
                <Slider id="angle" value={[angle]} onValueChange={(v) => setAngle(v[0])} max={360} step={1} />
            </div>
            <div className="space-y-4">
              <Label>Colors</Label>
              {colors.map(c => (
                <div key={c.id} className="grid grid-cols-[auto_1fr_auto] gap-3 items-center">
                  <Input type="color" value={c.color} onChange={e => handleColorChange(c.id, e.target.value)} className="h-10 w-12 p-1" />
                  <Slider value={[c.position]} onValueChange={v => handlePositionChange(c.id, v[0])} max={100} step={1} />
                  <Button variant="ghost" size="icon" onClick={() => removeColor(c.id)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                </div>
              ))}
              <Button onClick={addColor} variant="outline" className="w-full"><Plus className="mr-2 h-4 w-4"/> Add Color</Button>
            </div>
             <div className="space-y-2">
                <Label>Generated CSS</Label>
                <div className="relative">
                    <Input readOnly value={`background: ${gradient};`} className="font-mono bg-muted pr-12"/>
                    <Button variant="ghost" size="icon" className="absolute top-1/2 right-2 -translate-y-1/2 h-8 w-8" onClick={handleCopy}>
                        {copied ? <Check className="h-4 w-4 text-success" /> : <Clipboard className="h-4 w-4" />}
                    </Button>
                </div>
            </div>
          </div>
          <div className="rounded-lg h-96" style={{ background: gradient }}></div>
        </div>
      </div>
    </div>
  );
}
