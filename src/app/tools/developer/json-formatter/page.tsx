'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Braces, RefreshCw, Clipboard, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function JsonFormatterPage() {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const formatted = JSON.stringify(parsed, null, 4);
      setJsonInput(formatted);
      setError('');
      toast.success('JSON formatted successfully!');
    } catch (e: any) {
      setError('Invalid JSON: ' + e.message);
      toast.error('Invalid JSON syntax.');
    }
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const minified = JSON.stringify(parsed);
      setJsonInput(minified);
      setError('');
      toast.success('JSON minified successfully!');
    } catch (e: any) {
      setError('Invalid JSON: ' + e.message);
      toast.error('Invalid JSON syntax.');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonInput);
    setCopied(true);
    toast.success('JSON copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleClear = () => {
    setJsonInput('');
    setError('');
  };

  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <Braces className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              JSON <span className="text-primary neon-text">Formatter</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Format, validate, and minify JSON data with ease.
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
            <div className="relative">
                <Textarea
                    placeholder='Paste your JSON here...'
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    className="min-h-[400px] text-base font-mono"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={handleCopy} disabled={!jsonInput}>
                        {copied ? <Check className="h-5 w-5 text-success"/> : <Clipboard className="h-5 w-5"/>}
                    </Button>
                     <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={handleClear} disabled={!jsonInput}>
                        <RefreshCw className="h-5 w-5"/>
                    </Button>
                </div>
            </div>
            {error && <p className="text-sm text-destructive font-mono">{error}</p>}
            <div className="flex flex-wrap gap-4">
                <Button onClick={handleFormat} variant="gradient" disabled={!jsonInput}>Format / Beautify</Button>
                <Button onClick={handleMinify} variant="outline" disabled={!jsonInput}>Minify</Button>
            </div>
        </div>
      </div>
    </div>
  );
}
