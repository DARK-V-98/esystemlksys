'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Camera, Trash2, CheckCircle, Upload, EyeOff, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileUploader } from '@/components/FileUploader';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableRow, TableHead, TableHeader } from '@/components/ui/table';

// EXIF needs to be attached to window. We'll use a script tag for that.
declare global {
  interface Window {
    EXIF: any;
  }
}

export default function ExifViewerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [exifData, setExifData] = useState<Record<string, any> | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/exif-js';
    script.async = true;
    script.onload = () => setIsLoading(false);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleFileAdded = (newFiles: File[]) => {
    const imageFile = newFiles[0];
    if (!imageFile.type.startsWith('image/')) {
        toast.error('Please upload a valid image file.');
        return;
    }
    setFile(imageFile);
    setImageUrl(URL.createObjectURL(imageFile));
    setExifData(null);
    toast.success('Image loaded. Click "View EXIF Data" to inspect.');
  };

  const handleRemoveFile = () => {
    setFile(null);
    setExifData(null);
    setImageUrl(null);
  };
  
  const viewExifData = () => {
    if (!file || !window.EXIF) return;
    toast.info("Reading EXIF data...");
    window.EXIF.getData(file, function(this: any) {
        const allTags = window.EXIF.getAllTags(this);
        if (Object.keys(allTags).length > 0) {
            setExifData(allTags);
            toast.success("EXIF data extracted.");
        } else {
            setExifData({});
            toast.warning("No EXIF data found in this image.");
        }
    });
  };
  
  const removeExifData = () => {
    if (!file || !imageUrl) return;
    toast.info("Removing EXIF data and downloading...");
    
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            toast.error("Could not process image.");
            return;
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
            if (blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `clean_${file.name}`;
                a.click();
                URL.revokeObjectURL(url);
                toast.success("Image with EXIF data removed has been downloaded.");
            }
        }, file.type);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <Camera className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              EXIF Data <span className="text-primary neon-text">Viewer</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              View and remove metadata from your images.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
        <Link href="/tools" className="inline-flex items-center justify-center gap-2 rounded-xl h-12 px-5 text-sm font-bold transition-all duration-200 bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-primary">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Tools</span>
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-secondary/50 border rounded-lg p-6 space-y-4">
                 {!file ? (
                    <FileUploader onFilesAdded={handleFileAdded} accept="image/jpeg,image/tiff" maxSize={20 * 1024 * 1024} multiple={false} />
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-3 bg-secondary rounded-lg border">
                            <CheckCircle className="h-6 w-6 text-success" />
                            <div className="flex-1 truncate"><p className="font-semibold text-sm">{file.name}</p></div>
                            <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={handleRemoveFile}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                        {imageUrl && <img src={imageUrl} alt="preview" className="max-h-60 w-full object-contain rounded-md" />}
                        <Button onClick={viewExifData} disabled={isLoading} className="w-full"><Eye className="mr-2 h-4 w-4"/>View EXIF Data</Button>
                        <Button onClick={removeExifData} variant="destructive" className="w-full"><EyeOff className="mr-2 h-4 w-4"/>Download without EXIF</Button>
                    </div>
                )}
            </div>
             <div className="bg-secondary/50 border rounded-lg p-4">
                <h3 className="text-lg font-bold p-2">EXIF Data</h3>
                <div className="max-h-[50vh] overflow-y-auto">
                    <Table>
                        <TableHeader><TableRow><TableHead>Tag</TableHead><TableHead>Value</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {exifData && Object.keys(exifData).length > 0 ? (
                                Object.entries(exifData).map(([key, value]) => (
                                    <TableRow key={key}><TableCell className="font-semibold">{key}</TableCell><TableCell className="font-mono text-xs">{String(value)}</TableCell></TableRow>
                                ))
                            ) : (
                                <TableRow><TableCell colSpan={2} className="h-24 text-center text-muted-foreground">{file ? "Click 'View EXIF Data' to see metadata." : "Upload an image to start."}</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
