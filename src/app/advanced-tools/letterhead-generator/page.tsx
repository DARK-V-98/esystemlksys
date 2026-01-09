'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, FileSignature, Eye, RefreshCcw, Upload, Palette, Download, Save, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { getAuth, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { app } from "@/firebase/config";
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { letterheadDesigns } from '@/lib/letterhead-designs';
import { cn } from '@/lib/utils';

const initialYourCompany = 'Your Company Name';
const initialYourAddress = '123 Street, City, Country\nPhone: (123) 456-7890\nEmail: contact@yourcompany.com';
const initialLetterContent = `Date: ${new Date().toLocaleDateString()}

Subject: Regarding...

Dear [Recipient Name],

This is the main body of your letter. You can write your content here.

Sincerely,
[Your Name]
[Your Title]`;

export default function LetterheadGeneratorPage() {
  const [logo, setLogo] = useState<string | null>(null);
  const [yourCompany, setYourCompany] = useState(initialYourCompany);
  const [yourAddress, setYourAddress] = useState(initialYourAddress);
  const [letterContent, setLetterContent] = useState(initialLetterContent);
  const [accentColor, setAccentColor] = useState('#333333');
  const [selectedDesign, setSelectedDesign] = useState(0);

  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const letterPreviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem('letterheadGeneratorData');
      if (savedData) {
        const data = JSON.parse(savedData);
        setLogo(data.logo || null);
        setYourCompany(data.yourCompany || initialYourCompany);
        setYourAddress(data.yourAddress || initialYourAddress);
        setLetterContent(data.letterContent || initialLetterContent);
        setAccentColor(data.accentColor || '#333333');
        setSelectedDesign(data.selectedDesign || 0);
      }
    } catch (error) {
      console.error("Failed to load from local storage", error);
    }
  }, []);

  useEffect(() => {
    const dataToSave = { logo, yourCompany, yourAddress, letterContent, accentColor, selectedDesign };
    localStorage.setItem('letterheadGeneratorData', JSON.stringify(dataToSave));
  }, [logo, yourCompany, yourAddress, letterContent, accentColor, selectedDesign]);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const resetFields = () => {
    setLogo(null);
    setYourCompany(initialYourCompany);
    setYourAddress(initialYourAddress);
    setLetterContent(initialLetterContent);
    setAccentColor('#333333');
    setSelectedDesign(0);
    localStorage.removeItem('letterheadGeneratorData');
    toast.success("Form fields have been reset.");
  };

  const downloadPDF = async (letterId: string) => {
    const element = letterPreviewRef.current;
    if (!element) return;
    toast.info('Generating PDF...');
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'px', [canvas.width, canvas.height]);
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`letterhead-${letterId}.pdf`);
      toast.success('PDF downloaded!');
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error('Failed to generate PDF.');
    }
  };

  const handleSaveAndDownload = async () => {
    if (!user) {
      toast.error("You must be logged in to save and download.");
      return;
    }
    setIsSaving(true);
    const letterId = `LH-${Date.now()}`;
    const letterData = { yourCompany, yourAddress, letterContent, accentColor, selectedDesign, logo };
    try {
      const db = getFirestore(app);
      await setDoc(doc(db, 'users', user.uid, 'letterheads', letterId), {
        id: letterId,
        userId: user.uid,
        data: JSON.stringify(letterData),
        createdAt: serverTimestamp(),
      });
      toast.success(`Letterhead ${letterId} saved!`);
      await downloadPDF(letterId);
    } catch (error) {
      console.error("Error saving letterhead:", error);
      toast.error("Failed to save letterhead.");
    } finally {
      setIsSaving(false);
      setIsPreviewOpen(false);
    }
  };
  
  const DesignComponent = letterheadDesigns[selectedDesign].component;

  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <FileSignature className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Letterhead <span className="text-primary neon-text">Generator</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Create official documents with customizable designs.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
        <div className="flex flex-wrap gap-2 justify-between items-center">
            <Link href="/advanced-tools" className="inline-flex items-center justify-center gap-2 rounded-xl h-12 px-5 text-sm font-bold transition-all duration-200 bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-primary">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Advanced Tools</span>
            </Link>
            <div className="flex gap-2">
                <Button onClick={() => setIsPreviewOpen(true)} variant="gradient" className="h-12">
                    <Eye className="mr-2 h-5 w-5"/>
                    Preview & Download
                </Button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <ScrollArea className="lg:col-span-1 h-[70vh] rounded-lg border p-4 shadow-inner bg-secondary/30">
                <div className="space-y-6">
                    <div>
                        <h3 className="font-bold text-lg mb-2">Company Details</h3>
                        <div className="space-y-2">
                            <Button onClick={() => fileInputRef.current?.click()} className="w-full">
                                <Upload className="mr-2 h-4 w-4"/> {logo ? 'Change Logo' : 'Upload Logo'}
                            </Button>
                            <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden"/>
                            <Input placeholder="Company Name" value={yourCompany} onChange={(e) => setYourCompany(e.target.value)} />
                            <Textarea placeholder="Company Address & Contact" value={yourAddress} onChange={(e) => setYourAddress(e.target.value)} rows={4}/>
                        </div>
                    </div>
                    <Separator/>
                    <div>
                        <h3 className="font-bold text-lg mb-2">Letter Content</h3>
                        <Textarea placeholder="Write your letter here..." value={letterContent} onChange={(e) => setLetterContent(e.target.value)} rows={15}/>
                    </div>
                    <Separator/>
                    <div>
                        <h3 className="font-bold text-lg mb-2">Customization</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Label htmlFor="accent-color" className="flex items-center gap-2 cursor-pointer">
                                    <Palette className="h-5 w-5"/> Accent Color
                                </Label>
                                <Input id="accent-color" type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="h-8 w-12 p-1"/>
                            </div>
                            <h4 className="font-semibold">Designs</h4>
                            <ScrollArea className="h-48">
                                <div className="grid grid-cols-2 gap-2 pr-4">
                                {letterheadDesigns.map((design, index) => (
                                    <button key={design.name} onClick={() => setSelectedDesign(index)} className={cn("border-2 rounded-lg p-1 text-center text-xs h-20 transition-all", selectedDesign === index ? 'border-primary shadow-glow' : 'border-border hover:border-primary/50')}>
                                        <div className="w-full h-full bg-white flex items-center justify-center font-semibold text-muted-foreground">{design.name}</div>
                                    </button>
                                ))}
                                </div>
                            </ScrollArea>
                             <Button onClick={resetFields} className="w-full" variant="outline">
                                <RefreshCcw className="mr-2 h-4 w-4"/> Reset Fields
                            </Button>
                        </div>
                    </div>
                </div>
            </ScrollArea>
            
            <div className="lg:col-span-2 rounded-lg shadow-elevated bg-white flex items-center justify-center p-8">
                 <div className="w-full h-full p-4 bg-white text-black overflow-hidden">
                    <DesignComponent
                        companyName={yourCompany}
                        companyAddress={yourAddress}
                        logo={logo}
                        letterContent={letterContent}
                        accentColor={accentColor}
                    />
                 </div>
            </div>
        </div>
      </div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
            <DialogHeader>
                <DialogTitle>Letterhead Preview</DialogTitle>
                <DialogDescription>Review your document. It will be saved to your account upon download.</DialogDescription>
            </DialogHeader>
            <div className="flex-grow overflow-auto p-2 bg-muted/50 rounded-lg">
                <div ref={letterPreviewRef} className="w-[8.5in] min-h-[11in] mx-auto bg-white text-black shadow-lg">
                    <DesignComponent
                        companyName={yourCompany}
                        companyAddress={yourAddress}
                        logo={logo}
                        letterContent={letterContent}
                        accentColor={accentColor}
                    />
                </div>
            </div>
            <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setIsPreviewOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveAndDownload} variant="gradient" disabled={!user || isSaving}>
                    {isSaving ? <Cpu className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4"/>}
                    {isSaving ? 'Saving...' : 'Save & Download PDF'}
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

    