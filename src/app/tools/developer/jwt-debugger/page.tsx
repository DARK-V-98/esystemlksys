'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Unlock, Clipboard, Check } from 'lucide-react';
import { toast } from 'sonner';
import { jwtDecode } from 'jwt-decode';

export default function JwtDebuggerPage() {
  const [token, setToken] = useState('');
  const [decoded, setDecoded] = useState<{ header: object, payload: object } | null>(null);
  const [error, setError] = useState('');
  const [copiedPart, setCopiedPart] = useState('');

  useEffect(() => {
    if (token) {
      try {
        const header = jwtDecode(token, { header: true });
        const payload = jwtDecode(token);
        setDecoded({ header, payload });
        setError('');
      } catch (e: any) {
        setDecoded(null);
        setError('Invalid JWT token: ' + e.message);
      }
    } else {
      setDecoded(null);
      setError('');
    }
  }, [token]);

  const handleCopy = (data: object, part: 'header' | 'payload') => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiedPart(part);
    toast.success(`Copied ${part} to clipboard!`);
    setTimeout(() => setCopiedPart(''), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <Unlock className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              JWT <span className="text-primary neon-text">Debugger</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Decode and inspect JSON Web Tokens.
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
                 <h2 className="text-lg font-semibold">Encoded Token</h2>
                 <Textarea
                    placeholder="Paste your JWT here..."
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="min-h-[250px] text-base font-mono"
                 />
                 {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <div className="space-y-4">
                 <div className="space-y-2">
                    <h3 className="text-md font-semibold">Header</h3>
                    <div className="relative">
                        <pre className="bg-muted p-4 rounded-md text-xs font-mono overflow-auto min-h-[100px]">
                            {decoded ? JSON.stringify(decoded.header, null, 2) : '...'}
                        </pre>
                        {decoded && <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => handleCopy(decoded.header, 'header')}>
                            {copiedPart === 'header' ? <Check className="h-4 w-4 text-success"/> : <Clipboard className="h-4 w-4"/>}
                        </Button>}
                    </div>
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-md font-semibold">Payload</h3>
                    <div className="relative">
                        <pre className="bg-muted p-4 rounded-md text-xs font-mono overflow-auto min-h-[150px]">
                            {decoded ? JSON.stringify(decoded.payload, null, 2) : '...'}
                        </pre>
                        {decoded && <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => handleCopy(decoded.payload, 'payload')}>
                             {copiedPart === 'payload' ? <Check className="h-4 w-4 text-success"/> : <Clipboard className="h-4 w-4"/>}
                        </Button>}
                    </div>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
}
