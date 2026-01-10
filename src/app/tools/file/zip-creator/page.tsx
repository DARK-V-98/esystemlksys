'use client';
import { useState } from 'react';
import Link from 'next/link';
import JSZip from 'jszip';
import { ArrowLeft, FileArchive, Download, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileUploader } from '@/components/FileUploader';
import { FileList } from '@/components/File-list';
import { toast } from 'sonner';

export default function ZipCreatorPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesAdded = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreateZip = async () => {
    if (files.length === 0) {
      toast.error('Please add at least one file to the ZIP archive.');
      return;
    }

    setIsProcessing(true);
    toast.info('Creating ZIP file...');

    try {
      const zip = new JSZip();
      files.forEach(file => {
        zip.file(file.name, file);
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'archive.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('ZIP file created and downloaded successfully!');
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while creating the ZIP file.');
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
            <FileArchive className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              ZIP File <span className="text-primary neon-text">Creator</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Create a ZIP archive from multiple files.
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
            <FileUploader onFilesAdded={handleFilesAdded} accept="" maxSize={100 * 1024 * 1024} multiple={true} />
            
            {files.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Files to Add ({files.length})</h3>
                    <FileList 
                        files={files} 
                        onRemove={handleRemoveFile} 
                        onDragStart={()=>{}}
                        onDragEnter={()=>{}}
                        onDragEnd={()=>{}}
                    />
                    <Button onClick={handleCreateZip} disabled={isProcessing || files.length === 0} className="w-full" variant="gradient">
                        {isProcessing ? <Cpu className="mr-2 h-5 w-5 animate-spin" /> : <Download className="mr-2 h-5 w-5" />}
                        {isProcessing ? 'Zipping...' : `Create & Download ZIP`}
                    </Button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
