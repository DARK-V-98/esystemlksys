'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ScreenShare, Video, Play, StopCircle, Download, Pause, Timer } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type RecordingState = 'idle' | 'recording' | 'paused' | 'stopped';

export default function ScreenRecorderPage() {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (recordingState === 'recording') {
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [recordingState]);

  const startRecording = async () => {
    setVideoUrl(null);
    recordedChunksRef.current = [];
    setRecordingTime(0);
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: "screen" } as any,
        audio: true,
      });
      setStream(displayStream);

      // Handle user closing the share modal
      displayStream.getVideoTracks()[0].onended = () => {
        if (recordingState !== 'stopped') {
            stopRecording(true);
        }
      };
      
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
        setRecordingState('stopped');
        if (videoRef.current) {
            videoRef.current.srcObject = null;
            videoRef.current.src = url;
        }
        stream?.getTracks().forEach(track => track.stop());
        setStream(null);
      };

      mediaRecorder.start();
      setRecordingState('recording');
      toast.success('Screen recording started!');

    } catch (err) {
      console.error("Error: " + err);
      toast.error('Could not start screen recording. Please grant permissions.');
      setRecordingState('idle');
    }
  };

  const stopRecording = (streamEnded = false) => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      if (streamEnded) {
        toast.info('Screen sharing stopped.');
      } else {
        toast.info('Screen recording stopped.');
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.pause();
        setRecordingState('paused');
        toast.warning('Recording paused.');
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
        mediaRecorderRef.current.resume();
        setRecordingState('recording');
        toast.success('Recording resumed.');
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
    const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }
  
  const handleDownload = () => {
    if (videoUrl) {
      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = `recording-${Date.now()}.webm`;
      a.click();
    }
  };

  const MainButton = () => {
    switch (recordingState) {
        case 'recording':
            return <Button onClick={pauseRecording} size="lg" className="flex-1" variant="destructive"><Pause className="mr-2 h-5 w-5"/>Pause</Button>;
        case 'paused':
            return <Button onClick={resumeRecording} size="lg" className="flex-1"><Play className="mr-2 h-5 w-5"/>Resume</Button>;
        case 'stopped':
            return <Button onClick={startRecording} size="lg" className="flex-1" variant="gradient"><Play className="mr-2 h-5 w-5"/>Record Again</Button>;
        default: // idle
            return <Button onClick={startRecording} size="lg" className="flex-1" variant="gradient"><Play className="mr-2 h-5 w-5"/>Start Recording</Button>;
    }
  }

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
            <div className="aspect-video bg-black rounded-lg flex items-center justify-center overflow-hidden relative">
                <video ref={videoRef} className="w-full h-full" autoPlay muted={recordingState !== 'stopped'} controls={!!videoUrl} />
                 {recordingState === 'idle' && (
                    <div className="text-center text-muted-foreground">
                        <Video className="h-16 w-16 mx-auto mb-4"/>
                        <h3 className="text-lg font-semibold">Recording Preview</h3>
                        <p>Your screen recording will appear here.</p>
                    </div>
                )}
                 {(recordingState === 'recording' || recordingState === 'paused') && (
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 text-white px-3 py-1 rounded-full">
                        <Timer className={cn("h-5 w-5", recordingState === 'recording' && "text-destructive animate-pulse")} />
                        <span className="font-mono text-lg font-bold">{formatTime(recordingTime)}</span>
                    </div>
                 )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <MainButton />
                {recordingState !== 'idle' && recordingState !== 'stopped' && (
                   <Button onClick={() => stopRecording()} size="lg" variant="outline"><StopCircle className="mr-2 h-5 w-5"/>Stop</Button>
                )}
                <Button onClick={handleDownload} size="lg" disabled={recordingState !== 'stopped'}>
                    <Download className="mr-2 h-5 w-5"/>
                    Download
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
