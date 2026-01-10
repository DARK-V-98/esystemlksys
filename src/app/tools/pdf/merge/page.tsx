'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { PDFDocument } from 'pdf-lib';
import { ArrowLeft, Merge, File, Download, Trash2, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileUploader } from '@/components/FileUploader';
import { FileList } from '@/components/File-list';
import { toast } from 'sonner';

export default function MergePdfsPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleFilesAdded = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    dragOverItem.current = index;
  };
  
  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
        const newFiles = [...files];
        const draggedItemContent = newFiles.splice(dragItem.current, 1)[0];
        newFiles.splice(dragOverItem.current, 0, draggedItemContent);
        setFiles(newFiles);
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      toast.error('Please upload at least two PDF files to merge.');
      return;
    }

    setIsMerging(true);
    toast.info('Merging PDFs...');

    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const pdfBytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => {
          mergedPdf.addPage(page);
        });
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('PDFs merged successfully!');
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while merging the PDFs.');
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <Merge className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Merge <span className="text-primary neon-text">PDFs</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Combine multiple PDF files into one single document.
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
            <FileUploader onFilesAdded={handleFilesAdded} accept="application/pdf" maxSize={50 * 1024 * 1024} multiple={true} />
            
            {files.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Files to Merge (Drag to reorder)</h3>
                    <FileList 
                        files={files} 
                        onRemove={handleRemoveFile} 
                        onDragStart={handleDragStart}
                        onDragEnter={handleDragEnter}
                        onDragEnd={handleDragEnd}
                    />
                    <Button onClick={handleMerge} disabled={isMerging || files.length < 2} className="w-full" variant="gradient">
                        {isMerging ? <Cpu className="mr-2 h-5 w-5 animate-spin" /> : <Download className="mr-2 h-5 w-5" />}
                        {isMerging ? 'Merging...' : `Merge ${files.length} Files & Download`}
                    </Button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
