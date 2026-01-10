'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, QrCode, Download } from 'lucide-react';
import { toast } from 'sonner';
import QRCode from 'qrcode';

export default function QrCodeGeneratorPage() {
  const [text, setText] = useState('https://www.esystemlk.xyz');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (text) {
      QRCode.toDataURL(text, { width: 300, margin: 2 }, (err, url) => {
        if (err) {
            toast.error("Could not generate QR Code.");
            return;
        }
        setQrCodeUrl(url);
      });
    } else {
        setQrCodeUrl('');
    }
  }, [text]);
  
  const handleDownload = () => {
      if (!qrCodeUrl) return;
      const link = document.createElement('a');
      link.download = 'qrcode.png';
      link.href = qrCodeUrl;
      link.click();
  }

  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <QrCode className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              QR Code <span className="text-primary neon-text">Generator</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Create QR codes from text or URLs instantly.
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
            <div className="bg-secondary/50 border rounded-lg p-6 space-y-4">
                 <h2 className="text-lg font-semibold">Input Data</h2>
                 <Textarea
                    placeholder="Enter text or URL..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="min-h-[250px] text-base font-mono"
                 />
            </div>
            <div className="space-y-4 p-6 bg-secondary/50 border rounded-lg flex flex-col items-center justify-center">
                 <h2 className="text-lg font-semibold">Generated QR Code</h2>
                 <div className="p-4 bg-white rounded-lg shadow-md">
                    {qrCodeUrl ? <img src={qrCodeUrl} alt="Generated QR Code" width={256} height={256} /> : <div className="w-64 h-64 bg-gray-200 flex items-center justify-center text-muted-foreground">Enter text to generate</div>}
                 </div>
                 <Button onClick={handleDownload} disabled={!qrCodeUrl} variant="gradient" className="w-full mt-4">
                    <Download className="mr-2 h-5 w-5"/>
                    Download PNG
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
