'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, BookOpen, Clipboard, Check } from 'lucide-react';
import { toast } from 'sonner';

const changelogTemplate = `### Added
- 

### Changed
- 

### Fixed
- `;

export default function ChangelogGeneratorPage() {
  const [text, setText] = useState(changelogTemplate);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Changelog copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleReset = () => {
    setText(changelogTemplate);
    toast.info("Changelog template has been reset.");
  }

  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <BookOpen className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Changelog <span className="text-primary neon-text">Generator</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              A simple helper to format your changelog entries.
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
                    placeholder="Your changelog content..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="min-h-[400px] text-base font-mono"
                />
                 <Button variant="ghost" size="icon" className="absolute top-3 right-3 h-8 w-8 text-muted-foreground" onClick={handleCopy} disabled={!text}>
                    {copied ? <Check className="h-5 w-5 text-success"/> : <Clipboard className="h-5 w-5"/>}
                </Button>
            </div>
             <Button onClick={handleReset} variant="outline" disabled={!text}>Reset Template</Button>
        </div>
      </div>
    </div>
  );
}
