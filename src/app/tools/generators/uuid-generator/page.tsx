'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Sparkles, RefreshCw, Clipboard, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function UuidGeneratorPage() {
  const [uuid, setUuid] = useState('');
  const [copied, setCopied] = useState(false);

  const generateUuid = () => {
    const newUuid = crypto.randomUUID();
    setUuid(newUuid);
    setCopied(false);
    toast.success('New UUID generated!');
  };
  
  useEffect(() => {
    generateUuid();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(uuid);
    setCopied(true);
    toast.success("UUID copied to clipboard!");
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
              UUID <span className="text-primary neon-text">Generator</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Generate universally unique identifiers (UUID v4).
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6 max-w-3xl mx-auto">
        <Link href="/tools" className="inline-flex items-center justify-center gap-2 rounded-xl h-12 px-5 text-sm font-bold transition-all duration-200 bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-primary">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Tools</span>
        </Link>
        
        <div className="bg-secondary/50 border rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-center">Your Generated UUID</h2>
            <div className="relative">
                 <Input
                    readOnly
                    value={uuid}
                    className="h-16 text-xl font-mono text-center pr-12"
                />
                 <Button variant="ghost" size="icon" className="absolute top-1/2 right-2 -translate-y-1/2 h-8 w-8" onClick={handleCopy}>
                    {copied ? <Check className="h-5 w-5 text-success"/> : <Clipboard className="h-5 w-5"/>}
                </Button>
            </div>
            <Button onClick={generateUuid} variant="gradient" className="w-full" size="lg">
                <RefreshCw className="mr-2 h-5 w-5"/>
                Generate New UUID
            </Button>
        </div>
      </div>
    </div>
  );
}
