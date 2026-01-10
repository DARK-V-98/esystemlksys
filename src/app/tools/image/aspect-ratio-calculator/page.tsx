'use client';
import { useState, ChangeEvent } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Ratio } from 'lucide-react';

export default function AspectRatioCalculatorPage() {
  const [w1, setW1] = useState<number | string>(1920);
  const [h1, setH1] = useState<number | string>(1080);
  const [w2, setW2] = useState<number | string>('');
  const [h2, setH2] = useState<number | string>('');

  const handleW1Change = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setW1(val);
    if (val === '' || h1 === '') return;
    const numH1 = Number(h1);
    const numW1 = Number(val);
    if (numW1 > 0 && numH1 > 0) {
        if (w2 !== '') {
            const numW2 = Number(w2);
            setH2(Math.round((numW2 * numH1) / numW1));
        } else if (h2 !== '') {
            const numH2 = Number(h2);
            setW2(Math.round((numH2 * numW1) / numH1));
        }
    }
  };

  const handleH1Change = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setH1(val);
    if (val === '' || w1 === '') return;
    const numW1 = Number(w1);
    const numH1 = Number(val);
    if (numH1 > 0 && numW1 > 0) {
        if (w2 !== '') {
            const numW2 = Number(w2);
            setH2(Math.round((numW2 * numH1) / numW1));
        } else if (h2 !== '') {
            const numH2 = Number(h2);
            setW2(Math.round((numH2 * numW1) / numH1));
        }
    }
  };

  const handleW2Change = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setW2(val);
    if (val === '') { setH2(''); return; }
    const numW1 = Number(w1);
    const numH1 = Number(h1);
    if (numW1 > 0 && numH1 > 0) {
        setH2(Math.round((Number(val) * numH1) / numW1));
    }
  };

  const handleH2Change = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setH2(val);
    if (val === '') { setW2(''); return; }
    const numW1 = Number(w1);
    const numH1 = Number(h1);
    if (numH1 > 0 && numW1 > 0) {
        setW2(Math.round((Number(val) * numW1) / numH1));
    }
  };


  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <Ratio className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Aspect Ratio <span className="text-primary neon-text">Calculator</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Calculate dimensions for images and videos while maintaining aspect ratio.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
        <Link href="/tools" className="inline-flex items-center justify-center gap-2 rounded-xl h-12 px-5 text-sm font-bold transition-all duration-200 bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-primary">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Tools</span>
        </Link>
        
        <div className="bg-secondary/50 border rounded-lg p-6 space-y-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4 p-4 border rounded-lg">
                    <h3 className="font-semibold text-lg">Original Size</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="w1">Width</Label>
                            <Input id="w1" type="number" placeholder="W" value={w1} onChange={handleW1Change}/>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="h1">Height</Label>
                            <Input id="h1" type="number" placeholder="H" value={h1} onChange={handleH1Change}/>
                        </div>
                    </div>
                </div>
                 <div className="space-y-4 p-4 border rounded-lg">
                    <h3 className="font-semibold text-lg">New Size</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="w2">Width</Label>
                            <Input id="w2" type="number" placeholder="W" value={w2} onChange={handleW2Change}/>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="h2">Height</Label>
                            <Input id="h2" type="number" placeholder="H" value={h2} onChange={handleH2Change}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
