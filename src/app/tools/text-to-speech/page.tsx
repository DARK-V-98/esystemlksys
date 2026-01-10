'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, AudioLines, Download, Cpu, Play } from 'lucide-react';
import { toast } from 'sonner';
// import { textToSpeech } from '@/ai/flows/text-to-speech';

export default function TextToSpeechPage() {
  const [text, setText] = useState('Hello, this is a test of the text to speech system.');
  const [audioUrl, setAudioUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast.error("Please enter some text to convert.");
      return;
    }
    setIsGenerating(true);
    setAudioUrl('');
    toast.info("Generating audio, please wait...");
    try {
      // const result = await textToSpeech(text);
      // NOTE: AI functionality is temporarily disabled.
      const result: {media: string} | null = null;
      if (result?.media) {
        setAudioUrl(result.media);
        toast.success("Audio generated successfully!");
      } else {
        throw new Error("Text-to-speech functionality is temporarily disabled.");
      }
    } catch(e: any) {
      console.error(e);
      toast.error(e.message || "Failed to generate audio. The service may be unavailable.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <AudioLines className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Text to <span className="text-primary neon-text">Speech</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Convert written text into natural-sounding audio.
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
            <div className="space-y-2">
                <Textarea
                    placeholder="Enter text to convert to speech..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="min-h-[200px] text-base"
                />
            </div>
            <Button onClick={handleGenerate} variant="gradient" size="lg" className="w-full" disabled={isGenerating}>
                {isGenerating ? <Cpu className="mr-2 h-5 w-5 animate-spin" /> : <Play className="mr-2 h-5 w-5" />}
                {isGenerating ? 'Generating Audio...' : 'Generate & Play Audio'}
            </Button>
            
            {audioUrl && (
                <div className="pt-4 space-y-4">
                    <h3 className="text-lg font-semibold">Generated Audio</h3>
                    <audio controls src={audioUrl} className="w-full">
                        Your browser does not support the audio element.
                    </audio>
                     <a href={audioUrl} download="audio.wav">
                        <Button variant="outline" className="w-full">
                            <Download className="mr-2 h-5 w-5"/>
                            Download WAV
                        </Button>
                    </a>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
