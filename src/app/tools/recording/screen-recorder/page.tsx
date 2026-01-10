'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ScreenShare, Video, Play, StopCircle, Download, Cpu } from 'lucide-react';
import { toast } from 'sonner';

export default function ScreenRecorderPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startRecording = async () => {
    setVideoUrl(null);
    recordedChunksRef.current = [];
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: "screen" } as any,
        audio: true,
      });
      setStream(displayStream);
      
      // Show stream preview
      if (videoRef.current) {
        videoRef.current.srcObject = displayStream;
      }
      
      const options = { mimeType: 'video/webm; codecs=vp9' };
      const mediaRecorder = new MediaRecorder(displayStream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        if (videoRef.current) {
            videoRef.current.srcObject = null;
            videoRef.current.src = url;
        }
        // Stop all tracks to remove the recording indicator
        stream?.getTracks().forEach(track => track.stop());
        setStream(null);
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success('Screen recording started!');

    } catch (err) {
      console.error("Error: " + err);
      toast.error('Could not start screen recording. Please grant permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.info('Screen recording stopped.');
    }
  };
  
  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  const handleDownload = () => {
    if (videoUrl) {
      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = `recording-${Date.now()}.webm`;
      a.click();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <ScreenShare className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Screen <span className="text-primary neon-text">Recorder</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Record your screen, a window, or a tab with audio.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
        <Link href="/tools" className="inline-flex items-center justify-center gap-2 rounded-xl h-12 px-5 text-sm font-bold transition-all duration-200 bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-primary">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Tools</span>
        </Link>
        
        <div className="bg-secondary/50 border rounded-lg p-6 space-y-4">
            <div className="aspect-video bg-black rounded-lg flex items-center justify-center overflow-hidden">
                <video ref={videoRef} className="w-full h-full" autoPlay muted={isRecording} controls={!!videoUrl} />
                 {!stream && !videoUrl && (
                    <div className="text-center text-muted-foreground">
                        <Video className="h-16 w-16 mx-auto mb-4"/>
                        <h3 className="text-lg font-semibold">Recording Preview</h3>
                        <p>Your screen recording will appear here.</p>
                    </div>
                )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleToggleRecording} size="lg" className="flex-1" variant={isRecording ? 'destructive' : 'gradient'}>
                    {isRecording ? <StopCircle className="mr-2 h-5 w-5"/> : <Play className="mr-2 h-5 w-5"/>}
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                </Button>
                <Button onClick={handleDownload} size="lg" disabled={!videoUrl || isRecording}>
                    <Download className="mr-2 h-5 w-5"/>
                    Download Video
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
