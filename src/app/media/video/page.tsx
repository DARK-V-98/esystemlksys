'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Video, ArrowLeft, Upload } from 'lucide-react';

export default function VideoPlayerPage() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoSrc(URL.createObjectURL(file));
      setVideoTitle(file.name);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6 animate-fade-in">
       {/* Header */}
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense animate-pulse-glow">
            <Video className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Video <span className="text-primary neon-text">Player</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Play your local video files.
            </p>
          </div>
        </div>
      </div>

      <Link href="/media" className="inline-flex items-center justify-center gap-2 rounded-xl h-12 px-5 text-sm font-bold transition-all duration-200 bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-primary">
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Media Center</span>
      </Link>
      
      <div className="rounded-xl bg-card border shadow-card p-6 mt-6">
        <div className="aspect-video bg-black rounded-lg mb-4 flex items-center justify-center overflow-hidden">
          {videoSrc ? (
            <video src={videoSrc} controls autoPlay className="w-full h-full" />
          ) : (
            <div className="text-center text-muted-foreground">
                <Video className="h-16 w-16 mx-auto mb-4"/>
                <h3 className="text-lg font-semibold">No video selected</h3>
                <p>Click the button below to choose a video file.</p>
            </div>
          )}
        </div>

        {videoTitle && <p className="text-center font-semibold mb-4 truncate">{videoTitle}</p>}

        <Input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />
        <Button onClick={handleButtonClick} className="w-full" variant="gradient">
            <Upload className="mr-2 h-5 w-5"/>
            Choose Video File
        </Button>
      </div>
    </div>
  );
}
