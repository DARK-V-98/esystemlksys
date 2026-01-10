'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, CaseSensitive, Clipboard, Check } from 'lucide-react';
import { toast } from 'sonner';

const loremIpsumText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

export default function LoremIpsumGeneratorPage() {
  const [count, setCount] = useState(5);
  const [type, setType] = useState<'paragraphs' | 'sentences'>('paragraphs');
  const [generatedText, setGeneratedText] = useState('');
  const [copied, setCopied] = useState(false);

  const generateText = () => {
    let result = '';
    const sentences = loremIpsumText.split('. ');

    if (type === 'paragraphs') {
      for (let i = 0; i < count; i++) {
        result += loremIpsumText + (i < count - 1 ? '\n\n' : '');
      }
    } else {
      for (let i = 0; i < count; i++) {
        result += sentences[i % sentences.length] + '. ';
      }
    }
    setGeneratedText(result.trim());
    toast.success('Lorem Ipsum text generated!');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    toast.success("Text copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <CaseSensitive className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Lorem Ipsum <span className="text-primary neon-text">Generator</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Generate placeholder text for your designs.
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
            <div className="flex flex-wrap gap-4 items-end">
                <div className="space-y-2 flex-grow">
                    <Label htmlFor="count">Count</Label>
                    <Input id="count" type="number" value={count} onChange={(e) => setCount(parseInt(e.target.value) || 1)} min="1" />
                </div>
                <div className="flex gap-2">
                    <Button variant={type === 'paragraphs' ? 'default' : 'outline'} onClick={() => setType('paragraphs')}>Paragraphs</Button>
                    <Button variant={type === 'sentences' ? 'default' : 'outline'} onClick={() => setType('sentences')}>Sentences</Button>
                </div>
                <Button onClick={generateText} variant="gradient">Generate</Button>
            </div>
            
            {generatedText && (
                <div className="relative pt-4">
                    <h2 className="text-lg font-semibold mb-2">Generated Text</h2>
                    <Textarea
                        value={generatedText}
                        readOnly
                        className="min-h-[250px] text-base bg-muted"
                    />
                     <Button variant="ghost" size="icon" className="absolute top-7 right-3 h-8 w-8 text-muted-foreground" onClick={handleCopy}>
                        {copied ? <Check className="h-5 w-5 text-success"/> : <Clipboard className="h-5 w-5"/>}
                    </Button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
