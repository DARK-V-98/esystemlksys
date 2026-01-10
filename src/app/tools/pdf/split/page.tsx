'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { PDFDocument } from 'pdf-lib';
import { ArrowLeft, SplitSquareVertical, Download, Cpu, File, Trash2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileUploader } from '@/components/FileUploader';
import { toast } from 'sonner';

export default function SplitPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [splitRange, setSplitRange] = useState('');
  const [isSplitting, setIsSplitting] = useState(false);

  const handleFileAdded = async (newFiles: File[]) => {
    const newFile = newFiles[0];
    setFile(newFile);
    toast.info('Loading PDF...');
    try {
        const pdfBytes = await newFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes);
        setTotalPages(pdfDoc.getPageCount());
        setSplitRange(`1-${pdfDoc.getPageCount()}`);
        toast.success('PDF loaded successfully.');
    } catch(e) {
        toast.error('Could not read the PDF file.');
        setFile(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setTotalPages(0);
    setSplitRange('');
  };

  const handleSplit = async () => {
    if (!file) {
      toast.error('Please upload a PDF file first.');
      return;
    }

    const pageNumbers = new Set<number>();
    const ranges = splitRange.split(',').map(s => s.trim());

    for (const range of ranges) {
      if (range.includes('-')) {
        const [start, end] = range.split('-').map(Number);
        if (isNaN(start) || isNaN(end) || start > end || start < 1 || end > totalPages) {
          toast.error(`Invalid page range: ${range}`);
          return;
        }
        for (let i = start; i <= end; i++) {
          pageNumbers.add(i);
        }
      } else {
        const page = Number(range);
        if (isNaN(page) || page < 1 || page > totalPages) {
          toast.error(`Invalid page number: ${range}`);
          return;
        }
        pageNumbers.add(page);
      }
    }

    if (pageNumbers.size === 0) {
      toast.error('Please specify at least one page to extract.');
      return;
    }
    
    setIsSplitting(true);
    toast.info('Splitting PDF...');

    try {
      const pdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const newPdf = await PDFDocument.create();
      
      const sortedPages = Array.from(pageNumbers).sort((a, b) => a - b);
      const indices = sortedPages.map(p => p - 1);

      const copiedPages = await newPdf.copyPages(pdfDoc, indices);
      copiedPages.forEach(page => newPdf.addPage(page));

      const newPdfBytes = await newPdf.save();
      const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `split_${file.name}`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success('PDF split and downloaded successfully!');
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while splitting the PDF.');
    } finally {
      setIsSplitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <SplitSquareVertical className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Split <span className="text-primary neon-text">PDF</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Extract pages or page ranges from a PDF file.
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
                        <p className="text-xs text-muted-foreground">{totalPages} pages</p>
                      </div>
                      <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={handleRemoveFile}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="split-range">Pages to Extract</Label>
                        <Input
                            id="split-range"
                            value={splitRange}
                            onChange={(e) => setSplitRange(e.target.value)}
                            placeholder="e.g., 1, 3-5, 8"
                        />
                        <p className="text-xs text-muted-foreground">
                            Use commas to separate page numbers or ranges (e.g., 1, 3-5, 8).
                        </p>
                    </div>

                    <Button onClick={handleSplit} disabled={isSplitting || !splitRange} className="w-full" variant="gradient">
                        {isSplitting ? <Cpu className="mr-2 h-5 w-5 animate-spin" /> : <Download className="mr-2 h-5 w-5" />}
                        {isSplitting ? 'Splitting...' : 'Split PDF & Download'}
                    </Button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
