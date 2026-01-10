'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Sparkles, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';

export default function RandomNumberGeneratorPage() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [randomNumber, setRandomNumber] = useState<number | null>(null);

  const generateNumber = () => {
    if (min >= max) {
        toast.error("Minimum value must be less than the maximum value.");
        return;
    }
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    setRandomNumber(num);
    toast.success('New random number generated!');
  };

  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <Sparkles className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Random Number <span className="text-primary neon-text">Generator</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Generate a random number within a specified range.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6 max-w-3xl mx-auto">
        <Link href="/tools" className="inline-flex items-center justify-center gap-2 rounded-xl h-12 px-5 text-sm font-bold transition-all duration-200 bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-primary">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Tools</span>
        </Link>
        
        <div className="bg-secondary/50 border rounded-lg p-6 space-y-6 text-center">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="min-val">Minimum Value</Label>
                    <Input id="min-val" type="number" value={min} onChange={e => setMin(parseInt(e.target.value))} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="max-val">Maximum Value</Label>
                    <Input id="max-val" type="number" value={max} onChange={e => setMax(parseInt(e.target.value))} />
                </div>
            </div>
            
            <Button onClick={generateNumber} variant="gradient" className="w-full" size="lg">
                <RefreshCw className="mr-2 h-5 w-5"/>
                Generate Number
            </Button>
            
            {randomNumber !== null && (
                <div className="pt-4">
                    <h2 className="text-lg font-semibold text-muted-foreground">Your random number is:</h2>
                    <p className="text-7xl font-black text-primary neon-text">{randomNumber}</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
