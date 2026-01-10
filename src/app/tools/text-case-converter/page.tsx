'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Type, Clipboard, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function TextCaseConverterPage() {
  const [text, setText] = useState('');
  const [hasCopied, setHasCopied] = useState(false);

  const toSentenceCase = () => {
    setText(
      text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())
    );
    toast.success('Converted to Sentence Case');
  };

  const toLowerCase = () => {
    setText(text.toLowerCase());
    toast.success('Converted to lower case');
  };

  const toUpperCase = () => {
    setText(text.toUpperCase());
    toast.success('Converted to UPPER CASE');
  };

  const toTitleCase = () => {
    setText(
      text.toLowerCase().replace(/(?:^|\s)\w/g, (match) => match.toUpperCase())
    );
    toast.success('Converted to Title Case');
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setHasCopied(true);
    toast.success('Text copied to clipboard!');
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <Type className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Text Case <span className="text-primary neon-text">Converter</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Easily convert text between different case formats.
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
                    placeholder="Paste or type your text here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="min-h-[250px] text-base"
                />
                <Button variant="ghost" size="icon" className="absolute top-3 right-3 h-8 w-8 text-muted-foreground" onClick={handleCopy} disabled={!text}>
                    {hasCopied ? <Check className="h-5 w-5 text-success"/> : <Clipboard className="h-5 w-5"/>}
                </Button>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Button onClick={toSentenceCase} variant="outline" disabled={!text}>Sentence case</Button>
                <Button onClick={toLowerCase} variant="outline" disabled={!text}>lower case</Button>
                <Button onClick={toUpperCase} variant="outline" disabled={!text}>UPPER CASE</Button>
                <Button onClick={toTitleCase} variant="outline" disabled={!text}>Title Case</Button>
            </div>
        </div>
      </div>
    </div>
  );
}