'use client';
import { useState, ChangeEvent } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Gauge } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const units = {
  bytes: 1,
  kilobytes: 1024,
  megabytes: 1024 ** 2,
  gigabytes: 1024 ** 3,
  terabytes: 1024 ** 4,
};

type Unit = keyof typeof units;

export default function FileSizeConverterPage() {
  const [value, setValue] = useState<string>('1024');
  const [fromUnit, setFromUnit] = useState<Unit>('kilobytes');
  const [toUnit, setToUnit] = useState<Unit>('megabytes');

  const convertedValue = () => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return '';
    const bytes = numValue * units[fromUnit];
    const result = bytes / units[toUnit];
    return result.toLocaleString(undefined, { maximumFractionDigits: 4 });
  };

  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <Gauge className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              File Size <span className="text-primary neon-text">Converter</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Convert between bytes, KB, MB, GB, and TB.
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div className="space-y-2">
                    <Label htmlFor="from-value">From</Label>
                    <Input id="from-value" type="number" value={value} onChange={(e) => setValue(e.target.value)} className="h-12 text-lg"/>
                </div>
                <div className="space-y-2">
                     <Select value={fromUnit} onValueChange={(v) => setFromUnit(v as Unit)}>
                      <SelectTrigger className="h-12 text-lg">
                          <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                          {Object.keys(units).map(unit => (
                              <SelectItem key={unit} value={unit} className="capitalize">{unit}</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div className="space-y-2">
                    <Label htmlFor="to-value">To</Label>
                    <Input id="to-value" readOnly value={convertedValue()} className="h-12 text-lg font-bold bg-muted" />
                </div>
                <div className="space-y-2">
                     <Select value={toUnit} onValueChange={(v) => setToUnit(v as Unit)}>
                      <SelectTrigger className="h-12 text-lg">
                          <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                          {Object.keys(units).map(unit => (
                              <SelectItem key={unit} value={unit} className="capitalize">{unit}</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
