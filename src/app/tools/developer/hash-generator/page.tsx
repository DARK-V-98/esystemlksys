'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Fingerprint, Clipboard, Check } from 'lucide-react';
import { toast } from 'sonner';
import { MD5 } from 'crypto-js';
import SHA1 from 'crypto-js/sha1';
import SHA256 from 'crypto-js/sha256';
import SHA512 from 'crypto-js/sha512';

type HashAlgorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-512';

export default function HashGeneratorPage() {
  const [input, setInput] = useState('hello world');
  const [hashes, setHashes] = useState({
    'MD5': '',
    'SHA-1': '',
    'SHA-256': '',
    'SHA-512': '',
  });
  const [copiedValue, setCopiedValue] = useState('');

  const generateHashes = () => {
    if (!input) {
      toast.warning("Input cannot be empty.");
      setHashes({'MD5': '', 'SHA-1': '', 'SHA-256': '', 'SHA-512': ''});
      return;
    }
    setHashes({
      'MD5': MD5(input).toString(),
      'SHA-1': SHA1(input).toString(),
      'SHA-256': SHA256(input).toString(),
      'SHA-512': SHA512(input).toString(),
    });
    toast.success("Hashes generated!");
  };

  const handleCopy = (value: string, type: string) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopiedValue(type);
    toast.success(`Copied ${type} to clipboard!`);
    setTimeout(() => setCopiedValue(''), 2000);
  };
  
  // Generate initial hashes
  useState(() => {
    if (input) {
        generateHashes();
    }
  });


  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <Fingerprint className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Hash <span className="text-primary neon-text">Generator</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text.
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
            <div className="space-y-2">
                <Label htmlFor="input-text" className="text-lg">Input Text</Label>
                <Textarea
                    id="input-text"
                    placeholder="Enter text to hash..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="min-h-[150px] text-base font-mono"
                />
            </div>
            <Button onClick={generateHashes} variant="gradient" size="lg" className="w-full">
                Generate Hashes
            </Button>
        </div>

        <div className="space-y-4">
            {Object.entries(hashes).map(([algo, hash]) => (
                <div key={algo} className="space-y-1">
                    <Label htmlFor={algo} className="font-semibold">{algo}</Label>
                    <div className="relative">
                        <Input id={algo} value={hash} readOnly className="font-mono bg-muted h-12 pr-12"/>
                        <Button variant="ghost" size="icon" className="absolute top-1/2 right-2 -translate-y-1/2 h-8 w-8" onClick={() => handleCopy(hash, algo)}>
                           {copiedValue === algo ? <Check className="h-4 w-4 text-success" /> : <Clipboard className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
