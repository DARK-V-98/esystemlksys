'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Binary, RefreshCw, Clipboard, Check, ArrowRightLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function Base64EncoderPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    try {
      if (mode === 'encode') {
        setOutput(btoa(input));
        toast.success("Text encoded to Base64");
      } else {
        setOutput(atob(input));
        toast.success("Base64 decoded to text");
      }
    } catch (e) {
      toast.error("Invalid input for the selected operation.");
      setOutput('');
    }
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Output copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleSwap = () => {
    setInput(output);
    setOutput('');
    setMode(prev => prev === 'encode' ? 'decode' : 'encode');
  }

  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <Binary className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Base64 <span className="text-primary neon-text">Encoder/Decoder</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Encode text to Base64 or decode Base64 back to text.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
        <Link href="/tools" className="inline-flex items-center justify-center gap-2 rounded-xl h-12 px-5 text-sm font-bold transition-all duration-200 bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-primary">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Tools</span>
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-4">
                 <h2 className="text-lg font-semibold">Input ({mode === 'encode' ? 'Plain Text' : 'Base64'})</h2>
                 <Textarea
                    placeholder={`Enter ${mode === 'encode' ? 'text' : 'Base64'} to ${mode}...`}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="min-h-[250px] text-base font-mono"
                 />
            </div>
            <div className="space-y-4">
                 <h2 className="text-lg font-semibold">Output ({mode === 'encode' ? 'Base64' : 'Plain Text'})</h2>
                 <div className="relative">
                    <Textarea
                        placeholder="Result will appear here..."
                        value={output}
                        readOnly
                        className="min-h-[250px] text-base font-mono bg-muted"
                    />
                    <Button variant="ghost" size="icon" className="absolute top-3 right-3 h-8 w-8 text-muted-foreground" onClick={handleCopy} disabled={!output}>
                        {copied ? <Check className="h-5 w-5 text-success"/> : <Clipboard className="h-5 w-5"/>}
                    </Button>
                </div>
            </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center justify-center">
            <Button onClick={handleConvert} variant="gradient" size="lg" disabled={!input}>
                {mode === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}
            </Button>
            <Button onClick={handleSwap} variant="outline" size="icon" title="Swap Input and Output">
                <ArrowRightLeft className="h-5 w-5"/>
            </Button>
        </div>
      </div>
    </div>
  );
}
