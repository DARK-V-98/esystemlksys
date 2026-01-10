'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Network, Clipboard, Check, RefreshCw, Cpu } from 'lucide-react';
import { toast } from 'sonner';

export default function IpFinderPage() {
  const [publicIp, setPublicIp] = useState('Loading...');
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchIp = async () => {
    setIsLoading(true);
    setPublicIp('Loading...');
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      setPublicIp(data.ip);
      toast.success("Fetched public IP address.");
    } catch (error) {
      setPublicIp('Unable to fetch IP');
      toast.error("Could not fetch public IP address.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIp();
  }, []);

  const handleCopy = () => {
    if (publicIp === 'Loading...' || publicIp === 'Unable to fetch IP') return;
    navigator.clipboard.writeText(publicIp);
    setCopied(true);
    toast.success("IP Address copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <Network className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              What Is My <span className="text-primary neon-text">IP?</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Quickly find your public IP address.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6 max-w-2xl mx-auto">
        <Link href="/tools" className="inline-flex items-center justify-center gap-2 rounded-xl h-12 px-5 text-sm font-bold transition-all duration-200 bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-primary">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Tools</span>
        </Link>
        
        <div className="bg-secondary/50 border rounded-lg p-6 space-y-4 text-center">
            <h2 className="text-lg text-muted-foreground font-semibold">Your Public IP Address is:</h2>
            <div className="relative">
                 <Input
                    readOnly
                    value={publicIp}
                    className="h-20 text-4xl font-bold font-mono text-center pr-24 bg-card"
                />
                 <div className="absolute top-1/2 right-2 -translate-y-1/2 flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={handleCopy} disabled={isLoading || copied}>
                        {copied ? <Check className="h-6 w-6 text-success"/> : <Clipboard className="h-6 w-6"/>}
                    </Button>
                     <Button variant="ghost" size="icon" onClick={fetchIp} disabled={isLoading}>
                        {isLoading ? <Cpu className="h-6 w-6 animate-spin"/> : <RefreshCw className="h-6 w-6"/>}
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
