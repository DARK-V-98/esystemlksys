'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { ArrowLeft, Stamp, Download, Cpu, File, Trash2, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileUploader } from '@/components/FileUploader';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from '@/components/ui/slider';

export default function WatermarkPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [watermarkType, setWatermarkType] = useState('text');
  const [text, setText] = useState('CONFIDENTIAL');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [opacity, setOpacity] = useState(0.5);

  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleFileAdded = (newFiles: File[]) => {
    setFile(newFiles[0]);
    toast.success('PDF loaded successfully.');
  };
  
  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };
  
  const handleAddWatermark = async () => {
    if (!file) {
      toast.error('Please upload a PDF file first.');
      return;
    }
    if (watermarkType === 'text' && !text) {
      toast.error('Please enter watermark text.');
      return;
    }
    if (watermarkType === 'image' && !imageFile) {
      toast.error('Please upload a watermark image.');
      return;
    }

    setIsProcessing(true);
    toast.info('Adding watermark...');

    try {
      const pdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();

      let watermarkImageBytes, watermarkImage;
      if (watermarkType === 'image' && imageFile) {
          watermarkImageBytes = await imageFile.arrayBuffer();
          if (imageFile.type === 'image/png') {
              watermarkImage = await pdfDoc.embedPng(watermarkImageBytes);
          } else if (imageFile.type === 'image/jpeg') {
              watermarkImage = await pdfDoc.embedJpg(watermarkImageBytes);
          } else {
              toast.error("Unsupported image type. Please use PNG or JPG.");
              setIsProcessing(false);
              return;
          }
      }
      
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      for (const page of pages) {
        const { width, height } = page.getSize();
        
        if (watermarkType === 'text') {
            const textSize = Math.min(width, height) / 5;
            const textWidth = helveticaFont.widthOfTextAtSize(text, textSize);
            page.drawText(text, {
              x: width / 2 - textWidth / 2,
              y: height / 2 - textSize / 2,
              font: helveticaFont,
              size: textSize,
              color: rgb(0.5, 0.5, 0.5),
              opacity: opacity,
              rotate: {
                type: 'degrees',
                angle: 45
              }
            });
        } else if (watermarkImage) {
            const imgWidth = watermarkImage.width / 2;
            const imgHeight = watermarkImage.height / 2;
            page.drawImage(watermarkImage, {
                x: width / 2 - imgWidth / 2,
                y: height / 2 - imgHeight / 2,
                width: imgWidth,
                height: imgHeight,
                opacity: opacity,
            });
        }
      }

      const newPdfBytes = await pdfDoc.save();
      const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `watermarked_${file.name}`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success('Watermark added successfully!');
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while adding the watermark.');
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
            <Stamp className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Add <span className="text-primary neon-text">Watermark</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Add a text or image watermark to your PDF.
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
            <div className="bg-secondary/50 border rounded-lg p-6 space-y-6">
                {!file ? (
                    <FileUploader onFilesAdded={handleFileAdded} accept="application/pdf" maxSize={50 * 1024 * 1024} multiple={false} />
                ) : (
                    <div className="flex items-center gap-4 p-3 bg-secondary rounded-lg border">
                      <CheckCircle className="h-6 w-6 text-success" />
                      <div className="flex-1 truncate">
                        <p className="font-semibold text-sm">{file.name}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={handleRemoveFile}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                )}
            </div>

            <div className="bg-secondary/50 border rounded-lg p-6 space-y-4">
                <Tabs value={watermarkType} onValueChange={setWatermarkType} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="text">Text Watermark</TabsTrigger>
                        <TabsTrigger value="image">Image Watermark</TabsTrigger>
                    </TabsList>
                    <TabsContent value="text" className="mt-4 space-y-4">
                         <div>
                            <Label htmlFor="watermark-text">Watermark Text</Label>
                            <Input id="watermark-text" value={text} onChange={(e) => setText(e.target.value)} />
                        </div>
                    </TabsContent>
                    <TabsContent value="image" className="mt-4 space-y-4">
                        <div className="space-y-2">
                            <Label>Watermark Image</Label>
                            <Button variant="outline" className="w-full" onClick={() => imageInputRef.current?.click()}>
                                <ImageIcon className="mr-2 h-4 w-4" />
                                {imageFile ? "Change Image" : "Upload Image"}
                            </Button>
                            <input type="file" ref={imageInputRef} onChange={handleImageFileChange} accept="image/png, image/jpeg" className="hidden" />
                            {imageFile && <p className="text-xs text-muted-foreground truncate">{imageFile.name}</p>}
                        </div>
                    </TabsContent>
                </Tabs>
                
                 <div>
                    <Label htmlFor="opacity">Opacity ({Math.round(opacity * 100)}%)</Label>
                    <Slider id="opacity" value={[opacity]} onValueChange={(v) => setOpacity(v[0])} max={1} step={0.1} />
                </div>

                <Button onClick={handleAddWatermark} disabled={isProcessing || !file} className="w-full" variant="gradient">
                    {isProcessing ? <Cpu className="mr-2 h-5 w-5 animate-spin" /> : <Download className="mr-2 h-5 w-5" />}
                    {isProcessing ? 'Processing...' : 'Add Watermark & Download'}
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
