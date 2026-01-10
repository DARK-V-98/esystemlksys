'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Replace } from 'lucide-react';
import { toast } from 'sonner';

export default function FindReplacePage() {
  const [text, setText] = useState('');
  const [find, setFind] = useState('');
  const [replace, setReplace] = useState('');

  const handleReplace = () => {
    if (!find) {
      toast.error("The 'find' field cannot be empty.");
      return;
    }
    const newText = text.replaceAll(find, replace);
    setText(newText);
    toast.success("Text replaced successfully!");
  };

  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <Replace className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Find and <span className="text-primary neon-text">Replace</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Quickly perform find and replace operations on text.
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Find..." value={find} onChange={(e) => setFind(e.target.value)} />
                <Input placeholder="Replace with..." value={replace} onChange={(e) => setReplace(e.target.value)} />
            </div>
            <Textarea
                placeholder="Paste or type your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[300px] text-base"
            />
            <Button onClick={handleReplace} variant="gradient" disabled={!text || !find}>
                Replace All
            </Button>
        </div>
      </div>
    </div>
  );
}
