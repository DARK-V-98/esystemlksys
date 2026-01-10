'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Calendar, Clipboard, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function DateConverterPage() {
  const [date, setDate] = useState(new Date());
  const [unixTimestamp, setUnixTimestamp] = useState(Math.floor(date.getTime() / 1000));
  const [isoString, setIsoString] = useState(date.toISOString());
  const [copiedValue, setCopiedValue] = useState('');

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const newDate = new Date(e.target.value);
      if (!isNaN(newDate.getTime())) {
        setDate(newDate);
        setUnixTimestamp(Math.floor(newDate.getTime() / 1000));
        setIsoString(newDate.toISOString());
      }
    } catch (error) {
      toast.error("Invalid date format.");
    }
  };
  
  const handleUnixChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUnix = parseInt(e.target.value);
    if (!isNaN(newUnix)) {
        setUnixTimestamp(newUnix);
        const newDate = new Date(newUnix * 1000);
        setDate(newDate);
        setIsoString(newDate.toISOString());
    }
  };

  const handleIsoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIso = e.target.value;
    setIsoString(newIso);
    try {
      const newDate = new Date(newIso);
      if (!isNaN(newDate.getTime())) {
        setDate(newDate);
        setUnixTimestamp(Math.floor(newDate.getTime() / 1000));
      }
    } catch (error) {
       // Ignore invalid intermediate states
    }
  };

  const handleCopyToClipboard = (value: string | number, type: string) => {
    navigator.clipboard.writeText(String(value));
    setCopiedValue(type);
    toast.success(`Copied ${type} to clipboard!`);
    setTimeout(() => setCopiedValue(''), 2000);
  };
  
  const formatDateForInput = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <Calendar className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Date <span className="text-primary neon-text">Converter</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Convert between human-readable dates, UNIX timestamps, and ISO 8601.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
        <Link href="/tools" className="inline-flex items-center justify-center gap-2 rounded-xl h-12 px-5 text-sm font-bold transition-all duration-200 bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-primary">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Tools</span>
        </Link>
        
        <div className="bg-secondary/50 border rounded-lg p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="date-time">Human Readable Date</Label>
                    <Input id="date-time" type="datetime-local" value={formatDateForInput(date)} onChange={handleDateChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="date-string">Date String</Label>
                    <div className="relative">
                        <Input id="date-string" readOnly value={date.toString()} className="font-mono bg-muted" />
                        <Button variant="ghost" size="icon" className="absolute top-1/2 right-2 -translate-y-1/2 h-8 w-8" onClick={() => handleCopyToClipboard(date.toString(), 'date-string')}>
                            {copiedValue === 'date-string' ? <Check className="h-4 w-4 text-success" /> : <Clipboard className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="unix-timestamp">UNIX Timestamp (seconds)</Label>
                <div className="relative">
                    <Input id="unix-timestamp" type="number" value={unixTimestamp} onChange={handleUnixChange} className="font-mono" />
                     <Button variant="ghost" size="icon" className="absolute top-1/2 right-2 -translate-y-1/2 h-8 w-8" onClick={() => handleCopyToClipboard(unixTimestamp, 'unix')}>
                        {copiedValue === 'unix' ? <Check className="h-4 w-4 text-success" /> : <Clipboard className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="iso-string">ISO 8601 String</Label>
                <div className="relative">
                    <Input id="iso-string" value={isoString} onChange={handleIsoChange} className="font-mono" />
                     <Button variant="ghost" size="icon" className="absolute top-1/2 right-2 -translate-y-1/2 h-8 w-8" onClick={() => handleCopyToClipboard(isoString, 'iso')}>
                        {copiedValue === 'iso' ? <Check className="h-4 w-4 text-success" /> : <Clipboard className="h-4 w-4" />}
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
