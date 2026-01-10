'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, FileLock2, Clipboard, Check, CheckCircle, Trash2, Cpu } from 'lucide-react';
import { toast } from 'sonner';
import { FileUploader } from '@/components/FileUploader';
import CryptoJS from 'crypto-js';

type HashAlgorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-512';

export default function FileHashCheckerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hashes, setHashes] = useState<Record<HashAlgorithm, string> | null>(null);
  const [copiedValue, setCopiedValue] = useState('');

  const handleFileAdded = (newFiles: File[]) => {
    setFile(newFiles[0]);
    setHashes(null);
    toast.success("File loaded. Click 'Generate Hashes' to start.");
  };

  const handleRemoveFile = () => {
    setFile(null);
    setHashes(null);
  };

  const generateHashes = () => {
    if (!file) {
      toast.error("Please upload a file first.");
      return;
    }
    setIsProcessing(true);
    toast.info("Calculating hashes...");

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      if (data) {
        const wordArray = CryptoJS.lib.WordArray.create(data as any);
        setHashes({
          'MD5': CryptoJS.MD5(wordArray).toString(),
          'SHA-1': CryptoJS.SHA1(wordArray).toString(),
          'SHA-256': CryptoJS.SHA256(wordArray).toString(),
          'SHA-512': CryptoJS.SHA512(wordArray).toString(),
        });
        toast.success("Hashes generated successfully!");
      } else {
        toast.error("Could not read file data.");
      }
      setIsProcessing(false);
    };
    reader.onerror = () => {
      toast.error("Failed to read file.");
      setIsProcessing(false);
    };
    reader.readAsArrayBuffer(file);
  };
  
  const handleCopy = (value: string, type: string) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopiedValue(type);
    toast.success(`Copied ${type} to clipboard!`);
    setTimeout(() => setCopiedValue(''), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <FileLock2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              File Hash <span className="text-primary neon-text">Checker</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Calculate MD5, SHA-1, SHA-256, and SHA-512 hashes for any file.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
        <Link href="/tools" className="inline-flex items-center justify-center gap-2 rounded-xl h-12 px-5 text-sm font-bold transition-all duration-200 bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-primary">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Tools</span>
        </Link>
        
        <div className="bg-secondary/50 border rounded-lg p-6 space-y-6">
            {!file ? (
                <FileUploader onFilesAdded={handleFileAdded} accept="" maxSize={200 * 1024 * 1024} multiple={false} />
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-secondary rounded-lg border">
                      <CheckCircle className="h-6 w-6 text-success" />
                      <div className="flex-1 truncate">
                        <p className="font-semibold text-sm">{file.name}</p>
                        <p className="text-xs text-muted-foreground">Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={handleRemoveFile}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button onClick={generateHashes} disabled={isProcessing} className="w-full" variant="gradient">
                        {isProcessing ? <Cpu className="mr-2 h-5 w-5 animate-spin" /> : 'Generate Hashes'}
                    </Button>
                </div>
            )}
            
            {hashes && (
                <div className="space-y-4 pt-4">
                    {Object.entries(hashes).map(([algo, hash]) => (
                        <div key={algo} className="space-y-1">
                            <Label htmlFor={algo} className="font-semibold">{algo}</Label>
                            <div className="relative">
                                <Input id={algo} value={hash} readOnly className="font-mono bg-muted h-12 pr-12 text-xs md:text-sm"/>
                                <Button variant="ghost" size="icon" className="absolute top-1/2 right-2 -translate-y-1/2 h-8 w-8" onClick={() => handleCopy(hash, algo)}>
                                   {copiedValue === algo ? <Check className="h-4 w-4 text-success" /> : <Clipboard className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
