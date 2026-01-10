'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Hash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TextCounterPage() {
  const [text, setText] = useState('');

  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const charCount = text.length;
  const sentenceCount = text.trim() === '' ? 0 : (text.match(/[.!?]+/g) || []).length;
  const paragraphCount = text.trim() === '' ? 0 : text.split(/\n+/).filter(p => p.trim() !== '').length;

  const stats = [
    { name: 'Words', value: wordCount },
    { name: 'Characters', value: charCount },
    { name: 'Sentences', value: sentenceCount },
    { name: 'Paragraphs', value: paragraphCount },
  ];

  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <Hash className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Text <span className="text-primary neon-text">Counter</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Count words, characters, sentences, and paragraphs in your text.
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
            <Textarea
                placeholder="Paste or type your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[250px] text-base"
            />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                {stats.map((stat) => (
                    <Card key={stat.name} className="text-center">
                        <CardHeader className="p-4">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <p className="text-4xl font-bold text-primary">{stat.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}