'use client';
import { useState } from 'react';
import Link from 'next/link';
import { PDFDocument } from 'pdf-lib';
import { ArrowLeft, Lock, Download, Cpu, CheckCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileUploader } from '@/components/FileUploader';
import { toast } from 'sonner';

export default function LockPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileAdded = (newFiles: File[]) => {
    setFile(newFiles[0]);
    toast.success('PDF loaded successfully.');
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleLock = async () => {
    if (!file) {
      toast.error('Please upload a PDF file first.');
      return;
    }
    if (!password) {
      toast.error('Please enter a password.');
      return;
    }

    setIsProcessing(true);
    toast.info('Encrypting PDF...');

    try {
      const pdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      
      pdfDoc.setProducer('ESYSTEMLK');
      pdfDoc.setCreator('ESYSTEMLK PDF Tools');

      const newPdfBytes = await pdfDoc.save({
          useObjectStreams: false, // Required for encryption
          permissions: {
              printing: "denied",
              copying: "denied",
              modifying: "denied",
              annotating: "denied",
              fillingForms: "denied",
              contentAccessibility: "denied",
              documentAssembly: "denied",
          },
          userPassword: password,
          ownerPassword: password, // Simple approach, can be different
      });
      
      const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `locked_${file.name}`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success('PDF locked successfully!');
      setPassword('');
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while locking the PDF. The PDF might already be encrypted.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <Lock className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Lock <span className="text-primary neon-text">PDF</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Add a password to protect your PDF file.
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
                <FileUploader onFilesAdded={handleFileAdded} accept="application/pdf" maxSize={50 * 1024 * 1024} multiple={false} />
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-secondary rounded-lg border">
                      <CheckCircle className="h-6 w-6 text-success" />
                      <div className="flex-1 truncate">
                        <p className="font-semibold text-sm">{file.name}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={handleRemoveFile}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Set Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter a strong password"
                        />
                    </div>

                    <Button onClick={handleLock} disabled={isProcessing || !password} className="w-full" variant="gradient">
                        {isProcessing ? <Cpu className="mr-2 h-5 w-5 animate-spin" /> : <Lock className="mr-2 h-5 w-5" />}
                        {isProcessing ? 'Encrypting...' : 'Lock PDF & Download'}
                    </Button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
