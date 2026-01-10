'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Binary, Check, Clipboard, Trash2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileUploader } from '@/components/FileUploader';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';

export default function ImageToBase64Page() {
  const [file, setFile] = useState<File | null>(null);
  const [base64String, setBase64String] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFileAdded = (newFiles: File[]) => {
    const imageFile = newFiles[0];
    if (!imageFile.type.startsWith('image/')) {
        toast.error('Please upload a valid image file.');
        return;
    }
    setFile(imageFile);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setBase64String(reader.result as string);
      toast.success('Image converted to Base64.');
    };
    reader.onerror = () => {
        toast.error('Failed to read the file.');
    }
    reader.readAsDataURL(imageFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setBase64String('');
    setCopied(false);
  };
  
  const handleCopy = () => {
    if (!base64String) return;
    navigator.clipboard.writeText(base64String);
    setCopied(true);
    toast.success("Base64 string copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <Binary className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Image to <span className="text-primary neon-text">Base64</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Convert an image file into a Base64 data string.
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
                <FileUploader onFilesAdded={handleFileAdded} accept="image/*" maxSize={10 * 1024 * 1024} multiple={false} />
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

                    <div className="relative">
                        <Textarea
                            readOnly
                            value={base64String}
                            className="min-h-[200px] font-mono text-xs"
                            placeholder="Base64 string will appear here..."
                        />
                        <Button variant="ghost" size="icon" className="absolute top-3 right-3 h-8 w-8 text-muted-foreground" onClick={handleCopy} disabled={!base64String}>
                            {copied ? <Check className="h-5 w-5 text-success"/> : <Clipboard className="h-5 w-5"/>}
                        </Button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
