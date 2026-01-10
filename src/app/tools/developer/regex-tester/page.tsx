'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ListRestart } from 'lucide-react';
import { toast } from 'sonner';

export default function RegexTesterPage() {
  const [regex, setRegex] = useState('\\b\\w{4}\\b');
  const [flags, setFlags] = useState('gi');
  const [testString, setTestString] = useState('This is a simple test string for our regular expression tester.');
  
  const highlightedString = useMemo(() => {
    if (!regex || !testString) return { __html: testString };
    try {
      const re = new RegExp(regex, flags);
      const highlighted = testString.replace(re, match => `<mark>${match}</mark>`);
      return { __html: highlighted };
    } catch (e) {
      return { __html: testString };
    }
  }, [regex, flags, testString]);

  const matches = useMemo(() => {
    if (!regex) return [];
    try {
      const re = new RegExp(regex, flags);
      const allMatches = [...testString.matchAll(re)];
      return allMatches.map(match => ({
        full: match[0],
        groups: match.groups ? Object.entries(match.groups) : [],
        index: match.index
      }));
    } catch (e) {
      return [];
    }
  }, [regex, flags, testString]);


  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <ListRestart className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Regex <span className="text-primary neon-text">Tester</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Test your regular expressions in real-time.
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
            <div className="flex gap-4">
                <span className="p-2 bg-muted rounded-md font-mono">/</span>
                <Input placeholder="Regular Expression" value={regex} onChange={e => setRegex(e.target.value)} className="font-mono"/>
                <span className="p-2 bg-muted rounded-md font-mono">/</span>
                <Input placeholder="flags" value={flags} onChange={e => setFlags(e.target.value)} className="w-20 font-mono"/>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Test String</h3>
              <Textarea
                  placeholder="Your test string here..."
                  value={testString}
                  onChange={(e) => setTestString(e.target.value)}
                  className="min-h-[150px] text-base font-mono"
              />
            </div>
             <div className="space-y-4 pt-4">
                <h3 className="text-lg font-semibold">Result</h3>
                <div className="bg-background p-4 rounded-md border min-h-[100px]">
                    <p className="whitespace-pre-wrap font-mono" dangerouslySetInnerHTML={highlightedString}></p>
                </div>
                 <h3 className="text-lg font-semibold">Matches ({matches.length})</h3>
                <div className="bg-background p-4 rounded-md border max-h-60 overflow-auto">
                    {matches.length > 0 ? (
                        matches.map((m, i) => (
                            <div key={i} className="font-mono text-sm border-b last:border-b-0 py-2">
                                <span className="bg-primary/20 text-primary font-bold rounded px-1.5 py-0.5">{m.full}</span>
                                <span className="text-muted-foreground ml-2">(index: {m.index})</span>
                                {m.groups.length > 0 && (
                                    <div className="pl-4 mt-1 text-xs">
                                        {m.groups.map(([key, value]) => <p key={key}><span className="font-semibold">{key}:</span> {value}</p>)}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : <p className="text-muted-foreground text-sm">No matches found.</p>}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
