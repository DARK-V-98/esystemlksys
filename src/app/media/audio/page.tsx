'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Music, ArrowLeft, Upload, ListMusic, Play, Pause, SkipForward, SkipBack, X, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/sonner';

interface PlaylistItem {
  name: string;
  src: string;
}

export default function AudioPlayerPage() {
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying && currentTrackIndex !== null) {
        audio.play().catch(e => console.error("Audio play failed:", e));
      } else {
        audio.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newItems: PlaylistItem[] = Array.from(files).map(file => ({
        name: file.name,
        src: URL.createObjectURL(file),
      }));
      setPlaylist(prev => [...prev, ...newItems]);
      if (currentTrackIndex === null && newItems.length > 0) {
        setCurrentTrackIndex(playlist.length);
      }
      toast.success(`${newItems.length} track(s) added to the playlist.`);
    }
  };

  const handleAddFilesClick = () => {
    fileInputRef.current?.click();
  };

  const playTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };
  
  const togglePlayPause = () => {
      if(currentTrackIndex === null && playlist.length > 0) {
        setCurrentTrackIndex(0);
      }
      setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (currentTrackIndex !== null) {
      const nextIndex = (currentTrackIndex + 1) % playlist.length;
      playTrack(nextIndex);
    }
  };
  
  const playPrev = () => {
    if (currentTrackIndex !== null) {
      const prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
      playTrack(prevIndex);
    }
  };
  
  const removeFromPlaylist = (index: number) => {
    setPlaylist(playlist.filter((_, i) => i !== index));
    if (index === currentTrackIndex) {
        if (playlist.length > 1) {
            playNext();
        } else {
            setCurrentTrackIndex(null);
            setIsPlaying(false);
        }
    } else if (currentTrackIndex !== null && index < currentTrackIndex) {
        setCurrentTrackIndex(currentTrackIndex - 1);
    }
    toast.info("Track removed from playlist.");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense animate-pulse-glow">
            <Music className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Audio <span className="text-primary neon-text">Player</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Create playlists and listen to your music.
            </p>
          </div>
        </div>
      </div>

      <Link href="/media" className="inline-flex items-center justify-center gap-2 rounded-xl h-12 px-5 text-sm font-bold transition-all duration-200 bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-primary">
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Media Center</span>
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Player Controls */}
        <div className="lg:col-span-1 rounded-xl bg-card border shadow-card p-6 flex flex-col items-center justify-center text-center">
            <Music className="h-20 w-20 text-primary mb-4"/>
            <p className="font-bold text-lg truncate max-w-full">
              {currentTrackIndex !== null ? playlist[currentTrackIndex].name : 'No Track Selected'}
            </p>
            <p className="text-muted-foreground text-sm">
              {playlist.length} track(s) in playlist
            </p>
            <audio
              ref={audioRef}
              src={currentTrackIndex !== null ? playlist[currentTrackIndex].src : ''}
              onEnded={playNext}
              muted={isMuted}
            />
            <div className="flex items-center gap-4 my-6">
                <Button onClick={playPrev} variant="ghost" size="icon" disabled={playlist.length === 0}>
                    <SkipBack className="h-6 w-6"/>
                </Button>
                <Button onClick={togglePlayPause} variant="gradient" size="icon" className="h-16 w-16 rounded-full" disabled={playlist.length === 0}>
                    {isPlaying ? <Pause className="h-8 w-8"/> : <Play className="h-8 w-8"/>}
                </Button>
                <Button onClick={playNext} variant="ghost" size="icon" disabled={playlist.length === 0}>
                    <SkipForward className="h-6 w-6"/>
                </Button>
            </div>
            <div className="flex items-center gap-4">
                <Button onClick={() => setIsMuted(!isMuted)} variant="ghost" size="icon">
                    {isMuted ? <VolumeX className="h-5 w-5"/> : <Volume2 className="h-5 w-5"/>}
                </Button>
            </div>
        </div>

        {/* Playlist */}
        <div className="lg:col-span-2 rounded-xl bg-card border shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2"><ListMusic className="h-6 w-6 text-primary"/> Playlist</h2>
                <Button onClick={handleAddFilesClick}>
                    <Upload className="mr-2 h-5 w-5"/>
                    Add Files
                </Button>
            </div>
             <Input
                type="file"
                accept="audio/*"
                multiple
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
            />
            <div className="max-h-96 overflow-y-auto space-y-2">
                {playlist.length > 0 ? (
                    playlist.map((track, index) => (
                        <div key={index} 
                            className={cn("flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors",
                                currentTrackIndex === index ? 'bg-primary/10' : 'hover:bg-secondary'
                            )}
                            onClick={() => playTrack(index)}
                        >
                            <div className="flex items-center gap-3">
                                <span className={cn("font-semibold text-sm", currentTrackIndex === index && 'text-primary')}>
                                    {index + 1}.
                                </span>
                                <p className="font-medium truncate text-sm">{track.name}</p>
                            </div>
                            <Button onClick={(e) => { e.stopPropagation(); removeFromPlaylist(index); }} variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                <X className="h-4 w-4"/>
                            </Button>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-16 text-muted-foreground">
                        <p>Your playlist is empty.</p>
                        <p>Click "Add Files" to start.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
