'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Barcode, Download } from 'lucide-react';
import { toast } from 'sonner';
import JsBarcode from 'jsbarcode';

export default function BarcodeGeneratorPage() {
  const [text, setText] = useState('ESYSTEMLK');
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
        try {
            JsBarcode(svgRef.current, text, {
                format: "CODE128",
                lineColor: "#000",
                width: 2,
                height: 100,
                displayValue: true,
                fontOptions: "bold"
            });
        } catch (e) {
            // Can fail if text is invalid for a format
            console.error(e);
        }
    }
  }, [text]);
  
  const handleDownload = () => {
    if (!svgRef.current) {
        toast.error("Barcode not generated yet.");
        return;
    }
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const svgSize = svgRef.current.getBoundingClientRect();
    canvas.width = svgSize.width;
    canvas.height = svgSize.height;

    const img = new Image();
    img.onload = () => {
        ctx.fillStyle = "white";
        ctx.fillRect(0,0,canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const pngUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `barcode_${text}.png`;
        link.href = pngUrl;
        link.click();
        toast.success("Barcode downloaded as PNG!");
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <Barcode className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Barcode <span className="text-primary neon-text">Generator</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Create and download barcodes from text.
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
                 <Input
                    placeholder="Enter text for barcode..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="h-12 text-lg"
                 />
                 <Button onClick={handleDownload} disabled={!text} variant="gradient" className="w-full">
                    <Download className="mr-2 h-5 w-5"/>
                    Download as PNG
                </Button>
            </div>
            <div className="p-6 bg-secondary/50 border rounded-lg flex flex-col items-center justify-center">
                 <h2 className="text-lg font-semibold mb-4">Generated Barcode</h2>
                 <div className="p-4 bg-white rounded-lg shadow-md">
                    <svg ref={svgRef}></svg>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
}
