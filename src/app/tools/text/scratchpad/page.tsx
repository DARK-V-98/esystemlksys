'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, PenSquare, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ScratchpadPage() {
  const [text, setText] = useState('');

  useEffect(() => {
    const savedText = localStorage.getItem('scratchpadText');
    if (savedText) {
      setText(savedText);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('scratchpadText', text);
    toast.success("Scratchpad saved locally!");
  };
  
  const handleClear = () => {
    localStorage.removeItem('scratchpadText');
    setText('');
    toast.error("Scratchpad cleared!");
  };

  useEffect(() => {
    // This is an alternative to a save button, auto-saving on change.
    // It's commented out to keep the explicit save button functionality.
    // if (text) {
    //   localStorage.setItem('scratchpadText', text);
    // }
  }, [text]);

  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <PenSquare className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Notes & <span className="text-primary neon-text">Scratchpad</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              A simple place for your quick notes and thoughts.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
        <div className="flex justify-between items-center">
            <Link href="/tools" className="inline-flex items-center justify-center gap-2 rounded-xl h-12 px-5 text-sm font-bold transition-all duration-200 bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-primary">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Tools</span>
            </Link>
            <div className="flex gap-2">
                <Button onClick={handleSave}><Save className="mr-2 h-4 w-4"/> Save</Button>
                <Button onClick={handleClear} variant="destructive"><Trash2 className="mr-2 h-4 w-4"/> Clear</Button>
            </div>
        </div>
        
        <div className="bg-secondary/50 border rounded-lg p-2">
            <Textarea
                placeholder="Start typing your notes here... Your text is saved in your browser when you click Save."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[60vh] text-base font-mono resize-none border-0 focus-visible:ring-0"
            />
        </div>
      </div>
    </div>
  );
}
